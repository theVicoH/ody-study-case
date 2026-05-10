import React from "react";

import { BrandMark } from "@/components/atoms/brand-mark/brand-mark.atom";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps): React.JSX.Element => {
  return (
    <div className="bg-background relative min-h-svh w-full overflow-hidden">
      <div
        aria-hidden="true"
        className={`
          bg-primary/25 pointer-events-none absolute top-1/2 left-1/2 size-[40rem]
          -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl
        `}
      />
      <div
        aria-hidden="true"
        className={`
          bg-accent/15 pointer-events-none absolute -top-32 -right-32 size-[28rem]
          rounded-full blur-3xl
        `}
      />
      <div
        aria-hidden="true"
        className={`
          bg-secondary/15 pointer-events-none absolute -bottom-32 -left-32 size-[28rem]
          rounded-full blur-3xl
        `}
      />

      <div className="relative z-10 mx-auto flex min-h-svh w-[24rem] max-w-[calc(100%-3rem)] flex-col items-stretch justify-center gap-10 py-12">
        <div className="flex justify-center">
          <BrandMark />
        </div>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export { AuthLayout };

export type { AuthLayoutProps };
