import React, { useRef } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ICON_SIZE = 16;
const SPLIT_ICON_SIZE = 14;

interface NavIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

type NavIconComponent = React.ForwardRefExoticComponent<
  React.RefAttributes<NavIconHandle> & {
    size?: number;
    isAnimated?: boolean;
    color?: string;
    className?: string;
  }
>;

interface SidebarNavItem {
  id: string;
  label: string;
  icon: NavIconComponent;
}

interface SidebarNavProps {
  items: ReadonlyArray<SidebarNavItem>;
  activeId: string;
  secondaryActiveId?: string | null;
  onSelect: (id: string) => void;
  onSplit?: (id: string) => void;
  splitLabel?: string;
  className?: string;
}

interface SidebarNavButtonProps {
  item: SidebarNavItem;
  isActive: boolean;
  isSecondaryActive: boolean;
  onSelect: (id: string) => void;
  onSplit?: (id: string) => void;
  splitLabel?: string;
}

const SplitRightGlyph = (): React.JSX.Element => (
  <svg
    width={SPLIT_ICON_SIZE}
    height={SPLIT_ICON_SIZE}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <line x1="13" y1="4" x2="13" y2="20" />
    <line x1="17" y1="9" x2="17" y2="15" />
  </svg>
);

const SidebarNavButton = ({
  item,
  isActive,
  isSecondaryActive,
  onSelect,
  onSplit,
  splitLabel
}: SidebarNavButtonProps): React.JSX.Element => {
  const iconRef = useRef<NavIconHandle>(null);
  const { id, label, icon: Icon } = item;
  const showSecondaryBadge = !isActive && isSecondaryActive;

  const handleSplitClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    onSplit?.(id);
  };

  return (
    <div className="group/nav-item relative">
      <Button
        variant={isActive ? "tertiary" : "ghost"}
        className={cn(
          "gap-xs w-full justify-start",
          showSecondaryBadge && "ring-primary/30 ring-1 ring-inset"
        )}
        onClick={() => onSelect(id)}
        onMouseEnter={() => iconRef.current?.startAnimation()}
        onMouseLeave={() => iconRef.current?.stopAnimation()}
        onFocus={() => iconRef.current?.startAnimation()}
        onBlur={() => iconRef.current?.stopAnimation()}
      >
        <Icon ref={iconRef} size={NAV_ICON_SIZE} isAnimated={false} />
        <span className="typo-body-sm">{label}</span>
        {showSecondaryBadge && (
          <span
            className="bg-primary/15 text-primary px-2xs typo-overline ml-auto rounded-sm"
            aria-hidden="true"
          >
            2
          </span>
        )}
      </Button>
      {onSplit && !isActive && (
        <button
          type="button"
          onClick={handleSplitClick}
          aria-label={splitLabel}
          className={cn(
            "absolute top-1/2 right-1 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md transition-opacity",
            "text-muted-foreground hover:bg-foreground/8 hover:text-foreground",
            "opacity-0 group-hover/nav-item:opacity-100 focus-visible:opacity-100",
            "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none"
          )}
        >
          <SplitRightGlyph />
        </button>
      )}
    </div>
  );
};

const SidebarNav = ({
  items,
  activeId,
  secondaryActiveId,
  onSelect,
  onSplit,
  splitLabel,
  className
}: SidebarNavProps): React.JSX.Element => {
  return (
    <nav className={className}>
      {items.map((item) => (
        <SidebarNavButton
          key={item.id}
          item={item}
          isActive={item.id === activeId}
          isSecondaryActive={
            secondaryActiveId !== undefined &&
            secondaryActiveId !== null &&
            item.id === secondaryActiveId
          }
          onSelect={onSelect}
          onSplit={onSplit}
          splitLabel={splitLabel}
        />
      ))}
    </nav>
  );
};

export { SidebarNav };

export type { SidebarNavProps, SidebarNavItem, NavIconComponent, NavIconHandle };
