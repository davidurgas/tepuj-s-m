import { ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";

/**
 * Obalí obsah do animácie odhalenia pri scrollovaní.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    // @ts-expect-error – dynamický tag
    <Tag
      ref={ref}
      className={`reveal ${shown ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
