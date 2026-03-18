import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useLocalAuth } from "@/contexts/LocalAuthContext";

export default function Register() {
  const [, setLocation] = useLocation();
  const { login } = useLocalAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const registerMutation = trpc.auth.local.register.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 前端验证
    if (!formData.email || !formData.password || !formData.name) {
      toast.error("请填写所有必填项");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("两次输入的密码不一致");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      toast.error("密码至少 8 个字符");
      setIsLoading(false);
      return;
    }

    try {
      const result = await registerMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      // Auto login
      login({
        id: result.id,
        email: result.email,
        name: result.name || "",
      });

      toast.success("注册成功！");
      // Redirect to home after registration
      setLocation("/");
    } catch (error: any) {
      const errorMsg = error?.message || "注册失败，请重试";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-white">创建账户</CardTitle>
          <CardDescription className="text-slate-400">
            加入美职通，开启美国求职之旅
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 邮箱 */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                邮箱
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            {/* 名字 */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300">
                名字
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="张三"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            {/* 密码 */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                密码
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="至少 8 个字符"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
              <p className="text-xs text-slate-400">
                密码需包含大小写字母和数字
              </p>
            </div>

            {/* 确认密码 */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-300">
                确认密码
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="再次输入密码"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            {/* 提交按钮 */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  注册中...
                </>
              ) : (
                "注册"
              )}
            </Button>

            {/* 登录链接 */}
            <div className="text-center text-sm text-slate-400">
              已有账户？{" "}
              <button
                type="button"
                onClick={() => setLocation("/login")}
                className="text-orange-500 hover:text-orange-400 font-medium"
              >
                立即登录
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
