import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { paymentApi } from "@/lib/api";
import { CheckCircle, Loader2 } from "lucide-react";

export default function PaymentSuccess() {
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("orderId");
    if (id) {
      setOrderId(id);
    }
  }, []);

  const { data: order, isLoading } = useQuery({
    queryKey: ["payment", "order", orderId],
    queryFn: () => paymentApi.getOrder(orderId!),
    enabled: Boolean(orderId),
  });

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>错误</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">订单 ID 不存在</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">支付成功！</CardTitle>
          <CardDescription>感谢你的购买</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">订单号</span>
              <span className="font-mono text-sm text-slate-900">{order?.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">套餐</span>
              <span className="font-semibold text-slate-900">{order?.planName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">金额</span>
              <span className="font-semibold text-slate-900">
                ${order?.price} {order?.currency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">状态</span>
              <span className="font-semibold text-green-600">已支付</span>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-slate-900 mb-2">接下来的步骤：</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
              <li>我们将在 24 小时内为你开通课程权限</li>
              <li>你将收到一封邮件，包含登录链接和课程资料</li>
              <li>可以立即开始学习求职技巧和面试准备</li>
              <li>有任何问题可以联系我们的客服团队</li>
            </ol>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => (window.location.href = "/")}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              返回首页
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="w-full"
            >
              查看课程
            </Button>
          </div>

          <p className="text-xs text-slate-500 text-center">订单确认邮件已发送至你的邮箱</p>
        </CardContent>
      </Card>
    </div>
  );
}
