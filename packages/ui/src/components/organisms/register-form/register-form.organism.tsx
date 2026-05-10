import React, { useRef, useState } from "react";

import { format } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { ArrowLeftIcon } from "@/components/icons/arrow-left/arrow-left.icon";
import { ArrowRightIcon } from "@/components/icons/arrow-right/arrow-right.icon";
import { CalendarIcon } from "@/components/icons/calendar/calendar.icon";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface RegisterPayload {
  firstName: string;
  lastName: string;
  birthday: string;
  email: string;
  password: string;
  image?: string;
}

interface RegisterFormProps {
  isLoading: boolean;
  error: string | null;
  onSubmit: (payload: RegisterPayload) => void;
  onSwitchToLogin: () => void;
}

const TOTAL_STEPS = 3;
const MIN_PASSWORD_LENGTH = 8;
const MIN_BIRTH_YEAR = 1900;

const isEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const RegisterForm = ({
  isLoading,
  error,
  onSubmit,
  onSwitchToLogin
}: RegisterFormProps): React.JSX.Element => {
  const { t } = useTranslation("auth");
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [birthday, setBirthday] = useState<Date | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [stepError, setStepError] = useState<string | null>(null);

  const today = new Date();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const goNext = (): void => {
    setStepError(null);
    if (step === 0) {
      if (!firstName.trim()) return setStepError("firstNameRequired");
      if (!lastName.trim()) return setStepError("lastNameRequired");
    }
    if (step === 1) {
      if (!birthday) return setStepError("birthdayRequired");
    }
    setStep((prev) => (prev < 2 ? ((prev + 1) as 0 | 1 | 2) : prev));
  };

  const goBack = (): void => {
    setStepError(null);
    setStep((prev) => (prev > 0 ? ((prev - 1) as 0 | 1 | 2) : prev));
  };

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    setStepError(null);
    if (step !== 2) {
      goNext();

      return;
    }
    if (!email || !isEmail(email)) return setStepError("emailInvalid");
    if (!password) return setStepError("passwordRequired");
    if (password.length < MIN_PASSWORD_LENGTH) return setStepError("passwordTooShort");
    if (password !== passwordConfirm) return setStepError("passwordMismatch");
    if (isLoading) return;
    if (!birthday) return setStepError("birthdayRequired");
    onSubmit({
      firstName,
      lastName,
      birthday: format(birthday, "yyyy-MM-dd"),
      email,
      password,
      image
    });
  };

  const variants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const displayError = error ?? stepError;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <span className="text-muted-foreground text-xs tracking-wide uppercase">
          {t("register.stepLabel", { current: step + 1, total: TOTAL_STEPS })}
        </span>
        <div className="flex w-full gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
            <motion.div
              key={index}
              className="h-1 flex-1 rounded-full"
              initial={false}
              animate={{
                backgroundColor:
                  index <= step
                    ? "var(--color-primary)"
                    : "var(--color-border)"
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          ))}
        </div>
      </div>

      <div className="relative min-h-[14rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="flex flex-col gap-5"
          >
            {step === 0 && (
              <>
                <div className="flex flex-col gap-1">
                  <h1 className="text-foreground text-xl font-semibold tracking-tight">
                    {t("register.step1.title")}
                  </h1>
                  <p className="text-muted-foreground text-sm">{t("register.step1.description")}</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    aria-label={t("register.step1.photoLabel")}
                    className={`
                      border-border bg-muted hover:bg-accent relative size-20 overflow-hidden rounded-full
                      border-2 border-dashed transition-colors disabled:pointer-events-none disabled:opacity-50
                    `}
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={t("register.step1.photoLabel")}
                        className="size-full object-cover"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-muted-foreground absolute inset-0 m-auto size-8"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                      </svg>
                    )}
                  </button>
                  <span className="text-muted-foreground text-xs">{t("register.step1.photoHint")}</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageChange}
                    disabled={isLoading}
                  />
                </div>
                <FieldGroup>
                  <Field orientation="vertical">
                    <FieldLabel htmlFor="register-firstname">
                      {t("register.step1.firstNameLabel")}
                    </FieldLabel>
                    <Input
                      id="register-firstname"
                      type="text"
                      autoComplete="given-name"
                      placeholder={t("register.step1.firstNamePlaceholder")}
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      disabled={isLoading}
                      aria-invalid={stepError === "firstNameRequired"}
                      required
                    />
                  </Field>
                  <Field orientation="vertical">
                    <FieldLabel htmlFor="register-lastname">
                      {t("register.step1.lastNameLabel")}
                    </FieldLabel>
                    <Input
                      id="register-lastname"
                      type="text"
                      autoComplete="family-name"
                      placeholder={t("register.step1.lastNamePlaceholder")}
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      disabled={isLoading}
                      aria-invalid={stepError === "lastNameRequired"}
                      required
                    />
                  </Field>
                </FieldGroup>
              </>
            )}

            {step === 1 && (
              <>
                <div className="flex flex-col gap-1">
                  <h1 className="text-foreground text-xl font-semibold tracking-tight">
                    {t("register.step2.title")}
                  </h1>
                  <p className="text-muted-foreground text-sm">{t("register.step2.description")}</p>
                </div>
                <FieldGroup>
                  <Field orientation="vertical">
                    <FieldLabel htmlFor="register-birthday">
                      {t("register.step2.birthdayLabel")}
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger
                        id="register-birthday"
                        disabled={isLoading}
                        aria-invalid={stepError === "birthdayRequired"}
                        className={cn(
                          `glass-input text-foreground hover:bg-input/50 group inline-flex h-9
                          w-full items-center justify-between gap-2 rounded-4xl px-3 text-sm
                          outline-none transition-colors disabled:pointer-events-none disabled:opacity-50
                          aria-invalid:border-destructive`,
                          !birthday && "text-muted-foreground"
                        )}
                      >
                        <span>
                          {birthday
                            ? format(birthday, "PPP")
                            : t("register.step2.birthdayLabel")}
                        </span>
                        <CalendarIcon size={16} className="text-muted-foreground" />
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={birthday}
                          onSelect={setBirthday}
                          captionLayout="dropdown"
                          fromYear={MIN_BIRTH_YEAR}
                          toDate={today}
                          defaultMonth={birthday ?? new Date(2000, 0, 1)}
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                </FieldGroup>
              </>
            )}

            {step === 2 && (
              <>
                <div className="flex flex-col gap-1">
                  <h1 className="text-foreground text-xl font-semibold tracking-tight">
                    {t("register.step3.title")}
                  </h1>
                  <p className="text-muted-foreground text-sm">{t("register.step3.description")}</p>
                </div>
                <FieldGroup>
                  <Field orientation="vertical">
                    <FieldLabel htmlFor="register-email">
                      {t("register.step3.emailLabel")}
                    </FieldLabel>
                    <Input
                      id="register-email"
                      type="email"
                      autoComplete="email"
                      placeholder={t("register.step3.emailPlaceholder")}
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      disabled={isLoading}
                      aria-invalid={!!error || stepError === "emailInvalid"}
                      required
                    />
                  </Field>
                  <Field orientation="vertical">
                    <FieldLabel htmlFor="register-password">
                      {t("register.step3.passwordLabel")}
                    </FieldLabel>
                    <Input
                      id="register-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder={t("register.step3.passwordPlaceholder")}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      disabled={isLoading}
                      aria-invalid={
                        stepError === "passwordRequired" || stepError === "passwordTooShort"
                      }
                      minLength={MIN_PASSWORD_LENGTH}
                      required
                    />
                    <p className="text-muted-foreground text-xs">{t("register.step3.passwordHint")}</p>
                  </Field>
                  <Field orientation="vertical">
                    <FieldLabel htmlFor="register-password-confirm">
                      {t("register.step3.passwordConfirmLabel")}
                    </FieldLabel>
                    <Input
                      id="register-password-confirm"
                      type="password"
                      autoComplete="new-password"
                      placeholder={t("register.step3.passwordConfirmPlaceholder")}
                      value={passwordConfirm}
                      onChange={(event) => setPasswordConfirm(event.target.value)}
                      disabled={isLoading}
                      aria-invalid={stepError === "passwordMismatch"}
                      required
                    />
                  </Field>
                </FieldGroup>
              </>
            )}

            {displayError && (
              <FieldError errors={[{ message: t(`errors.${displayError}`, displayError) }]} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-2">
        {step === 2 ? (
          <Button
            type="submit"
            disabled={isLoading || !email || !password || !passwordConfirm}
            className="w-full"
          >
            {isLoading ? t("register.submitting") : t("register.submit")}
          </Button>
        ) : (
          <Button type="button" onClick={goNext} disabled={isLoading} className="w-full">
            {t("register.continue")}
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        )}

        {step > 0 && (
          <button
            type="button"
            onClick={goBack}
            disabled={isLoading}
            className={`
              text-muted-foreground hover:text-foreground inline-flex items-center justify-center gap-1
              self-center rounded-full px-2 py-1 text-xs font-medium transition-colors
              disabled:pointer-events-none disabled:opacity-50
            `}
          >
            <ArrowLeftIcon size={12} />
            {t("register.back")}
          </button>
        )}
      </div>

      <p className="text-muted-foreground text-center text-sm">
        {t("register.hasAccount")}{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          disabled={isLoading}
          className={`
            text-foreground font-medium underline-offset-4 transition hover:underline
            disabled:opacity-50
          `}
        >
          {t("register.signIn")}
        </button>
      </p>
    </form>
  );
};

export { RegisterForm };

export type { RegisterFormProps, RegisterPayload };
