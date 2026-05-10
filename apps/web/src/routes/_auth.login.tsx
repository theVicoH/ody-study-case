import React, { useState } from "react";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LoginForm } from "@workspace/ui/components/organisms/login-form/login-form.organism";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import type { LoginCredentials } from "@workspace/ui/components/organisms/login-form/login-form.organism";

import { signIn } from "@/lib/auth/auth.client";


const LoginRoute = (): React.JSX.Element => {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    setError(null);
    const toastId = toast.loading(t("login.submitting"));

    try {
      const result = await signIn.email({
        email: credentials.email,
        password: credentials.password,
        rememberMe: true
      });

      if (result.error) {
        const code = result.error.code === "INVALID_EMAIL_OR_PASSWORD"
          ? "invalidCredentials"
          : "unknown";

        setError(code);
        toast.error(t("login.errorToast"), { id: toastId, description: t(`errors.${code}`) });

        return;
      }

      toast.success(t("login.successToast"), { id: toastId });
      await navigate({ to: "/" });
    } catch {
      setError("unknown");
      toast.error(t("login.errorToast"), { id: toastId, description: t("errors.unknown") });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitch = async (): Promise<void> => {
    await navigate({ to: "/register" });
  };

  return (
    <LoginForm
      isLoading={isLoading}
      error={error}
      onSubmit={(credentials) => { void handleSubmit(credentials); }}
      onSwitchToRegister={() => { void handleSwitch(); }}
    />
  );
};

export const Route = createFileRoute("/_auth/login")({
  component: LoginRoute
});
