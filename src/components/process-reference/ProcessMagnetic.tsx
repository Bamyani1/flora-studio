"use client";

import { useRef, useState } from "react";
import { m } from "motion/react";

export function ProcessMagnetic({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;

    const middleX = event.clientX - (bounds.left + bounds.width / 2);
    const middleY = event.clientY - (bounds.top + bounds.height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  return (
    <m.div
      ref={ref}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </m.div>
  );
}
