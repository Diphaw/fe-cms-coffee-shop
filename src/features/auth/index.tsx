"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth } from "@/lib/auth";
import { useLogin } from "@/api/domains/auth/query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Coffee, AlertCircle } from "lucide-react";
import { getErrorMessage } from "@/utils/error";

import { loginSchema, type LoginFormValues } from "./schema";
import { DEFAULT_FORM } from "./constants";

export default function LoginPageContent() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: DEFAULT_FORM,
  });

  // If already authenticated, redirect directly to dashboard
  useEffect(() => {
    if (auth.isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  const loginMutation = useLogin({
    onSuccess: (res) => {
      auth.setToken(res.data.token);
      router.push("/dashboard");
    },
    onError: (err) => {
      setError(getErrorMessage(err, "Email atau password salah."));
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    setError(null);
    loginMutation.mutate({ body: values });
  };

  const loading = loginMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0908] p-4 font-sans">
      <div className="w-full max-w-md">
        <Card className="border-border bg-card shadow-2xl">
          <CardHeader className="space-y-1.5 text-center">
            <Coffee className="w-10 h-10 text-[#c8a96e] mx-auto mb-2" />
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              Masuk ke Coffee CMS
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Gunakan akun administrator Anda untuk mengelola menu, meja, dan pesanan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Alamat Email <span className="text-destructive ml-0.5">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@coffeeshop.com"
                  {...register("email")}
                  className="bg-background border-border text-foreground focus:ring-ring"
                />
                {errors.email && (
                  <p className="text-xs text-destructive font-medium mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Kata Sandi <span className="text-destructive ml-0.5">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="bg-background border-border text-foreground focus:ring-ring"
                />
                {errors.password && (
                  <p className="text-xs text-destructive font-medium mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {error && (
                <div className="p-3 text-xs rounded-lg bg-destructive/15 text-destructive font-medium border border-destructive/25 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full font-bold cursor-pointer transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Masuk Sekarang"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
