"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { updateUserPassword } from "@/app/actions/auth";
import { Lock, AlertCircle } from "lucide-react";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordVal = watch("password", "");

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score, label: "", color: "bg-zinc-200 dark:bg-zinc-800" };
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    switch (score) {
      case 1:
        return { score, label: "Weak", color: "bg-red-500" };
      case 2:
        return { score, label: "Fair", color: "bg-orange-500" };
      case 3:
        return { score, label: "Good", color: "bg-yellow-500" };
      case 4:
        return { score, label: "Strong", color: "bg-brand-green" };
      default:
        return { score, label: "", color: "bg-zinc-200 dark:bg-zinc-800" };
    }
  };

  const strength = getPasswordStrength(passwordVal);

  const onSubmit = async (values: ResetPasswordValues) => {
    setIsLoading(true);
    const res = await updateUserPassword(values.password);
    setIsLoading(false);

    if (res.error) {
      addToast(res.error, "error");
    } else {
      addToast(res.message || "Password updated successfully!", "success");
      router.push("/auth/sign-in");
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header inside Card */}
      <div className="text-center select-none mb-1">
        <h2 className="text-lg font-bold text-brand-navy dark:text-foreground">
          Reset Password
        </h2>
        <p className="text-xs text-on-surface-variant/80 font-medium">
          Enter your new password details to recover workspace access
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Input
            type="password"
            label="New Password"
            placeholder="••••••••"
            disabled={isLoading}
            {...register("password")}
          />
          {passwordVal && (
            <div className="flex flex-col gap-1 mt-1.5 select-none">
              <div className="flex justify-between items-center text-[10px] font-bold text-on-surface-variant">
                <span>Password Strength</span>
                <span className="text-brand-navy dark:text-foreground">{strength.label}</span>
              </div>
              <div className="h-1.5 w-full bg-brand-slate dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${strength.color}`}
                  style={{ width: `${(strength.score / 4) * 100}%` }}
                />
              </div>
            </div>
          )}
          {errors.password && (
            <span className="text-[10px] text-danger font-semibold mt-0.5 flex items-start gap-1 leading-normal">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>{errors.password.message}</span>
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Input
            type="password"
            label="Confirm New Password"
            placeholder="••••••••"
            disabled={isLoading}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <span className="text-[10px] text-danger font-semibold mt-0.5 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 shrink-0" />
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <Button type="submit" isLoading={isLoading} className="mt-1 w-full" variant="primary">
          Update Password
        </Button>
      </form>
    </div>
  );
}
