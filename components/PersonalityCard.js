"use client";

import styles from "./PersonalityCard.module.css";

function fakeHash(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(16).slice(0, 7).padEnd(7, "0");
}

export default function PersonalityCard({ personality, subject }) {
  const hash = fakeHash(personality.key + subject);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.commitLabel}>commit</span>
        <span className={styles.hash}>{hash}</span>
      </div>

      <div className={styles.meta}>
        <span className={styles.metaLabel}>Author:</span> {subject}
      </div>

      <h2 className={styles.title}>{personality.title}</h2>
      <p className={styles.tagline}>{personality.tagline}</p>

      <div className={styles.diff}>
        {personality.lines.map((line, i) => (
          <div key={i} className={styles.diffLine}>
            <span
              className={
                line.sign === "+" ? styles.signAdd : styles.signRemove
              }
            >
              {line.sign}
            </span>
            <span className={styles.diffLabel}>{line.label}</span>
            <span
              className={
                line.sign === "+" ? styles.valueAdd : styles.valueRemove
              }
            >
              {line.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
