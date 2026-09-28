"use client";

import { useRef, type ReactNode } from "react";

/** Inclinaison 3D qui suit le pointeur (bloc « À propos »). */
export default function Tilt3D({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={className}
      aria-hidden="true"
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--ry", ((e.clientX - r.left) / r.width - 0.5) * 24 + "deg");
        el.style.setProperty("--rx", -((e.clientY - r.top) / r.height - 0.5) * 18 + "deg");
      }}
      onPointerLeave={() => {
        ref.current?.style.removeProperty("--ry");
        ref.current?.style.removeProperty("--rx");
      }}
    >
      {children}
    </div>
  );
}
