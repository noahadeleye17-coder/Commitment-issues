"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { computeStats } from "@/lib/computeStats";
import PersonalityCard from "@/components/PersonalityCard";
import Heatmap from "@/components/Heatmap";
import WeekdayBars from "@/components/WeekdayBars";
import Reveal from "@/components/Reveal";
import styles from "./results.module.css";

function ResultsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const source = searchParams.get("source");

  const [state, setState] = useState({
    status: "loading",
    stats: null,
    subject: "you",
    error: null,
  });

  useEffect(() => {
    async function load() {
      if (source === "paste") {
        const raw = sessionStorage.getItem("ci_commits");
        if (!raw) {
          setState({
            status: "error",
            error: "No commit data found. Try pasting your log again.",
          });
          return;
        }
        const commits = JSON.parse(raw);
        const stats = computeStats(commits);
        setState({ status: "ready", stats, subject: "you", error: null });
      } else if (source === "github") {
        try {
          const res = await fetch("/api/stats");
          const data = await res.json();
          if (!res.ok) {
            setState({ status: "error", error: data.error, stats: null });
            return;
          }
          const stats = computeStats(data.commits);
          setState({
            status: "ready",
            stats,
            subject: `@${data.username}`,
            error: null,
          });
        } catch {
          setState({
            status: "error",
            error: "Couldn't reach GitHub. Please try again.",
            stats: null,
          });
        }
      } else {
        setState({
          status: "error",
          error: "No data source specified.",
          stats: null,
        });
      }
    }
    load();
  }, [source]);

  if (state.status === "loading") {
    return (
      <main className={styles.centered}>
        <p className={styles.loadingText}>crunching commits...</p>
      </main>
    );
  }

  if (state.status === "error") {
    return (
      <main className={styles.centered}>
        <p className={styles.errorText}>{state.error}</p>
        <button className={styles.retryBtn} onClick={() => router.push("/")}>
          ← start over
        </button>
      </main>
    );
  }

  const s = state.stats;

  const statChips = [
    { label: "longest streak", value: `${s.longestStreak} days` },
    {
      label: "current streak",
      value: s.currentStreak > 0 ? `${s.currentStreak} days` : "broken",
    },
    {
      label: "messiest day",
      value: `${s.messiestDay.count} commits`,
      hint: s.messiestDay.date,
    },
    { label: "peak hour", value: formatHour(s.peakHour) },
    { label: "favorite day", value: s.peakDay },
    { label: "avg message length", value: `${s.avgMessageLength} chars` },
  ];

  return (
    <main className={styles.main}>
      <button className={styles.back} onClick={() => router.push("/")}>
        ← start over
      </button>

      <Reveal as="div" className={styles.header} y={16}>
        <p className={styles.eyebrow}>
          {s.total} commits · {formatRange(s.firstDate, s.lastDate)}
        </p>
        <h1 className={styles.title}>{state.subject}&apos;s commit history</h1>
      </Reveal>

      <Reveal as="section" className={styles.section}>
        <PersonalityCard personality={s.personality} subject={state.subject} />
      </Reveal>

      <Reveal as="section" className={styles.section}>
        <h2 className={styles.sectionTitle}>when you actually code</h2>
        <div className={styles.panel}>
          <Heatmap grid={s.grid} dayNames={s.dayNames} />
        </div>
      </Reveal>

      <Reveal as="section" className={styles.section}>
        <h2 className={styles.sectionTitle}>commits by day of week</h2>
        <div className={styles.panel}>
          <WeekdayBars weekdayHistogram={s.weekdayHistogram} dayNames={s.dayNames} />
        </div>
      </Reveal>

      <div className={styles.statsGrid}>
        {statChips.map((chip, i) => (
          <Reveal key={chip.label} as="div" delay={i * 60} y={16}>
            <StatChip {...chip} />
          </Reveal>
        ))}
      </div>
    </main>
  );
}

function StatChip({ label, value, hint }) {
  return (
    <div className={styles.chip}>
      <span className={styles.chipValue}>{value}</span>
      <span className={styles.chipLabel}>{label}</span>
      {hint && <span className={styles.chipHint}>{hint}</span>}
    </div>
  );
}

function formatHour(h) {
  if (h === 0) return "12am";
  if (h === 12) return "12pm";
  return h < 12 ? `${h}am` : `${h - 12}pm`;
}

function formatRange(start, end) {
  const opts = { month: "short", day: "numeric", year: "numeric" };
  const s = new Date(start).toLocaleDateString("en-US", opts);
  const e = new Date(end).toLocaleDateString("en-US", opts);
  return s === e ? s : `${s} – ${e}`;
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <main className={styles.centered}>
          <p className={styles.loadingText}>crunching commits...</p>
        </main>
      }
    >
      <ResultsInner />
    </Suspense>
  );
}