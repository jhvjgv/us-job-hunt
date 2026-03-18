import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import {
  createLocalUser,
  getLocalUserByEmail,
  updateLocalUser,
} from "../db";
import {
  hashPassword,
  verifyPassword,
  isValidEmail,
  isStrongPassword,
} from "../auth.utils";
import { TRPCError } from "@trpc/server";

export const authLocalRouter = router({
  /**
   * 用户注册
   */
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email("邮箱格式不正确"),
        password: z.string().min(8, "密码至少 8 个字符"),
        name: z.string().min(2, "名字至少 2 个字符"),
        targetCompanies: z.array(z.string()).optional(),
        experienceYears: z.number().int().min(0).max(50).optional(),
      })
    )
    .mutation(async ({ input }) => {
      // 验证邮箱格式
      if (!isValidEmail(input.email)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "邮箱格式不正确",
        });
      }

      // 验证密码强度
      if (!isStrongPassword(input.password)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "密码必须至少 8 个字符，包含大小写字母和数字",
        });
      }

      // 检查邮箱是否已存在
      const existingUser = await getLocalUserByEmail(input.email);
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "该邮箱已被注册",
        });
      }

      // 创建用户
      const passwordHash = hashPassword(input.password);
      const newUser = await createLocalUser({
        email: input.email,
        passwordHash,
        name: input.name,
        targetCompanies: input.targetCompanies
          ? JSON.stringify(input.targetCompanies)
          : null,
        experienceYears: input.experienceYears,
        isVerified: false, // 实际应该发送验证邮件
      });

      if (!newUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "创建用户失败",
        });
      }

      // 返回用户信息（不包含密码哈希）
      return {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      };
    }),

  /**
   * 用户登录
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email("邮箱格式不正确"),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // 查找用户
      const user = await getLocalUserByEmail(input.email);
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "邮箱或密码错误",
        });
      }

      // 验证密码
      if (!verifyPassword(input.password, user.passwordHash)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "邮箱或密码错误",
        });
      }

      // 更新最后登录时间
      await updateLocalUser(user.id, {
        updatedAt: new Date(),
      });

      // 返回用户信息
      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    }),

  /**
   * 检查邮箱是否已注册
   */
  checkEmailExists: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const user = await getLocalUserByEmail(input.email);
      return {
        exists: !!user,
      };
    }),

  /**
   * 获取用户信息（需要登录）
   */
  getProfile: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      // 这里应该验证用户是否有权限查看该信息
      // 暂时简化实现
      return {
        id: input.userId,
        // 实际应该从数据库查询
      };
    }),
});
