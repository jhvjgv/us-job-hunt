import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useLocalAuth } from "@/contexts/LocalAuthContext";
import { useQueryClient } from "@tanstack/react-query";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useLocalAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

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
    if (!formData.email || !formData.password) {
      toast.error("请填写所有必填项");
      setIsLoading(false);
      return;
    }

    try {
      const result = await authApi.login({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("authToken", result.token);
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

      login({
        id: result.id,
        email: result.email,
        name: result.name || "",
      });

      toast.success(`欢迎回来，${result.name || "用户"}！`);
      // Redirect to home after login
      setLocation("/");
    } catch (error: any) {
      const errorMsg = error?.message || "登录失败，请重试";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-white">登录账户</CardTitle>
          <CardDescription className="text-slate-400">
            登录美职通，继续你的求职之旅
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

            {/* 密码 */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                密码
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="输入密码"
                value={formData.password}
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
                  登录中...
                </>
              ) : (
                "登录"
              )}
            </Button>

            {/* 注册链接 */}
            <div className="text-center text-sm text-slate-400">
              还没有账户？{" "}
              <button
                type="button"
                onClick={() => setLocation("/register")}
                className="text-orange-500 hover:text-orange-400 font-medium"
              >
                立即注册
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
