"use client";

import React, { ElementType, ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

export type AnimationDirection = "up" | "down" | "left" | "right" | "fade" | "zoom";

export interface ScrollAnimateProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
  direction?: AnimationDirection;
  delay?: number; // In milliseconds (e.g. 150)
  duration?: number; // In milliseconds (e.g. 850)
  distance?: number; // In pixels for translation (e.g. 40)
  threshold?: number; // 0 to 1 intersection threshold
  rootMargin?: string;
  once?: boolean;
  className?: string;
  as?: ElementType;
  style?: React.CSSProperties;
}

export default function ScrollAnimate({
  children,
  direction = "up",
  delay = 0,
  duration = 850,
  distance = 40,
  threshold = 0.15,
  rootMargin = "0px 0px -40px 0px",
  once = true,
  className = "",
  as: Component = "div",
  style = {},
  ...restProps
}: ScrollAnimateProps) {
  const { ref, isInView } = useInView<HTMLElement>({
    threshold,
    rootMargin,
    once,
  });

  const getHiddenTransform = (): string => {
    switch (direction) {
      case "up":
        return `translate3d(0, ${distance}px, 0)`;
      case "down":
        return `translate3d(0, -${distance}px, 0)`;
      case "left":
        return `translate3d(-${distance}px, 0, 0)`;
      case "right":
        return `translate3d(${distance}px, 0, 0)`;
      case "zoom":
        return `scale(0.92)`;
      case "fade":
      default:
        return "none";
    }
  };

  const currentTransform = isInView
    ? "translate3d(0, 0, 0) scale(1)"
    : getHiddenTransform();

  const animationStyle: React.CSSProperties = {
    opacity: isInView ? 1 : 0,
    transform: currentTransform,
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: "transform, opacity",
    ...style,
  };

  return (
    <Component ref={ref} style={animationStyle} className={className} {...restProps}>
      {children}
    </Component>
  );
}
