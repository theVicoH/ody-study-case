import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ThreeDViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute, Outlet, useNavigate, useSearch } from "@tanstack/react-router";
import {
  useRestaurants,
  useRestaurantSelectionStore
} from "@workspace/client";
import {
  RestaurantMiniScene,
  RestaurantScene,
  RestaurantTopdownScene
} from "@workspace/threejs";
import { BrandMark } from "@workspace/ui/components/atoms/brand-mark/brand-mark.atom";
import { KbdKey } from "@workspace/ui/components/atoms/kbd-key/kbd-key.atom";
import { H3, Muted, Overline } from "@workspace/ui/components/atoms/typography/typography.atom";
import { BookmarkCheckIcon } from "@workspace/ui/components/icons/bookmark-check/bookmark-check.icon";
import { ChartLineIcon } from "@workspace/ui/components/icons/chart-line/chart-line.icon";
import { HouseIcon } from "@workspace/ui/components/icons/home/home.icon";
import { MenuIcon } from "@workspace/ui/components/icons/menu/menu.icon";
import { SearchIcon } from "@workspace/ui/components/icons/search/search.icon";
import { SettingsIcon } from "@workspace/ui/components/icons/settings/settings.icon";
import { UsersIcon } from "@workspace/ui/components/icons/users/users.icon";
import { DashboardLayout } from "@workspace/ui/components/layouts/dashboard-layout/dashboard-layout.layout";
import { ControlTip } from "@workspace/ui/components/molecules/control-tip/control-tip.molecule";
import { RestaurantListItem } from "@workspace/ui/components/molecules/restaurant-list-item/restaurant-list-item.molecule";
import { RestaurantSheet } from "@workspace/ui/components/organisms/restaurant-sheet/restaurant-sheet.organism";
import { RestaurantSidebar } from "@workspace/ui/components/organisms/restaurant-sidebar/restaurant-sidebar.organism";
import { SheetCrm } from "@workspace/ui/components/organisms/sheet-crm/sheet-crm.organism";
import { SheetGroupOverview } from "@workspace/ui/components/organisms/sheet-group-overview/sheet-group-overview.organism";
import { SheetMenu } from "@workspace/ui/components/organisms/sheet-menu/sheet-menu.organism";
import { SheetOrders } from "@workspace/ui/components/organisms/sheet-orders/sheet-orders.organism";
import { SheetRestaurantOverview } from "@workspace/ui/components/organisms/sheet-restaurant-overview/sheet-restaurant-overview.organism";
import { SheetSettings } from "@workspace/ui/components/organisms/sheet-settings/sheet-settings.organism";
import { SheetStats } from "@workspace/ui/components/organisms/sheet-stats/sheet-stats.organism";
import { Avatar, AvatarFallback } from "@workspace/ui/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@workspace/ui/components/ui/dialog";
import { Input } from "@workspace/ui/components/ui/input";
import { animate, AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";

import restaurantsCss from "./restaurants/restaurants.css?url";

import type {
  Restaurant,
  RestaurantPerformance
} from "@workspace/client";
import type { RestaurantSceneApi } from "@workspace/threejs";
import type { SidebarNavItem } from "@workspace/ui/components/organisms/restaurant-sidebar/restaurant-sidebar.organism";
import type { RestaurantSummaryItem } from "@workspace/ui/components/organisms/sheet-group-overview/sheet-group-overview.organism";

const SHEET_MIN_WIDTH = 360;
const SHEET_MAX_LIMIT = 2400;
const SHEET_DEFAULT_RIGHT = 12;
const SHEET_DEFAULT_WIDTH = 480;
const SIDEBAR_RESERVED = 264;
const EXPAND_DURATION = 0.45;
const THREED_ICON_SIZE = 16;
const THREED_ICON_STROKE = 2;
const FLAT_SEARCH_ICON_SIZE = 14;
const EXPAND_EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];
const MOBILE_BREAKPOINT = 720;
const SPLIT_GAP = 8;
const SPLIT_MIN_RATIO = 0.2;
const SPLIT_MAX_RATIO = 0.8;
const TAB_FADE_DURATION = 0.22;
const TAB_FADE_EASE: [number, number, number, number] = [0.2, 0, 0, 1];
const TAB_FADE_OFFSET = 8;

type DragMode = "left" | "right" | "move";

interface DragState {
  mode: DragMode;
  startX: number;
  startRight: number;
  startWidth: number;
}

interface SplitDragState {
  startX: number;
  startRatio: number;
  available: number;
}

interface SheetGeometry {
  right: number;
  width: number;
}

const clamp = (min: number, max: number, v: number): number =>
  Math.max(min, Math.min(max, v));

const NAV_ICONS = {
  home: HouseIcon,
  stats: ChartLineIcon,
  crm: UsersIcon,
  orders: BookmarkCheckIcon,
  menu: MenuIcon,
  settings: SettingsIcon
} as const;

type NavId = keyof typeof NAV_ICONS;

const NAV_ORDER: ReadonlyArray<NavId> = ["home", "stats", "crm", "orders", "menu", "settings"];

const performanceStatus = (perf: RestaurantPerformance): "good" | "warn" | "bad" => perf;

const Layout = (): React.JSX.Element => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const {
    restaurants,
    summary,
    statsFor,
    detailedStatsFor,
    customersFor,
    ordersFor,
    menuItemsFor,
    settingsFor
  } = useRestaurants();
  const selectedId = useRestaurantSelectionStore((s) => s.selectedId);
  const secondaryId = useRestaurantSelectionStore((s) => s.secondaryId);
  const compareMode = useRestaurantSelectionStore((s) => s.compareMode);
  const activeTab = useRestaurantSelectionStore((s) => s.activeTab);
  const secondaryTab = useRestaurantSelectionStore((s) => s.secondaryTab);
  const selectRestaurant = useRestaurantSelectionStore((s) => s.selectRestaurant);
  const selectGroup = useRestaurantSelectionStore((s) => s.selectGroup);
  const clearSelection = useRestaurantSelectionStore((s) => s.clearSelection);
  const setActiveTab = useRestaurantSelectionStore((s) => s.setActiveTab);
  const setCompareMode = useRestaurantSelectionStore((s) => s.setCompareMode);
  const selectSecondaryRestaurant = useRestaurantSelectionStore(
    (s) => s.selectSecondaryRestaurant
  );
  const openTabInSplit = useRestaurantSelectionStore((s) => s.openTabInSplit);

  const sheetRef = useRef<HTMLElement>(null);
  const sceneApiRef = useRef<RestaurantSceneApi | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const splitDragRef = useRef<SplitDragState | null>(null);
  const selectedIdRef = useRef(selectedId);

  selectedIdRef.current = selectedId;

  const [sheetWidth, setSheetWidth] = useState<number | null>(null);
  const [sheetRight, setSheetRight] = useState<number | null>(null);
  const [resizing, setResizing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [splitRatio, setSplitRatio] = useState(0.5);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );
  const search = useSearch({ from: "/restaurants" }) as { flat?: boolean };
  const [view3dEnabled, setView3dEnabled] = useState(!search.flat);
  const [flatQuery, setFlatQuery] = useState("");
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const [viewAllQuery, setViewAllQuery] = useState("");
  const savedGeometryRef = useRef<SheetGeometry | null>(null);

  const isGroupView = selectedId === "__group";
  const selected =
    selectedId && selectedId !== "__group"
      ? restaurants.find((r) => r.id === selectedId) ?? null
      : null;
  const isOpen = selectedId !== null;
  const isCompareActive = compareMode && !isGroupView && selected !== null;
  const secondary =
    isCompareActive && secondaryId
      ? restaurants.find((r) => r.id === secondaryId) ?? null
      : null;

  const handleSelectRestaurantById = useCallback(
    (id: string): void => {
      selectRestaurant(id);
      void navigate({
        to: "/restaurants/$restaurantId/$tab",
        params: { restaurantId: id, tab: activeTab || "home" }
      });
      if (view3dEnabled) {
        sceneApiRef.current?.selectRestaurant(id);
        sceneApiRef.current?.focusRestaurant(id);
        sceneApiRef.current?.setSunVisible(true);
      }
    },
    [navigate, selectRestaurant, activeTab, view3dEnabled]
  );

  const handleToggleView3d = useCallback((): void => {
    const next = !view3dEnabled;

    setView3dEnabled(next);
    clearSelection();
    void navigate({
      to: "/restaurants",
      search: next ? {} : { flat: true }
    });
    setSheetWidth(null);
    setSheetRight(null);
    setExpanded(false);
    setFlatQuery("");
    if (!next) {
      sceneApiRef.current?.selectRestaurant(null);
      sceneApiRef.current?.setSunVisible(true);
      sceneApiRef.current?.resetCamera();
    }
  }, [navigate, view3dEnabled, clearSelection]);

  useEffect(() => {
    const wantFlat = Boolean(search.flat);

    if (wantFlat === !view3dEnabled) return;
    setView3dEnabled(!wantFlat);
    if (wantFlat) {
      sceneApiRef.current?.selectRestaurant(null);
      sceneApiRef.current?.setSunVisible(true);
      sceneApiRef.current?.resetCamera();
    }
  }, [search.flat, view3dEnabled]);

  const handleSelectRestaurant = useCallback(
    (restaurant: Restaurant): void => {
      handleSelectRestaurantById(restaurant.id);
    },
    [handleSelectRestaurantById]
  );

  const handleSelectGroup = useCallback((): void => {
    selectGroup();
    void navigate({ to: "/restaurants/group" });
    sceneApiRef.current?.selectRestaurant(null);
    sceneApiRef.current?.setSunVisible(true);
    sceneApiRef.current?.resetCamera();
  }, [navigate, selectGroup]);

  const handleClose = useCallback((): void => {
    clearSelection();
    void navigate({ to: "/restaurants" });
    sceneApiRef.current?.selectRestaurant(null);
    sceneApiRef.current?.setSunVisible(true);
    sceneApiRef.current?.resetCamera();
  }, [navigate, clearSelection]);

  const handleEmptyClick = useCallback((): void => {
    if (selectedIdRef.current === null) return;
    clearSelection();
    void navigate({ to: "/restaurants" });
    sceneApiRef.current?.selectRestaurant(null);
    sceneApiRef.current?.setSunVisible(true);
  }, [navigate, clearSelection]);

  const handleTabChange = useCallback(
    (tab: string): void => {
      setActiveTab(tab);
      const id = selectedIdRef.current;

      if (id && id !== "__group") {
        void navigate({
          to: "/restaurants/$restaurantId/$tab",
          params: { restaurantId: id, tab }
        });
      }
    },
    [navigate, setActiveTab]
  );

  useEffect(() => {
    const onResize = (): void => setViewportWidth(window.innerWidth);

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent): void => {
      const split = splitDragRef.current;

      if (split) {
        const delta = e.clientX - split.startX;
        const next = clamp(
          SPLIT_MIN_RATIO,
          SPLIT_MAX_RATIO,
          split.startRatio + delta / split.available
        );

        setSplitRatio(next);

        return;
      }

      const drag = dragRef.current;

      if (!drag) return;
      const vw = window.innerWidth;
      const leftXAtStart = vw - drag.startRight - drag.startWidth;

      if (drag.mode === "left") {
        const right = drag.startRight;
        const maxW = Math.min(vw - SIDEBAR_RESERVED - right, SHEET_MAX_LIMIT);
        const newW = clamp(SHEET_MIN_WIDTH, maxW, vw - right - e.clientX);

        setSheetWidth(newW);
      } else if (drag.mode === "right") {
        const newRight = clamp(0, vw - leftXAtStart - SHEET_MIN_WIDTH, vw - e.clientX);
        const newWidth = clamp(SHEET_MIN_WIDTH, SHEET_MAX_LIMIT, vw - leftXAtStart - newRight);

        setSheetRight(newRight);
        setSheetWidth(newWidth);
      } else {
        const delta = e.clientX - drag.startX;
        const maxRight = Math.max(0, vw - SIDEBAR_RESERVED - drag.startWidth);
        const newRight = clamp(0, maxRight, drag.startRight - delta);

        setSheetRight(newRight);
      }
    };
    const onPointerUp = (): void => {
      if (splitDragRef.current) {
        splitDragRef.current = null;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        setResizing(false);

        return;
      }
      if (!dragRef.current) return;
      dragRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      setResizing(false);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  const beginDrag = (mode: DragMode, e: React.PointerEvent<HTMLDivElement>): void => {
    if (window.innerWidth <= MOBILE_BREAKPOINT) return;
    if (expanded) return;
    dragRef.current = {
      mode,
      startX: e.clientX,
      startRight: sheetRight ?? SHEET_DEFAULT_RIGHT,
      startWidth: sheetWidth ?? SHEET_DEFAULT_WIDTH
    };
    setResizing(true);
    document.body.style.cursor = mode === "move" ? "grabbing" : "ew-resize";
    document.body.style.userSelect = "none";
    (e.target as HTMLDivElement).setPointerCapture?.(e.pointerId);
  };

  const onResizerLeftPointerDown = (e: React.PointerEvent<HTMLDivElement>): void =>
    beginDrag("left", e);
  const onResizerRightPointerDown = (e: React.PointerEvent<HTMLDivElement>): void =>
    beginDrag("right", e);
  const onDragHeaderPointerDown = (e: React.PointerEvent<HTMLDivElement>): void =>
    beginDrag("move", e);

  const splitAvailableWidth = useMemo(
    () =>
      Math.max(
        SHEET_MIN_WIDTH * 2 + SPLIT_GAP,
        viewportWidth - SIDEBAR_RESERVED - SHEET_DEFAULT_RIGHT - SHEET_DEFAULT_RIGHT - SPLIT_GAP
      ),
    [viewportWidth]
  );

  const onSplitterPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>): void => {
      if (window.innerWidth <= MOBILE_BREAKPOINT) return;
      splitDragRef.current = {
        startX: e.clientX,
        startRatio: splitRatio,
        available: splitAvailableWidth
      };
      setResizing(true);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
      (e.target as HTMLDivElement).setPointerCapture?.(e.pointerId);
    },
    [splitAvailableWidth, splitRatio]
  );

  const handleToggleCompare = useCallback((): void => {
    if (!selected) return;
    const next = !compareMode;

    if (next) {
      if (!secondaryId || secondaryId === selected.id) {
        const fallback = restaurants.find((r) => r.id !== selected.id);

        if (fallback) selectSecondaryRestaurant(fallback.id);
      }
      setSplitRatio(0.5);
    }
    setCompareMode(next);
  }, [
    compareMode,
    restaurants,
    secondaryId,
    selectSecondaryRestaurant,
    selected,
    setCompareMode
  ]);

  const handleSelectSecondary = useCallback(
    (id: string | null): void => {
      if (id) selectSecondaryRestaurant(id);
    },
    [selectSecondaryRestaurant]
  );

  const handleCloseLeftInCompare = useCallback((): void => {
    if (secondary) {
      handleSelectRestaurantById(secondary.id);
    }
    setCompareMode(false);
  }, [secondary, handleSelectRestaurantById, setCompareMode]);

  const handleCloseRightInCompare = useCallback((): void => {
    setCompareMode(false);
  }, [setCompareMode]);

  const onToggleExpand = useCallback((): void => {
    const fromRight = sheetRight ?? SHEET_DEFAULT_RIGHT;
    const fromWidth = sheetWidth ?? SHEET_DEFAULT_WIDTH;
    const toExpanded = !expanded;
    let toRight: number;
    let toWidth: number;

    if (toExpanded) {
      savedGeometryRef.current = { right: fromRight, width: fromWidth };
      const vw = window.innerWidth;

      toRight = SHEET_DEFAULT_RIGHT;
      toWidth = Math.max(SHEET_MIN_WIDTH, vw - SIDEBAR_RESERVED - SHEET_DEFAULT_RIGHT);
    } else {
      const saved = savedGeometryRef.current;

      toRight = saved?.right ?? SHEET_DEFAULT_RIGHT;
      toWidth = saved?.width ?? SHEET_DEFAULT_WIDTH;
    }

    setExpanded(toExpanded);
    setResizing(true);
    animate(fromRight, toRight, {
      duration: EXPAND_DURATION,
      ease: EXPAND_EASE,
      onUpdate: (v) => setSheetRight(v)
    });
    animate(fromWidth, toWidth, {
      duration: EXPAND_DURATION,
      ease: EXPAND_EASE,
      onUpdate: (v) => setSheetWidth(v),
      onComplete: () => setResizing(false)
    });
  }, [expanded, sheetRight, sheetWidth]);

  const sunLabels = useMemo(
    () => ({
      brand: t("restaurants.brand"),
      cta: t("restaurants.scene.sunCta")
    }),
    [t]
  );

  const navItems = useMemo<ReadonlyArray<SidebarNavItem>>(
    () =>
      NAV_ORDER.map((id) => ({
        id,
        label: t(`restaurants.nav.${id}`),
        icon: NAV_ICONS[id]
      })),
    [t]
  );

  const railRestaurants = useMemo(
    () =>
      restaurants.map((r) => ({
        id: r.id,
        name: r.name,
        caption: r.address,
        status: performanceStatus(r.performance)
      })),
    [restaurants]
  );

  const flatSheetWidth = Math.max(SHEET_MIN_WIDTH, viewportWidth - SIDEBAR_RESERVED - SHEET_DEFAULT_RIGHT);
  const flatSheetRight = SHEET_DEFAULT_RIGHT;

  const flatFilteredRestaurants = useMemo(() => {
    if (!flatQuery.trim()) return railRestaurants;
    const q = flatQuery.toLowerCase();

    return railRestaurants.filter((r) => r.name.toLowerCase().includes(q) || r.caption.toLowerCase().includes(q));
  }, [railRestaurants, flatQuery]);

  const groupRestaurantSummaries = useMemo<ReadonlyArray<RestaurantSummaryItem>>(
    () =>
      restaurants.map((r) => {
        const s = statsFor(r);
        const ds = detailedStatsFor(r);

        return {
          id: r.id,
          name: r.name,
          performance: r.performance,
          revenue: s.revenue,
          sparklineData: ds.sparklineData
        };
      }),
    [restaurants, statsFor, detailedStatsFor]
  );

  const groupTotalRevenue = useMemo(
    () => restaurants.reduce((sum, r) => sum + statsFor(r).revenue, 0),
    [restaurants, statsFor]
  );

  const groupOverviewLabels = useMemo(() => ({
    restaurants: t("restaurants.stats.restaurants"),
    performing: t("restaurants.stats.performing"),
    performingTrend: t("restaurants.stats.performingTrend"),
    groupRevenue: t("restaurants.stats.groupRevenue"),
    perfBreakdown: t("restaurants.stats.perfBreakdown"),
    today: t("restaurants.stats.today"),
    good: t("restaurants.stats.good"),
    warn: t("restaurants.stats.warn"),
    bad: t("restaurants.stats.bad"),
    allRestaurants: t("restaurants.rail.allRestaurants"),
    colStatus: t("restaurants.stats.colStatus"),
    colRestaurant: t("restaurants.stats.colRestaurant"),
    colTrend: t("restaurants.stats.colTrend"),
    colRevenue: t("restaurants.stats.colRevenue"),
    empty: t("restaurants.stats.empty"),
    paginationPrev: t("restaurants.orders.paginationPrev"),
    paginationNext: t("restaurants.orders.paginationNext"),
    filterAll: t("restaurants.orders.filterAll")
  }), [t]);

  const overviewLabels = useMemo(() => ({
    covers: t("restaurants.stats.covers"),
    revenue: t("restaurants.stats.revenue"),
    orders: t("restaurants.stats.orders"),
    rating: t("restaurants.stats.rating"),
    openOrders: t("restaurants.stats.openOrders"),
    fillRate: t("restaurants.stats.fillRate"),
    revenueTrend: t("restaurants.stats.revenueTrend"),
    trend24h: t("restaurants.stats.trend24h"),
    establishmentDetails: t("restaurants.stats.establishmentDetails"),
    type: t("restaurants.stats.type"),
    phone: t("restaurants.stats.phone"),
    capacity: t("restaurants.stats.capacity"),
    services: t("restaurants.stats.services"),
    tableService: t("restaurants.stats.tableService"),
    clickAndCollect: t("restaurants.stats.clickAndCollect"),
    vsGroupTitle: t("restaurants.stats.vsGroupTitle"),
    vsGroupCaption: t("restaurants.stats.vsGroupCaption"),
    vsGroupRevenue: t("restaurants.stats.vsGroupRevenue"),
    vsGroupCovers: t("restaurants.stats.vsGroupCovers"),
    vsGroupTicket: t("restaurants.stats.vsGroupTicket"),
    groupAverage: t("restaurants.stats.groupAverage"),
    coversUnit: (count: number) => t("restaurants.stats.covers", { count }),
    topDishes: t("restaurants.stats.topDishes"),
    colDish: t("restaurants.stats.colDish"),
    colSold: t("restaurants.stats.colSold"),
    soldWord: t("restaurants.stats.sold"),
    emptyTopDishes: t("restaurants.stats.empty")
  }), [t]);

  const statsLabels = useMemo(() => ({
    revenue7j: t("restaurants.stats.revenue7j"),
    covers7j: t("restaurants.stats.covers7j"),
    avgTicket: t("restaurants.stats.avgTicket"),
    fillRate: t("restaurants.stats.fillRate"),
    todayCovers: t("restaurants.stats.todayCovers"),
    openOrders: t("restaurants.stats.openOrders"),
    revenueTrend: t("restaurants.stats.revenueTrend"),
    trend24h: t("restaurants.stats.trend24h"),
    weeklyRevenue: t("restaurants.stats.weeklyRevenue"),
    last7Days: t("restaurants.stats.last7Days"),
    affluence: t("restaurants.stats.affluence"),
    hoursVsDays: t("restaurants.stats.hoursVsDays"),
    topDishes: t("restaurants.stats.topDishes"),
    soldWord: t("restaurants.stats.sold"),
    colRank: t("restaurants.stats.colRank"),
    colDish: t("restaurants.stats.colDish"),
    colCategory: t("restaurants.stats.colCategory"),
    colPrice: t("restaurants.stats.colPrice"),
    colSold: t("restaurants.stats.colSold"),
    empty: t("restaurants.stats.empty"),
    paginationPrev: t("restaurants.orders.paginationPrev"),
    paginationNext: t("restaurants.orders.paginationNext"),
    filterAll: t("restaurants.orders.filterAll"),
    expandStats: t("restaurants.stats.expandStats"),
    revenueTrendDialogTitle: t("restaurants.stats.revenueTrendDialogTitle"),
    revenueTrendDialogDescription: t("restaurants.stats.revenueTrendDialogDescription"),
    weeklyRevenueDialogTitle: t("restaurants.stats.weeklyRevenueDialogTitle"),
    weeklyRevenueDialogDescription: t("restaurants.stats.weeklyRevenueDialogDescription"),
    affluenceDialogTitle: t("restaurants.stats.affluenceDialogTitle"),
    affluenceDialogDescription: t("restaurants.stats.affluenceDialogDescription"),
    datePickerLabel: t("restaurants.stats.datePickerLabel"),
    weekPickerLabel: t("restaurants.stats.weekPickerLabel"),
    weekPickerPlaceholder: t("restaurants.stats.weekPickerPlaceholder"),
    totalLabel: t("restaurants.stats.totalLabel"),
    averageLabel: t("restaurants.stats.averageLabel"),
    peakLabel: t("restaurants.stats.peakLabel"),
    bestLabel: t("restaurants.stats.bestLabel"),
    worstLabel: t("restaurants.stats.worstLabel"),
    growthLabel: t("restaurants.stats.growthLabel"),
    peakHourLabel: t("restaurants.stats.peakHourLabel"),
    lowHourLabel: t("restaurants.stats.lowHourLabel"),
    avgHourlyLabel: t("restaurants.stats.avgHourlyLabel"),
    vsPriorLabel: t("restaurants.stats.vsPriorLabel"),
    timelineTitle: t("restaurants.stats.timelineTitle"),
    weeklyTitle: t("restaurants.stats.weeklyTitle"),
    fillRateAvgLabel: t("restaurants.stats.fillRateAvgLabel"),
    peakSlotLabel: t("restaurants.stats.peakSlotLabel"),
    quietSlotLabel: t("restaurants.stats.quietSlotLabel"),
    heatmapTitle: t("restaurants.stats.heatmapTitle"),
    weekThis: t("restaurants.stats.weekThis"),
    weekLast: t("restaurants.stats.weekLast"),
    weekMinus2: t("restaurants.stats.weekMinus2"),
    weekMinus3: t("restaurants.stats.weekMinus3")
  }), [t]);

  const crmLabels = useMemo(() => ({
    searchPlaceholder: t("restaurants.crm.search"),
    newCustomer: t("restaurants.crm.newCustomer"),
    registeredCustomers: t("restaurants.crm.registeredCustomers"),
    vip: t("restaurants.crm.vip"),
    thisMonth: t("restaurants.crm.thisMonth"),
    avgSpend: t("restaurants.crm.avgSpend"),
    tagVip: t("restaurants.crm.tagVip"),
    tagRegular: t("restaurants.crm.tagRegular"),
    tagNew: t("restaurants.crm.tagNew"),
    emptySearch: t("restaurants.crm.empty"),
    colCustomer: t("restaurants.crm.colCustomer"),
    colVisits: t("restaurants.crm.colVisits"),
    colSpent: t("restaurants.crm.colSpent"),
    colTag: t("restaurants.crm.colTag"),
    filterAll: t("restaurants.orders.filterAll"),
    paginationPrev: t("restaurants.orders.paginationPrev"),
    paginationNext: t("restaurants.orders.paginationNext"),
    visitsWord: t("restaurants.crm.visitsWord"),
    newCustomerDialog: {
      title: t("restaurants.crm.newCustomerDialog.title"),
      description: t("restaurants.crm.newCustomerDialog.description"),
      nameLabel: t("restaurants.crm.newCustomerDialog.nameLabel"),
      namePlaceholder: t("restaurants.crm.newCustomerDialog.namePlaceholder"),
      emailLabel: t("restaurants.crm.newCustomerDialog.emailLabel"),
      emailPlaceholder: t("restaurants.crm.newCustomerDialog.emailPlaceholder"),
      tagLabel: t("restaurants.crm.newCustomerDialog.tagLabel"),
      tagVip: t("restaurants.crm.tagVip"),
      tagRegular: t("restaurants.crm.tagRegular"),
      tagNew: t("restaurants.crm.tagNew"),
      cancel: t("restaurants.crm.newCustomerDialog.cancel"),
      submit: t("restaurants.crm.newCustomerDialog.submit")
    }
  }), [t]);

  const ordersLabels = useMemo(() => ({
    searchPlaceholder: t("restaurants.orders.search"),
    newOrder: t("restaurants.orders.newOrder"),
    filterAll: t("restaurants.orders.filterAll"),
    filterNew: t("restaurants.orders.filterNew"),
    filterPreparing: t("restaurants.orders.filterPreparing"),
    filterReady: t("restaurants.orders.filterReady"),
    filterServed: t("restaurants.orders.filterServed"),
    filterPaid: t("restaurants.orders.filterPaid"),
    statusNew: t("restaurants.orders.statusNew"),
    statusPreparing: t("restaurants.orders.statusPreparing"),
    statusReady: t("restaurants.orders.statusReady"),
    statusServed: t("restaurants.orders.statusServed"),
    statusPaid: t("restaurants.orders.statusPaid"),
    itemsWord: t("restaurants.orders.itemsWord"),
    emptyFilter: t("restaurants.orders.emptyFilter"),
    colTable: t("restaurants.orders.colTable"),
    colOrder: t("restaurants.orders.colOrder"),
    colItems: t("restaurants.orders.colItems"),
    colTotal: t("restaurants.orders.colTotal"),
    colStatus: t("restaurants.orders.colStatus"),
    colTime: t("restaurants.orders.colTime"),
    paginationPrev: t("restaurants.orders.paginationPrev"),
    paginationNext: t("restaurants.orders.paginationNext"),
    newOrderDialog: {
      title: t("restaurants.orders.newOrderDialog.title"),
      description: t("restaurants.orders.newOrderDialog.description"),
      tableLabel: t("restaurants.orders.newOrderDialog.tableLabel"),
      itemsLabel: t("restaurants.orders.newOrderDialog.itemsLabel"),
      totalLabel: t("restaurants.orders.newOrderDialog.totalLabel"),
      statusLabel: t("restaurants.orders.newOrderDialog.statusLabel"),
      statusNew: t("restaurants.orders.statusNew"),
      statusPreparing: t("restaurants.orders.statusPreparing"),
      statusReady: t("restaurants.orders.statusReady"),
      statusServed: t("restaurants.orders.statusServed"),
      statusPaid: t("restaurants.orders.statusPaid"),
      cancel: t("restaurants.orders.newOrderDialog.cancel"),
      submit: t("restaurants.orders.newOrderDialog.submit")
    }
  }), [t]);

  const settingsLabels = useMemo(() => ({
    generalInfo: t("restaurants.settings.generalInfo"),
    name: t("restaurants.settings.name"),
    address: t("restaurants.settings.address"),
    phone: t("restaurants.settings.phone"),
    maxCovers: t("restaurants.settings.maxCovers"),
    preferences: t("restaurants.settings.preferences"),
    tableService: t("restaurants.settings.tableService"),
    tableServiceDesc: t("restaurants.settings.tableServiceDesc"),
    clickCollect: t("restaurants.settings.clickCollect"),
    clickCollectDesc: t("restaurants.settings.clickCollectDesc"),
    kitchenNotif: t("restaurants.settings.kitchenNotif"),
    kitchenNotifDesc: t("restaurants.settings.kitchenNotifDesc"),
    testMode: t("restaurants.settings.testMode"),
    testModeDesc: t("restaurants.settings.testModeDesc"),
    save: t("restaurants.settings.save"),
    saved: t("restaurants.settings.saved"),
    openingHours: t("restaurants.settings.openingHours"),
    openingHoursDesc: t("restaurants.settings.openingHoursDesc"),
    dangerZone: t("restaurants.settings.dangerZone"),
    deleteRestaurant: t("restaurants.settings.deleteRestaurant"),
    deleteRestaurantDesc: t("restaurants.settings.deleteRestaurantDesc"),
    tables: t("restaurants.settings.tables"),
    tablesDesc: t("restaurants.settings.tablesDesc"),
    addTable: t("restaurants.settings.addTable"),
    editTable: t("restaurants.settings.editTable"),
    deleteTable: t("restaurants.settings.deleteTable"),
    colTableNumber: t("restaurants.settings.colTableNumber"),
    colCapacity: t("restaurants.settings.colCapacity"),
    colZone: t("restaurants.settings.colZone"),
    colTableStatus: t("restaurants.settings.colTableStatus"),
    statusAvailable: t("restaurants.settings.statusAvailable"),
    statusOccupied: t("restaurants.settings.statusOccupied"),
    statusReserved: t("restaurants.settings.statusReserved"),
    zoneAll: t("restaurants.settings.zoneAll"),
    zoneSalle: t("restaurants.settings.zoneSalle"),
    zoneTerrasse: t("restaurants.settings.zoneTerrasse"),
    zoneBar: t("restaurants.settings.zoneBar"),
    zoneVip: t("restaurants.settings.zoneVip"),
    emptyTables: t("restaurants.settings.emptyTables"),
    tableNumber: t("restaurants.settings.tableNumber"),
    tableCapacity: t("restaurants.settings.tableCapacity"),
    tableZone: t("restaurants.settings.tableZone"),
    tableStatus: t("restaurants.settings.tableStatus"),
    confirmDelete: t("restaurants.settings.confirmDelete"),
    confirmDeleteDesc: t("restaurants.settings.confirmDeleteDesc"),
    cancel: t("restaurants.settings.cancel"),
    confirm: t("restaurants.settings.confirm")
  }), [t]);

  const stats = selected ? statsFor(selected) : null;

  const miniName = isCompareActive
    ? t("restaurants.rail.compareCount", { count: 2 })
    : selected
      ? selected.name
      : t("restaurants.rail.allRestaurants");
  const miniStatus: "good" | "warn" | "bad" | "disabled" = isCompareActive
    ? "disabled"
    : isGroupView
      ? performanceStatus(summary.worstClass)
      : performanceStatus(selected?.performance ?? "good");
  const miniCaption = isCompareActive
    ? t("restaurants.rail.compareMode")
    : isGroupView
      ? t("restaurants.rail.inAlert", { count: summary.bad })
      : selected
        ? t(`restaurants.perf.${selected.performance}`)
        : "—";

  const sheetStatus: "good" | "warn" | "bad" = isGroupView
    ? performanceStatus(summary.worstClass)
    : performanceStatus(selected?.performance ?? "good");

  const sheetEyebrow = isGroupView
    ? t("restaurants.sheet.groupView")
    : selected?.type ?? "";

  const sheetTitle = isGroupView
    ? t("restaurants.rail.allRestaurants")
    : selected?.name ?? "—";

  const sheetCaption =
    !isGroupView && selected
      ? selected.address
      : t("restaurants.sheet.activeEstablishments", { count: summary.total });

  const renderRestaurantTab = (
    restaurant: Restaurant,
    tabId: string = activeTab
  ): React.ReactNode => {
    const rStats = statsFor(restaurant);
    const rDetailed = detailedStatsFor(restaurant);
    const rCustomers = customersFor(restaurant);
    const rOrders = ordersFor(restaurant);
    const rMenu = menuItemsFor(restaurant);
    const rSettings = settingsFor(restaurant);
    const rVip = rCustomers.filter((c) => c.tag === "VIP").length;

    if (tabId === "home") {
      return (
        <SheetRestaurantOverview
          labels={overviewLabels}
          restaurantId={restaurant.id}
          restaurantType={restaurant.type}
          performance={restaurant.performance}
          stats={rStats}
          openOrders={rDetailed.openOrders}
          fillRate={rDetailed.fillRate}
          sparklineData={rDetailed.sparklineData}
          phone={rSettings.phone}
          maxCovers={rSettings.maxCovers}
          tableService={rSettings.tableService}
          clickAndCollect={rSettings.clickAndCollect}
          groupRestaurants={groupRestaurantSummaries}
          topItems={rDetailed.topItems}
        />
      );
    }

    if (tabId === "stats") {
      return (
        <SheetStats labels={statsLabels} stats={rDetailed} restaurantId={restaurant.id} />
      );
    }

    if (tabId === "crm") {
      return (
        <SheetCrm
          labels={crmLabels}
          customers={rCustomers}
          totalCustomers={rDetailed.customers}
          vipCount={rVip}
        />
      );
    }

    if (tabId === "orders") {
      return <SheetOrders labels={ordersLabels} orders={rOrders} />;
    }

    if (tabId === "menu") {
      return <SheetMenu items={rMenu} />;
    }

    if (tabId === "settings") {
      return <SheetSettings labels={settingsLabels} settings={rSettings} />;
    }

    return null;
  };

  const renderSheetContent = (): React.ReactNode => {
    if (isGroupView) {
      return (
        <SheetGroupOverview
          labels={groupOverviewLabels}
          total={summary.total}
          good={summary.good}
          warn={summary.warn}
          bad={summary.bad}
          totalRevenue={groupTotalRevenue}
          restaurants={groupRestaurantSummaries}
        />
      );
    }

    if (!selected || !stats) return null;

    const tabContent = renderRestaurantTab(selected);

    if (tabContent !== null) return tabContent;

    return (
      <Muted className="border-foreground/10 bg-foreground/2 p-xl rounded-md border border-dashed text-center">
        {t("restaurants.sheet.tabPlaceholder")}
      </Muted>
    );
  };

  const renderAnimatedTabContent = (
    key: string,
    content: React.ReactNode
  ): React.ReactNode => (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={key}
        initial={{ opacity: 0, y: TAB_FADE_OFFSET }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -TAB_FADE_OFFSET }}
        transition={{ duration: TAB_FADE_DURATION, ease: TAB_FADE_EASE }}
        className="gap-md flex flex-col"
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );

  const headerActions = (
    <>
      <button
        type="button"
        onClick={handleToggleView3d}
        aria-label={view3dEnabled ? t("restaurants.flatList.disable3d") : t("restaurants.flatList.enable3d")}
        aria-pressed={view3dEnabled}
        className={[
          "flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200",
          view3dEnabled
            ? "border-primary/40 bg-primary/15 text-primary hover:bg-primary/25"
            : "border-border bg-muted text-muted-foreground hover:bg-muted/80"
        ].join(" ")}
      >
        <HugeiconsIcon
          icon={ThreeDViewIcon}
          size={THREED_ICON_SIZE}
          strokeWidth={THREED_ICON_STROKE}
        />
      </button>
      <Avatar size="default" aria-label="Vico">
        <AvatarFallback>VC</AvatarFallback>
      </Avatar>
    </>
  );

  return (
    <DashboardLayout
      brand={<BrandMark size="md" label={t("restaurants.brand")} />}
      brandVisible={!isOpen}
      headerActions={headerActions}
      background={
        <RestaurantScene
          className="absolute inset-0"
          restaurants={restaurants}
          computeStats={statsFor}
          sunLabels={sunLabels}
          apiRef={sceneApiRef}
          onSelectGroup={handleSelectGroup}
          onSelectRestaurant={handleSelectRestaurant}
          onEmptyClick={handleEmptyClick}
        />
      }
      backgroundDimmed={expanded || !view3dEnabled}
      footer={
        <ControlTip>
          <KbdKey>drag</KbdKey> rotate · <KbdKey>scroll</KbdKey> zoom · <KbdKey>click</KbdKey>{" "}
          {t("restaurants.tip")}
        </ControlTip>
      }
      footerVisible={!expanded && view3dEnabled}
    >
      <AnimatePresence>
        {!view3dEnabled && !isOpen && (
          <motion.div
            key="flat-list"
            className="absolute inset-0 z-20"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div
              className="glass-strong absolute overflow-hidden rounded-xl"
              style={{
                width: "22rem",
                maxWidth: "calc(100vw - 2rem)",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
              }}
            >
              <div className="p-md pb-sm">
                <H3 className="scroll-m-0">{t("restaurants.flatList.title")}</H3>
                <Overline className="text-muted-foreground mt-xs block">
                  {t("restaurants.rail.count", { count: restaurants.length })}
                </Overline>
              </div>
              <div className="px-md pb-xs">
                <div className="relative">
                  <span className="text-foreground/60 left-sm pointer-events-none absolute top-1/2 -translate-y-1/2">
                    <SearchIcon size={FLAT_SEARCH_ICON_SIZE} isAnimated={false} />
                  </span>
                  <Input
                    value={flatQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFlatQuery(e.target.value)}
                    placeholder={t("restaurants.flatList.search")}
                    className="h-xl pl-xl typo-body-sm"
                  />
                </div>
              </div>
              <div className="px-xs pb-xs overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ maxHeight: "20rem" }}>
                {flatFilteredRestaurants.map((r) => (
                  <RestaurantListItem
                    key={r.id}
                    name={r.name}
                    caption={r.caption}
                    status={r.status}
                    onClick={() => handleSelectRestaurantById(r.id)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <RestaurantSidebar
        open={isOpen}
        compareMode={view3dEnabled ? isCompareActive : false}
        compareLabel={t("restaurants.sheet.compare")}
        onToggleCompare={view3dEnabled && !isGroupView && selected ? handleToggleCompare : undefined}
        secondaryTabId={isCompareActive ? secondaryTab : null}
        onSplitTab={
          view3dEnabled && !isGroupView && selected ? openTabInSplit : undefined
        }
        splitTabLabel={t("restaurants.sheet.openBeside")}
        miniSlot={
          view3dEnabled ? (
            isGroupView ? (
              <RestaurantTopdownScene className="absolute inset-0" restaurants={restaurants} />
            ) : (
              <RestaurantMiniScene className="absolute inset-0" restaurant={selected} />
            )
          ) : (
            <div className="bg-muted absolute inset-0" />
          )
        }
        miniSecondarySlot={
          view3dEnabled && isCompareActive && secondary ? (
            <RestaurantMiniScene className="absolute inset-0" restaurant={secondary} />
          ) : undefined
        }
        miniName={miniName}
        miniStatus={miniStatus}
        miniCaption={miniCaption}
        navItems={navItems}
        activeTabId={activeTab}
        onTabChange={handleTabChange}
        groupLabel={t("restaurants.rail.allRestaurants")}
        groupOverview={t("restaurants.rail.groupOverview")}
        isGroupActive={isGroupView}
        onSelectGroup={handleSelectGroup}
        restaurants={railRestaurants}
        activeRestaurantId={selectedId === "__group" ? null : selectedId}
        secondaryActiveRestaurantId={isCompareActive ? secondaryId : null}
        onSelectRestaurant={handleSelectRestaurantById}
        searchPlaceholder={t("restaurants.rail.search")}
        countLabel={t("restaurants.rail.count", { count: restaurants.length })}
        viewAllLabel={t("restaurants.rail.viewAll")}
        onViewAll={() => setViewAllOpen(true)}
      />

      <Dialog
        open={viewAllOpen}
        onOpenChange={(open) => {
          setViewAllOpen(open);
          if (!open) setViewAllQuery("");
        }}
      >
        <DialogContent className="w-[28rem] gap-3">
          <DialogHeader>
            <DialogTitle>{t("restaurants.rail.viewAllModalTitle")}</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <span className="text-foreground/60 left-sm pointer-events-none absolute top-1/2 -translate-y-1/2">
              <SearchIcon size={FLAT_SEARCH_ICON_SIZE} isAnimated={false} />
            </span>
            <Input
              value={viewAllQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setViewAllQuery(e.target.value)}
              placeholder={t("restaurants.rail.search")}
              className="h-xl pl-xl typo-body-sm"
            />
          </div>
          <div className="-mx-1 max-h-[24rem] overflow-y-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {railRestaurants
              .filter((r) => {
                const q = viewAllQuery.trim().toLowerCase();

                if (!q) return true;

                return (
                  r.name.toLowerCase().includes(q) ||
                  r.caption.toLowerCase().includes(q)
                );
              })
              .map((r) => (
                <RestaurantListItem
                  key={r.id}
                  name={r.name}
                  caption={r.caption}
                  status={r.status}
                  active={r.id === selectedId}
                  onClick={() => {
                    handleSelectRestaurantById(r.id);
                    setViewAllOpen(false);
                    setViewAllQuery("");
                  }}
                />
              ))}
          </div>
        </DialogContent>
      </Dialog>

      {isCompareActive && selected ? (
        <>
          {(() => {
            const leftWidth = Math.max(SHEET_MIN_WIDTH, splitAvailableWidth * splitRatio);
            const rightWidth = Math.max(
              SHEET_MIN_WIDTH,
              splitAvailableWidth - leftWidth
            );
            const rightSheetRight = SHEET_DEFAULT_RIGHT;
            const leftSheetRight = SHEET_DEFAULT_RIGHT + rightWidth + SPLIT_GAP;
            const splitterRight = SHEET_DEFAULT_RIGHT + rightWidth + SPLIT_GAP / 2 - 1.5;
            const rightTab = secondaryTab ?? activeTab;
            const leftCategoryLabel = t(`restaurants.nav.${activeTab}`);
            const rightCategoryLabel = t(`restaurants.nav.${rightTab}`);

            return (
              <>
                <RestaurantSheet
                  open
                  resizing={resizing}
                  status={sheetStatus}
                  eyebrow={leftCategoryLabel}
                  title={selected.name}
                  caption={selected.address}
                  closeLabel={t("restaurants.sheet.close")}
                  expandLabel={t("restaurants.sheet.expand")}
                  collapseLabel={t("restaurants.sheet.collapse")}
                  moveLabel={t("restaurants.sheet.moveSheet")}
                  resizeLabel={t("restaurants.sheet.resizeSheet")}
                  width={leftWidth}
                  right={leftSheetRight}
                  selectorRestaurants={railRestaurants}
                  selectedRestaurantId={selected.id}
                  onSelectRestaurant={(id) => { if (id) handleSelectRestaurantById(id); }}
                  onClose={handleCloseLeftInCompare}
                >
                  {renderAnimatedTabContent(
                    `${selected.id}:${activeTab}`,
                    renderSheetContent()
                  )}
                </RestaurantSheet>

                <RestaurantSheet
                  open
                  resizing={resizing}
                  status={
                    secondary ? performanceStatus(secondary.performance) : "good"
                  }
                  eyebrow={rightCategoryLabel}
                  title={secondary?.name ?? "—"}
                  caption={secondary?.address ?? ""}
                  closeLabel={t("restaurants.sheet.close")}
                  expandLabel={t("restaurants.sheet.expand")}
                  collapseLabel={t("restaurants.sheet.collapse")}
                  moveLabel={t("restaurants.sheet.moveSheet")}
                  resizeLabel={t("restaurants.sheet.resizeSheet")}
                  width={rightWidth}
                  right={rightSheetRight}
                  selectorRestaurants={railRestaurants}
                  selectedRestaurantId={secondary?.id}
                  onSelectRestaurant={handleSelectSecondary}
                  onClose={handleCloseRightInCompare}
                >
                  {renderAnimatedTabContent(
                    `${secondary?.id ?? "none"}:${rightTab}`,
                    secondary ? renderRestaurantTab(secondary, rightTab) : null
                  )}
                </RestaurantSheet>

                <div
                  onPointerDown={onSplitterPointerDown}
                  aria-label={t("restaurants.sheet.splitResize")}
                  role="separator"
                  className="group/split fixed z-40 flex w-3 cursor-ew-resize items-center justify-center touch-none select-none"
                  style={{
                    top: "var(--spacing-sm)",
                    bottom: "var(--spacing-sm)",
                    right: `${splitterRight}px`
                  }}
                >
                  <span className="bg-foreground/20 group-hover/split:bg-primary group-hover/split:h-16 block h-10 w-1 rounded-full transition-all duration-200" />
                </div>
              </>
            );
          })()}
        </>
      ) : (
        <RestaurantSheet
          ref={sheetRef}
          open={isOpen}
          resizing={resizing}
          expanded={!view3dEnabled || expanded}
          status={sheetStatus}
          eyebrow={isGroupView ? sheetEyebrow : undefined}
          title={sheetTitle}
          caption={sheetCaption}
          closeLabel={t("restaurants.sheet.close")}
          expandLabel={t("restaurants.sheet.expand")}
          collapseLabel={t("restaurants.sheet.collapse")}
          moveLabel={t("restaurants.sheet.moveSheet")}
          resizeLabel={t("restaurants.sheet.resizeSheet")}
          width={!view3dEnabled ? flatSheetWidth : sheetWidth}
          right={!view3dEnabled ? flatSheetRight : sheetRight}
          selectorRestaurants={!isGroupView ? railRestaurants : undefined}
          selectedRestaurantId={!isGroupView ? (selectedId ?? undefined) : undefined}
          onSelectRestaurant={!isGroupView ? (id) => { if (id) handleSelectRestaurantById(id); } : undefined}
          onClose={handleClose}
          onToggleExpand={view3dEnabled ? onToggleExpand : undefined}
          onResizerLeftPointerDown={view3dEnabled ? onResizerLeftPointerDown : undefined}
          onResizerRightPointerDown={view3dEnabled ? onResizerRightPointerDown : undefined}
          onDragHeaderPointerDown={view3dEnabled ? onDragHeaderPointerDown : undefined}
        >
          {renderAnimatedTabContent(
            `${isGroupView ? "__group" : selectedId ?? "none"}:${activeTab}`,
            renderSheetContent()
          )}
        </RestaurantSheet>
      )}

      <Outlet />
    </DashboardLayout>
  );
};

interface RestaurantsSearch {
  flat?: boolean;
}

export const Route = createFileRoute("/restaurants")({
  head: () => ({
    links: [{ rel: "stylesheet", href: restaurantsCss }]
  }),
  validateSearch: (raw: Record<string, unknown>): RestaurantsSearch => {
    const flat = raw.flat;

    return {
      flat: flat === true || flat === "true" || flat === "1" || flat === 1
    };
  },
  component: Layout
});
