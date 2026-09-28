"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/** Apparition en fondu/3D au scroll (classes .rv / .in du CSS d'origine). */
export default function Reveal({
  as = "div",
  className = "",
  children,
}: {
  as?: "div" | "figure";
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as ElementType;
  return (
    <Tag ref={ref} className={`${className} rv${seen ? " in" : ""}`}>
      {children}
    </Tag>
  );
}
