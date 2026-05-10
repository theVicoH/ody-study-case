import React from "react";

import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AuthLayout } from "@workspace/ui/components/layouts/auth-layout/auth-layout.layout";

import { getSession } from "@/lib/auth/auth.client";

const AuthLayoutRoute = (): React.JSX.Element => {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
};

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    try {
      const { data, error } = await getSession();

      if (!error && data?.user) throw redirect({ to: "/" });
    } catch (caught) {
      if (caught && typeof caught === "object" && "to" in caught) throw caught;
    }
  },
  component: AuthLayoutRoute
});
