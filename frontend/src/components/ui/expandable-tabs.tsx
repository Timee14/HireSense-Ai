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
        "flex flex-wrap items-center gap-2 rounded-2xl border border-[#34d399]/30 bg-[#022c22]/80 p-1.5 shadow-xl backdrop-blur-2xl",
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
              "relative flex items-center rounded-xl px-4 py-2 text-xs font-bold transition-colors duration-300",
              isSelected
                ? cn("bg-[#34d399] text-[#022c22] font-black shadow-lg border border-[#6ee7b7]", activeColor)
                : "text-emerald-100/90 hover:bg-[#064e3b] hover:text-white"
            )}
          >
            <Icon size={18} />
            <AnimatePresence initial={false}>
              {isSelected && (
                <motion.span
                  variants={spanVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                  className="overflow-hidden whitespace-nowrap font-outfit ml-2"
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
