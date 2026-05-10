import { BookmarkCheckIcon } from "@workspace/ui/components/icons/bookmark-check/bookmark-check.icon";
import { ChartLineIcon } from "@workspace/ui/components/icons/chart-line/chart-line.icon";
import { HouseIcon } from "@workspace/ui/components/icons/home/home.icon";
import { MenuIcon } from "@workspace/ui/components/icons/menu/menu.icon";
import { SettingsIcon } from "@workspace/ui/components/icons/settings/settings.icon";
import { UsersIcon } from "@workspace/ui/components/icons/users/users.icon";

export const SHEET_MIN_WIDTH = 360;
export const SHEET_MAX_LIMIT = 2400;
export const SHEET_DEFAULT_RIGHT = 12;
export const SHEET_DEFAULT_WIDTH = 480;
export const SIDEBAR_RESERVED = 252;
export const EXPAND_DURATION = 0.45;
export const THREED_ICON_SIZE = 16;
export const THREED_ICON_STROKE = 2;
export const FLAT_SEARCH_ICON_SIZE = 14;
export const EXPAND_EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];
export const MOBILE_BREAKPOINT = 720;
export const SPLIT_GAP = 8;
export const SPLIT_MIN_RATIO = 0.2;
export const SPLIT_MAX_RATIO = 0.8;
export const TAB_FADE_DURATION = 0.22;
export const TAB_FADE_EASE: [number, number, number, number] = [0.2, 0, 0, 1];
export const TAB_FADE_OFFSET = 8;
export const DEFAULT_VIEWPORT_WIDTH = 1280;
export const SHEET_CLOSE_DELAY_MS = 280;
export const SPLIT_RATIO_HALF = 1.5;

export type DragMode = "left" | "right" | "move";

export interface DragState {
  mode: DragMode;
  startX: number;
  startRight: number;
  startWidth: number;
}

export interface SplitDragState {
  startX: number;
  startRatio: number;
  available: number;
}

export interface SheetGeometry {
  right: number;
  width: number;
}

export const NAV_ICONS = {
  home: HouseIcon,
  stats: ChartLineIcon,
  crm: UsersIcon,
  orders: BookmarkCheckIcon,
  menu: MenuIcon,
  settings: SettingsIcon
} as const;

export type NavId = keyof typeof NAV_ICONS;

export const NAV_ORDER: ReadonlyArray<NavId> = ["home", "stats", "crm", "orders", "menu", "settings"];
