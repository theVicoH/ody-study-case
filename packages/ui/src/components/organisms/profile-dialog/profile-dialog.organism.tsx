import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ProfileUser {
  firstName: string;
  lastName: string;
  email: string;
}

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ProfileUser;
  onSave: (data: { firstName: string; lastName: string }) => Promise<void>;
  onSignOut: () => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const AVATAR_SIZE_CLASS = "size-12";

const getInitials = (firstName: string, lastName: string): string => {
  const f = firstName.trim()[0] ?? "";
  const l = lastName.trim()[0] ?? "";

  return `${f}${l}`.toUpperCase();
};

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" }
] as const;

type LangCode = typeof LANGUAGES[number]["code"];

const ProfileDialog = ({
  open,
  onOpenChange,
  user,
  onSave,
  onSignOut,
  loading = false,
  error = null
}: ProfileDialogProps): React.JSX.Element => {
  const { t, i18n } = useTranslation("common");
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutConfirmOpen, setSignOutConfirmOpen] = useState(false);
  const [activeLang, setActiveLang] = useState<LangCode>((i18n.language.slice(0, 2) as LangCode) ?? "en");

  useEffect(() => {
    if (open) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
    }
  }, [open, user.firstName, user.lastName]);

  const isDirty =
    firstName.trim() !== user.firstName.trim() ||
    lastName.trim() !== user.lastName.trim();

  const handleSave = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!isDirty || saving) return;
    setSaving(true);
    try {
      await onSave({ firstName: firstName.trim(), lastName: lastName.trim() });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async (): Promise<void> => {
    setSignOutConfirmOpen(false);
    setSigningOut(true);
    try {
      await onSignOut();
    } finally {
      setSigningOut(false);
    }
  };

  const handleLangChange = (code: LangCode): void => {
    setActiveLang(code);
    void i18n.changeLanguage(code);
  };

  const isLoading = loading || saving || signingOut;
  const initials = getInitials(firstName || user.firstName, lastName || user.lastName);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* eslint-disable-next-line custom/enforce-spacing-tokens */}
      <DialogContent className="w-[22rem]">
        <DialogHeader>
          <DialogTitle>{t("profile.title")}</DialogTitle>
        </DialogHeader>

        <div className="gap-sm flex items-center">
          <Avatar className={AVATAR_SIZE_CLASS}>
            {/* eslint-disable-next-line custom/enforce-typography-tokens */}
            <AvatarFallback className="typo-body-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            {/* eslint-disable-next-line custom/enforce-typography-tokens */}
            <span className="typo-body-sm font-medium">
              {user.firstName} {user.lastName}
            </span>
            <span className="text-muted-foreground typo-caption truncate">{user.email}</span>
          </div>
        </div>

        <Separator />

        <form id="profile-form" onSubmit={(e) => { void handleSave(e); }} className="gap-sm flex flex-col">
          <p className="text-muted-foreground typo-caption">{t("profile.sectionProfile")}</p>
          <div className="gap-xs flex flex-col">
            <Label htmlFor="profile-first-name">{t("profile.firstNameLabel")}</Label>
            <Input
              id="profile-first-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t("profile.firstNamePlaceholder")}
              disabled={isLoading}
              required
            />
          </div>
          <div className="gap-xs flex flex-col">
            <Label htmlFor="profile-last-name">{t("profile.lastNameLabel")}</Label>
            <Input
              id="profile-last-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t("profile.lastNamePlaceholder")}
              disabled={isLoading}
              required
            />
          </div>
          {error ? (
            <p className="text-destructive typo-caption">{error}</p>
          ) : null}
          <Button
            type="submit"
            form="profile-form"
            size="sm"
            disabled={!isDirty || isLoading}
            className="self-end"
          >
            {saving ? t("profile.saving") : t("profile.save")}
          </Button>
        </form>

        <Separator />

        <div className="gap-sm flex flex-col">
          <p className="text-muted-foreground typo-caption">{t("profile.sectionPreferences")}</p>
          <div className="gap-xs flex flex-col">
            <Label>{t("profile.languageLabel")}</Label>
            <div className="gap-xs flex">
              {LANGUAGES.map(({ code, label }) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleLangChange(code)}
                  disabled={isLoading}
                  className={cn(
                    "border-border typo-caption h-8 rounded-md border px-3 font-medium transition-colors",
                    activeLang === code
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground hover:bg-muted"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="w-full"
          onClick={() => setSignOutConfirmOpen(true)}
          disabled={isLoading}
        >
          {signingOut ? t("profile.signingOut") : t("profile.signOut")}
        </Button>
      </DialogContent>

      <Dialog open={signOutConfirmOpen} onOpenChange={setSignOutConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("profile.signOutConfirmTitle")}</DialogTitle>
            <DialogDescription>{t("profile.signOutConfirmDesc")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<button type="button" className="border-border text-foreground hover:bg-muted/50 px-md py-xs typo-button rounded-md border bg-transparent transition-colors" />}>
              {t("profile.signOutConfirmCancel")}
            </DialogClose>
            <button
              type="button"
              onClick={() => { void handleSignOut(); }}
              className="bg-destructive/10 text-destructive hover:bg-destructive/20 px-md py-xs typo-button rounded-md transition-all"
            >
              {t("profile.signOut")}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export { ProfileDialog };

export type { ProfileDialogProps, ProfileUser };
