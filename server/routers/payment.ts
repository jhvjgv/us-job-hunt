import { z } from "zod";
import { eq } from "drizzle-orm";
import { publicProcedure, router } from "../_core/trpc";
import { generateAlipayPaymentUrl, PRICING_PLANS } from "../alipay.utils";
import { getDb } from "../db";
import { orders, localUsers } from "../../drizzle/schema";

export const paymentRouter = router({
  /**
   * 创建订单并生成支付宝支付链接
   */
  createOrder: publicProcedure
    .input(
      z.object({
        planId: z.enum(["starter", "pro", "elite"]),
        email: z.string().email(),
        name: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { planId, email, name } = input;

      // 验证套餐是否存在
      if (!PRICING_PLANS[planId as keyof typeof PRICING_PLANS]) {
        throw new Error("Invalid plan");
      }

      const plan = PRICING_PLANS[planId as keyof typeof PRICING_PLANS];

      // 生成订单号（时间戳 + 随机数）
      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      // 保存订单到数据库
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        // 先查找或创建用户
        const existingUsers = await db
          .select()
          .from(localUsers)
          .where(eq(localUsers.email, email));

        let userId: number;

        if (existingUsers.length > 0) {
          userId = existingUsers[0].id;
        } else {
          // 创建新用户（不需要密码，因为这是通过支付创建的）
          const result = await db.insert(localUsers).values({
            email: email,
            passwordHash: "", // 空密码哈希，用户稍后可以设置
            name: name,
            isVerified: false,
          });

          // 获取插入的用户 ID
          const insertedUsers = await db
            .select()
            .from(localUsers)
            .where(eq(localUsers.email, email));
          userId = insertedUsers[0].id;
        }

        // 创建订单
        await db.insert(orders).values({
          userId: userId,
          planName: planId,
          price: plan.price.toString(),
          currency: "USD",
          status: "pending",
          paymentMethod: "alipay",
          transactionId: orderId,
          createdAt: new Date(),
        });
      } catch (error) {
        console.error("Failed to create order:", error);
        throw new Error("Failed to create order");
      }

      // 生成支付宝支付链接
      const paymentUrl = generateAlipayPaymentUrl({
        orderId: orderId,
        amount: plan.price,
        subject: `美职通 - ${plan.name} 套餐`,
        description: `华人程序员美国求职辅导 - ${plan.name} 套餐`,
        returnUrl: `${process.env.VITE_FRONTEND_FORGE_API_URL || "http://localhost:3000"}/payment/success?orderId=${orderId}`,
        notifyUrl: `${process.env.VITE_FRONTEND_FORGE_API_URL || "http://localhost:3000"}/api/trpc/payment.notifyAlipay`,
      });

      return {
        orderId,
        paymentUrl,
        plan: {
          id: plan.id,
          name: plan.name,
          price: plan.price,
          description: plan.description,
        },
      };
    }),

  /**
   * 获取订单详情
   */
  getOrder: publicProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        const result = await db
          .select()
          .from(orders)
          .where(eq(orders.transactionId, input.orderId))
          .limit(1);

        if (result.length === 0) {
          throw new Error("Order not found");
        }

        return result[0];
      } catch (error) {
        console.error("Failed to get order:", error);
        throw new Error("Failed to get order");
      }
    }),

  /**
   * 支付宝回调通知（异步）
   * 支付宝会在支付成功后调用此接口
   */
  notifyAlipay: publicProcedure
    .input(
      z.object({
        out_trade_no: z.string(),
        trade_no: z.string(),
        trade_status: z.string(),
        total_amount: z.string(),
        timestamp: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { out_trade_no, trade_status } = input;

      // 验证交易状态
      if (trade_status !== "TRADE_SUCCESS" && trade_status !== "TRADE_FINISHED") {
        return { success: false, message: "Trade status not success" };
      }

      const db = await getDb();
      if (!db) {
        return { success: false, message: "Database not available" };
      }

      try {
        // 更新订单状态为已支付
        await db
          .update(orders)
          .set({
            status: "paid",
            paidAt: new Date(),
          })
          .where(eq(orders.transactionId, out_trade_no));

        return { success: true, message: "Order updated successfully" };
      } catch (error) {
        console.error("Failed to update order:", error);
        return { success: false, message: "Failed to update order" };
      }
    }),

  /**
   * 获取定价方案列表
   */
  getPricingPlans: publicProcedure.query(() => {
    return Object.values(PRICING_PLANS).map((plan) => ({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      description: plan.description,
      features: plan.features,
    }));
  }),
});
