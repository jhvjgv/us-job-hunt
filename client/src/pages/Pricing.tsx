import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { paymentApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: ["payment", "plans"],
    queryFn: () => paymentApi.getPricingPlans(),
  });

  const createOrderMutation = useMutation({
    mutationFn: paymentApi.createOrder,
  });

  const handlePayment = async (planId: string) => {
    if (!email || !name) {
      toast.error("请填写邮箱和姓名");
      return;
    }

    setIsLoading(true);
    try {
      const result = await createOrderMutation.mutateAsync({
        planId: planId as "starter" | "pro" | "elite",
        email,
        name,
      });

      window.location.href = result.paymentUrl;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "创建订单失败";
      toast.error(msg);
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
          <h1 className="text-4xl font-bold text-slate-900 mb-2">选择你的求职套餐</h1>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Choose your plan · Athena Programming</p>
          <p className="text-xl text-slate-600 mt-4">
            专业辅导，助力美国科技公司 Offer · Coaching for US tech offers
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
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative border-2 transition-all hover:shadow-xl ${
                selectedPlan === plan.id
                  ? "border-orange-500 shadow-lg"
                  : "border-slate-200"
              }`}
            >
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                  <span className="text-slate-600 ml-2">USD</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    handlePayment(plan.id);
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
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
      </div>
    </div>
  );
}
