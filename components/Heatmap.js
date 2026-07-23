"use client";

import styles from "./Heatmap.module.css";

export default function Heatmap({ grid, dayNames }) {
  const max = Math.max(...grid.flat(), 1);

  function intensity(count) {
    if (count === 0) return 0;
    return Math.max(0.14, count / max);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.hourLabels}>
        {[0, 3, 6, 9, 12, 15, 18, 21].map((h) => (
          <span key={h} className={styles.hourLabel}>
            {formatHour(h)}
          </span>
        ))}
      </div>
      <div className={styles.grid}>
        {dayNames.map((day, dayIdx) => (
          <div key={day} className={styles.row}>
            <span className={styles.dayLabel}>{day}</span>
            <div className={styles.cells}>
              {grid[dayIdx].map((count, hourIdx) => (
                <div
                  key={hourIdx}
                  className={styles.cell}
                  style={{
                    background:
                      count === 0
                        ? "var(--bg-raised-2)"
                        : `rgba(242, 184, 75, ${intensity(count)})`,
                  }}
                  title={`${day} ${formatHour(hourIdx)}: ${count} commit${
                    count === 1 ? "" : "s"
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatHour(h) {
  if (h === 0) return "12am";
  if (h === 12) return "12pm";
  return h < 12 ? `${h}am` : `${h - 12}pm`;
}
