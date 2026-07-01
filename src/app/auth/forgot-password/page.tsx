"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useToast } from "@/store/use-toast";
import { requestPasswordReset } from "@/app/actions/auth";
import { Mail, ArrowLeft, AlertCircle, Sparkles } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setIsLoading(true);
    const res = await requestPasswordReset(values.email);
    setIsLoading(false);

    if (res.error) {
      addToast(res.error, "error");
    } else {
      setSentEmail(values.email);
      setIsSent(true);
      addToast(res.message || "Reset link sent!", "success");
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header inside Card */}
      <div className="text-center select-none mb-1">
        <h2 className="text-lg font-bold text-brand-navy dark:text-foreground">
          Forgot Password
        </h2>
        <p className="text-xs text-on-surface-variant/80 font-medium">
          Enter your email to receive a password reset link
        </p>
      </div>

      {isSent ? (
        <div className="flex flex-col gap-4 text-center items-center">
          <span className="p-3 bg-brand-green/10 text-brand-green rounded-full border border-brand-green/20 self-center">
            <Mail className="h-6 w-6" />
          </span>
          <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
            We have sent a password reset link to <strong className="text-brand-navy dark:text-foreground">{sentEmail}</strong>.
            Please check your inbox or spam folder.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Input
              type="email"
              label="Email Address"
              placeholder="arjun@expendmore.com"
              disabled={isLoading}
              startIcon={<Mail className="h-4 w-4" />}
              {...register("email")}
            />
            {errors.email && (
              <span className="text-[10px] text-danger font-semibold mt-0.5 flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {errors.email.message}
              </span>
            )}
          </div>
          <Button type="submit" isLoading={isLoading} className="mt-2 w-full" variant="primary">
            Send Reset Link
          </Button>
        </form>
      )}

      {/* Redirect back to Login */}
      <Link
        href="/auth/sign-in"
        className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-on-surface-variant hover:text-brand-navy dark:hover:text-foreground select-none transition-colors py-1.5 border border-brand-border dark:border-border rounded-lg bg-brand-slate dark:bg-zinc-800"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Sign In</span>
      </Link>
    </div>
  );
}
