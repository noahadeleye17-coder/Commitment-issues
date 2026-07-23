"use client";

import styles from "./WeekdayBars.module.css";

export default function WeekdayBars({ weekdayHistogram, dayNames }) {
  const max = Math.max(...weekdayHistogram, 1);

  return (
    <div className={styles.wrap}>
      {weekdayHistogram.map((count, i) => (
        <div key={dayNames[i]} className={styles.col}>
          <span className={styles.count}>{count}</span>
          <div className={styles.barTrack}>
            <div
              className={styles.bar}
              style={{ height: `${Math.max(4, (count / max) * 100)}%` }}
            />
          </div>
          <span className={styles.label}>{dayNames[i]}</span>
        </div>
      ))}
    </div>
  );
}
