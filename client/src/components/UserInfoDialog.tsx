import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Check } from "lucide-react";
import { paymentApi } from "@/lib/api";
import { toast } from "sonner";

interface UserInfoDialogProps {
  open: boolean;
  orderId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UserInfoDialog({
  open,
  orderId,
  onClose,
  onSuccess,
}: UserInfoDialogProps) {
  const [bilibiliAccount, setBilibiliAccount] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bilibiliAccount.trim()) {
      toast.error("请填写 B 站账号");
      return;
    }

    if (!phone.trim()) {
      toast.error("请填写手机号");
      return;
    }

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("手机号格式不正确");
      return;
    }

    setIsLoading(true);
    try {
      await paymentApi.updateUserInfo({
        orderId,
        bilibiliAccount,
        phone,
      });

      setSubmitted(true);
      toast.success("信息提交成功！");

      // 3 秒后关闭弹窗
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 3000);
    } catch (error: any) {
      toast.error(error.message || "提交失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        {!submitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">完善您的信息</DialogTitle>
              <DialogDescription className="text-base">
                为了更好地为您服务，请填写以下信息。我们会将您拉入知识星球并通过企业微信联系您。
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* B 站账号 */}
              <div className="space-y-2">
                <Label htmlFor="bilibili" className="text-base font-medium">
                  B 站账号 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="bilibili"
                  placeholder="请输入您的 B 站账号"
                  value={bilibiliAccount}
                  onChange={(e) => setBilibiliAccount(e.target.value)}
                  disabled={isLoading}
                  className="h-10"
                />
                <p className="text-sm text-slate-500">
                  例如：你的用户名或 UID
                </p>
              </div>

              {/* 手机号 */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-medium">
                  手机号 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="请输入您的手机号"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                  className="h-10"
                />
                <p className="text-sm text-slate-500">
                  用于企业微信和知识星球邀请
                </p>
              </div>

              {/* 提示信息 */}
              <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
                <p className="text-sm text-blue-900">
                  ℹ️ 提交后，我们会：
                </p>
                <ul className="mt-2 space-y-1 text-sm text-blue-800">
                  <li>• 将您拉入知识星球社群</li>
                  <li>• 通过企业微信与您联系</li>
                  <li>• 提供专业的求职指导服务</li>
                </ul>
              </div>

              {/* 按钮 */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 h-10"
                >
                  稍后填写
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-10 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      提交中...
                    </>
                  ) : (
                    "提交信息"
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl text-center">提交成功！</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center py-8 space-y-6">
              {/* 成功图标 */}
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>

              {/* 提示文本 */}
              <div className="text-center space-y-3">
                <p className="text-lg font-semibold text-slate-900">
                  感谢您的信息提交！
                </p>
                <p className="text-slate-600">
                  我们会尽快通过企业微信与您联系，<br />
                  并将您拉入知识星球社群。
                </p>
              </div>

              {/* 企业微信二维码 */}
              <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600 text-center mb-3">
                  您也可以扫码添加企业微信
                </p>
                <div className="w-48 h-48 bg-white rounded border border-slate-300 flex items-center justify-center">
                  <img
                    src="/qrcode-wechat.png"
                    alt="企业微信二维码"
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              </div>

              {/* 关闭提示 */}
              <p className="text-xs text-slate-500 text-center">
                窗口将在 3 秒后自动关闭...
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
