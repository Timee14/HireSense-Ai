"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOnClickOutside } from "usehooks-ts";
import { cn } from "../../lib/utils";
import { LucideIcon } from "lucide-react";

export interface Tab {
  title: string;
  icon: LucideIcon;
  type?: undefined;
}

export interface Separator {
  type: "separator";
  title?: undefined;
  icon?: undefined;
}

export type TabItem = Tab | Separator;

interface ExpandableTabsProps {
  tabs: TabItem[];
  className?: string;
  activeColor?: string;
  onChange?: (index: number | null) => void;
  selectedIndex?: number | null;
}

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { delay: 0.1, type: "spring" as const, bounce: 0, duration: 0.6 };

export function ExpandableTabs({
  tabs,
  className,
  activeColor = "text-purple-400",
  onChange,
  selectedIndex,
}: ExpandableTabsProps) {
  const [selected, setSelected] = React.useState<number | null>(selectedIndex ?? null);
  const outsideClickRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (selectedIndex !== undefined) {
      setSelected(selectedIndex);
    }
  }, [selectedIndex]);

  useOnClickOutside(outsideClickRef, () => {
    // Keep active tab selection
  });

  const handleSelect = (index: number) => {
    setSelected(index);
    onChange?.(index);
  };

  const SeparatorComponent = () => (
    <div className="mx-1 h-[24px] w-[1.2px] bg-white/20" aria-hidden="true" />
  );

  return (
    <div
      ref={outsideClickRef}
      className={cn(
        "flex flex-wrap items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 shadow-xl backdrop-blur-2xl",
        className
      )}
    >
      {tabs.map((tab, index) => {
        if ('type' in tab && tab.type === "separator") {
          return <SeparatorComponent key={`separator-${index}`} />;
        }

        const item = tab as Tab;
        const Icon = item.icon;
        const isSelected = selected === index;
        return (
          <motion.button
            key={item.title}
            variants={buttonVariants}
            initial={false}
            animate="animate"
            custom={isSelected}
            onClick={() => handleSelect(index)}
            transition={transition}
            className={cn(
              "relative flex items-center rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200",
              isSelected
                ? "bg-white text-slate-950 font-bold shadow-md shadow-white/10 border border-white/30"
                : "text-slate-400 hover:bg-white/10 hover:text-white"
            )}
          >
            <Icon size={16} />
            <AnimatePresence initial={false}>
              {isSelected && (
                <motion.span
                  variants={spanVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                  className="overflow-hidden whitespace-nowrap ml-1.5 font-medium"
                >
                  {item.title}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
