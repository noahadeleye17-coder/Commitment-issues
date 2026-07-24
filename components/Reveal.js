"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Reveal.module.css";

// Wraps children and fades/slides them in the first time they scroll into
// view. Reveals once and stays revealed (no re-hiding on scroll back up).
// Respects prefers-reduced-motion globally via globals.css, which zeroes out
// transition durations for every element.
export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  y = 24,
  className = "",
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // If it's already on screen on mount (e.g. above the fold), just show it
    // immediately rather than waiting on the observer's first tick.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.visible : ""} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        "--reveal-y": `${y}px`,
      }}
    >
      {children}
    </Tag>
  );
}
