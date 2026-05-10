import React, { useState } from "react";

import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginFormProps {
  isLoading: boolean;
  error: string | null;
  onSubmit: (credentials: LoginCredentials) => void;
  onSwitchToRegister: () => void;
}

const LoginForm = ({
  isLoading,
  error,
  onSubmit,
  onSwitchToRegister
}: LoginFormProps): React.JSX.Element => {
  const { t } = useTranslation("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (!email || !password || isLoading) return;
    onSubmit({ email, password });
  };

  const isDisabled = !email || !password || isLoading;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-foreground text-xl font-semibold tracking-tight">
          {t("login.title")}
        </h1>
        <p className="text-muted-foreground text-sm">{t("login.description")}</p>
      </div>

      <FieldGroup>
        <Field orientation="vertical">
          <FieldLabel htmlFor="login-email">{t("login.emailLabel")}</FieldLabel>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder={t("login.emailPlaceholder")}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isLoading}
            aria-invalid={!!error}
            required
          />
        </Field>

        <Field orientation="vertical">
          <FieldLabel htmlFor="login-password">{t("login.passwordLabel")}</FieldLabel>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder={t("login.passwordPlaceholder")}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isLoading}
            aria-invalid={!!error}
            required
          />
          {error && <FieldError errors={[{ message: t(`errors.${error}`, error) }]} />}
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={isDisabled} className="w-full">
        {isLoading ? t("login.submitting") : t("login.submit")}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        {t("login.noAccount")}{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          disabled={isLoading}
          className={`
            text-foreground font-medium underline-offset-4 transition hover:underline
            disabled:opacity-50
          `}
        >
          {t("login.createAccount")}
        </button>
      </p>
    </form>
  );
};

export { LoginForm };

export type { LoginCredentials, LoginFormProps };
