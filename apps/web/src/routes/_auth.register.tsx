import React, { useState } from "react";

import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { RegisterForm } from "@workspace/ui/components/organisms/register-form/register-form.organism";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import type { RegisterPayload } from "@workspace/ui/components/organisms/register-form/register-form.organism";

import { signUp } from "@/lib/auth/auth.client";


const RegisterRoute = (): React.JSX.Element => {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (payload: RegisterPayload): Promise<void> => {
    setIsLoading(true);
    setError(null);
    const toastId = toast.loading(t("register.submitting"));

    try {
      const result = await signUp.email({
        email: payload.email,
        password: payload.password,
        name: `${payload.firstName} ${payload.lastName}`.trim(),
        firstName: payload.firstName,
        lastName: payload.lastName,
        birthday: new Date(payload.birthday),
        image: payload.image
      });

      if (result.error) {
        const code = result.error.code === "USER_ALREADY_EXISTS"
          ? "emailAlreadyExists"
          : "unknown";

        setError(code);
        toast.error(t("register.errorToast"), { id: toastId, description: t(`errors.${code}`) });

        return;
      }

      toast.success(t("register.successToast"), { id: toastId });
      await router.invalidate();
      await navigate({ to: "/", replace: true });
    } catch {
      setError("unknown");
      toast.error(t("register.errorToast"), { id: toastId, description: t("errors.unknown") });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitch = async (): Promise<void> => {
    await navigate({ to: "/login" });
  };

  return (
    <RegisterForm
      isLoading={isLoading}
      error={error}
      onSubmit={(payload) => { void handleSubmit(payload); }}
      onSwitchToLogin={() => { void handleSwitch(); }}
    />
  );
};

export const Route = createFileRoute("/_auth/register")({
  component: RegisterRoute
});
