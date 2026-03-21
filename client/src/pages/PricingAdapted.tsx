import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { paymentApi, type PricingPlanDto } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";

export default function PricingAdapted() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [plans, setPlans] = useState<PricingPlanDto[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);

  // 在组件挂载时获取定价方案
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await paymentApi.getPricingPlans();
        setPlans(data);
      } catch (error: any) {
        toast.error(error.message || "Failed to load pricing plans");
      } finally {
        setPlansLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handlePayment = async (planId: string) => {
    if (!email || !name) {
      toast.error("请填写邮箱和姓名");
      return;
    }

    setIsLoading(true);
    try {
      const result = await paymentApi.createOrder({
        planId,
        email,
        name,
      });

      // 重定向到支付宝支付页面
      window.location.href = result.paymentUrl;
    } catch (error: any) {
      toast.error(error.message || "创建订单失败");
    } finally {
      setIsLoading(false);
    }
  };

  if (plansLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-16 px-4">
      <div className="container max-w-6xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">选择你的求职套餐</h1>
          <p className="text-xl text-slate-600">
            专业的求职辅导，帮助你成功拿到美国科技公司 Offer
          </p>
        </div>

        {/* 用户信息表单 */}
        <Card className="mb-12 bg-white border-slate-200">
          <CardHeader>
            <CardTitle>你的信息</CardTitle>
            <CardDescription>请填写你的基本信息以完成购买</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">姓名</Label>
                <Input
                  id="name"
                  placeholder="张三"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 定价卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans?.map((plan) => (
            <Card
              key={plan.id}
              className={`relative bg-white border-2 transition-all ${
                selectedPlan === plan.id
                  ? "border-orange-500 shadow-lg"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {/* 推荐标签 */}
              {plan.id === "pro" && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    推荐
                  </span>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* 价格 */}
                <div>
                  <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                  <span className="text-slate-600 ml-2">USD</span>
                </div>

                {/* 功能列表 */}
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* 购买按钮 */}
                <Button
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    handlePayment(plan.id);
                  }}
                  disabled={isLoading}
                  className={`w-full h-12 text-base font-semibold ${
                    plan.id === "pro"
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "bg-slate-200 hover:bg-slate-300 text-slate-900"
                  }`}
                >
                  {isLoading && selectedPlan === plan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      处理中...
                    </>
                  ) : (
                    "立即购买"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 常见问题 */}
        <div className="mt-16 bg-white rounded-lg p-8 border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">常见问题</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">可以升级或降级套餐吗？</h3>
              <p className="text-slate-600">
                可以。购买后 7 天内可以无条件升级到更高级套餐，差价按比例退款。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">套餐有有效期吗？</h3>
              <p className="text-slate-600">
                所有套餐自购买之日起有效期为 6 个月。期间可以无限次使用所有服务。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">支持哪些支付方式？</h3>
              <p className="text-slate-600">
                目前支持支付宝支付。我们将很快支持微信支付和信用卡支付。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
