import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Home, Mail } from "lucide-react";
import UserInfoDialog from "@/components/UserInfoDialog";
import { paymentApi } from "@/lib/api";
import { toast } from "sonner";

export default function PaymentSuccessWithDialog() {
  const [searchParams] = useSearchParams();
  const [, navigate] = useNavigate();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const id = searchParams.orderId;
    if (!id) {
      navigate("/");
      return;
    }

    setOrderId(id);

    // 获取订单信息
    const fetchOrder = async () => {
      try {
        const orderData = await paymentApi.getOrder(id);
        setOrder(orderData);

        // 如果订单已支付且用户信息未提交，显示弹窗
        if (
          orderData.status === "PAID" &&
          !orderData.infoSubmitted
        ) {
          // 延迟显示弹窗，让用户先看到成功页面
          setTimeout(() => {
            setShowDialog(true);
          }, 500);
        }
      } catch (error: any) {
        toast.error(error.message || "获取订单信息失败");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-16 px-4">
        <div className="container max-w-2xl mx-auto">
          {/* 成功提示 */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">支付成功！</h1>
            <p className="text-xl text-slate-600">
              感谢您的购买，我们已收到您的订单
            </p>
          </div>

          {/* 订单信息卡片 */}
          <Card className="mb-8 bg-white border-slate-200">
            <CardHeader>
              <CardTitle>订单详情</CardTitle>
              <CardDescription>订单号：{orderId}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">套餐</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {order?.planName?.charAt(0).toUpperCase() +
                      order?.planName?.slice(1)}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">金额</p>
                  <p className="text-lg font-semibold text-slate-900">
                    ${order?.price} {order?.currency}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">状态</p>
                  <p className="text-lg font-semibold text-green-600">已支付</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">有效期</p>
                  <p className="text-lg font-semibold text-slate-900">6 个月</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 后续步骤 */}
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">后续步骤</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-900">完善您的信息</p>
                  <p className="text-slate-600 text-sm">
                    填写 B 站账号和手机号，我们会用于知识星球邀请和企业微信联系
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-900">加入知识星球</p>
                  <p className="text-slate-600 text-sm">
                    我们会将您拉入专属的知识星球社群，获取独家资源和指导
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  3
                </div>
                <div>
                  <p className="font-semibold text-slate-900">企业微信联系</p>
                  <p className="text-slate-600 text-sm">
                    我们的专业顾问会通过企业微信与您联系，为您提供个性化的求职指导
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 操作按钮 */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => setShowDialog(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 h-12 text-base"
            >
              <Mail className="mr-2 h-5 w-5" />
              填写信息
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="px-8 h-12 text-base"
            >
              <Home className="mr-2 h-5 w-5" />
              返回首页
            </Button>
          </div>

          {/* 常见问题 */}
          <Card className="mt-12 bg-white border-slate-200">
            <CardHeader>
              <CardTitle>常见问题</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Q: 我什么时候会被拉入知识星球？
                </h3>
                <p className="text-slate-600">
                  A: 提交信息后，我们会在 24 小时内将您拉入知识星球社群。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Q: 如何联系客服？
                </h3>
                <p className="text-slate-600">
                  A: 您可以通过企业微信与我们联系，或在知识星球社群中提问。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Q: 可以退款吗？
                </h3>
                <p className="text-slate-600">
                  A: 购买后 7 天内可以无条件退款，之后按比例退款。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 信息收集弹窗 */}
      {orderId && (
        <UserInfoDialog
          open={showDialog}
          orderId={orderId}
          onClose={() => setShowDialog(false)}
          onSuccess={() => {
            // 刷新订单信息
            if (orderId) {
              paymentApi.getOrder(orderId).then(setOrder);
            }
          }}
        />
      )}
    </>
  );
}
