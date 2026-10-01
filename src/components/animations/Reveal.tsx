import type { ElementType, HTMLAttributes, ReactNode } from "react";

// Server Component: only renders data-reveal* attributes. The animation itself
// is driven by <ScrollReveal /> (root layout) + globals.css. See docs/animations.md.

export type RevealVariant = "up" | "down" | "start" | "end" | "fade" | "scale" | "blur" | "none";

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  variant?: RevealVariant;
  /** ms */
  delay?: number;
  /** ms */
  duration?: number;
  /** Stagger [data-reveal] children. `true` uses the default step, a number sets the step in ms. */
  stagger?: boolean | number;
  className?: string;
  children?: ReactNode;
};

export default function Reveal({
  as: Tag = "div",
  variant = "up",
  delay,
  duration,
  stagger,
  className,
  children,
  ...rest
}: RevealProps) {
  return (
    <Tag
      {...rest}
      className={className}
      data-reveal={variant}
      data-reveal-delay={delay}
      data-reveal-duration={duration}
      data-reveal-stagger={stagger === undefined || stagger === false ? undefined : stagger === true ? "" : stagger}
    >
      {children}
    </Tag>
  );
}
