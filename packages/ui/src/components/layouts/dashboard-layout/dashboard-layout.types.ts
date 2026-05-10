import type { ReactNode } from "react";

export interface DashboardLayoutProps {
  brand?: ReactNode;
  brandVisible?: boolean;
  headerActions?: ReactNode;
  headerActionsRight?: string | number;
  background?: ReactNode;
  backgroundDimmed?: boolean;
  footer?: ReactNode;
  footerVisible?: boolean;
  children?: ReactNode;
}
