"use client";

import { motion } from "framer-motion";
import { cn } from "@/components/templates/clinic-premium/utils";

type Variant = "primary" | "dark" | "outline" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-mint text-brand-900 shadow-glow hover:bg-[#3AF0AB] hover:shadow-[0_10px_36px_-2px_rgba(32,226,152,0.75)]",
  dark: "bg-brand-900 text-white hover:bg-brand-700 shadow-soft",
  outline:
    "border border-brand-900/15 bg-white text-brand-900 hover:border-brand-900/40 hover:bg-brand-50",
  ghost: "bg-brand-900/5 text-brand-900 hover:bg-brand-900/10",
  light: "bg-white text-brand-900 hover:bg-mint-soft",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

type Props = {
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
  type?: "button" | "submit";
  disabled?: boolean;
  "aria-label"?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  type = "button",
  disabled,
  ...rest
}: Props) {
  const classes = cn(
    "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-colors duration-200 disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );
  const motionProps = {
    whileHover: { scale: 1.04 },
    whileTap: { scale: 0.97 },
    transition: { type: "spring", stiffness: 400, damping: 20 },
  } as const;

  if (href) {
    return (
      <motion.a href={href} className={classes} {...motionProps} {...rest}>
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button type={type} disabled={disabled} className={classes} {...motionProps} {...rest}>
      {children}
    </motion.button>
  );
}
