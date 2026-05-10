import React, { useRef } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ICON_SIZE = 16;

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
  className?: string;
}

interface SidebarNavButtonProps {
  item: SidebarNavItem;
  isActive: boolean;
  isSecondaryActive: boolean;
  onSelect: (id: string) => void;
}

const SidebarNavButton = ({
  item,
  isActive,
  isSecondaryActive,
  onSelect
}: SidebarNavButtonProps): React.JSX.Element => {
  const iconRef = useRef<NavIconHandle>(null);
  const { id, label, icon: Icon } = item;
  const showSecondaryBadge = !isActive && isSecondaryActive;

  return (
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
  );
};

const SidebarNav = ({
  items,
  activeId,
  secondaryActiveId,
  onSelect,
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
        />
      ))}
    </nav>
  );
};

export { SidebarNav };

export type { SidebarNavProps, SidebarNavItem, NavIconComponent, NavIconHandle };
