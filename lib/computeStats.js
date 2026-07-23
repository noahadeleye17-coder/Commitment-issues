const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function computeStats(commits) {
  if (!commits || commits.length === 0) return null;

  const hourHistogram = new Array(24).fill(0);
  const weekdayHistogram = new Array(7).fill(0);
  // grid[weekday][hour] = commit count, for the punch-card heatmap
  const grid = Array.from({ length: 7 }, () => new Array(24).fill(0));
  const dayBuckets = new Map(); // "YYYY-MM-DD" -> count
  let totalMessageLength = 0;
  let nightOwl = 0; // 22:00 - 04:59
  let earlyBird = 0; // 05:00 - 07:59
  let weekend = 0;
  let vagueMessages = 0; // "fix", "wip", "update", etc.

  const vagueWords = new Set([
    "fix",
    "fixes",
    "wip",
    "update",
    "updates",
    "stuff",
    "changes",
    "misc",
    "cleanup",
    "test",
    "tmp",
    "asdf",
    "final",
    "final2",
    "oops",
  ]);

  const sorted = [...commits].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  for (const c of sorted) {
    const d = new Date(c.date);
    const hour = d.getHours();
    const weekday = d.getDay();
    const dayKey = d.toISOString().slice(0, 10);

    hourHistogram[hour]++;
    weekdayHistogram[weekday]++;
    grid[weekday][hour]++;
    dayBuckets.set(dayKey, (dayBuckets.get(dayKey) || 0) + 1);

    totalMessageLength += c.message.length;

    if (hour >= 22 || hour < 5) nightOwl++;
    if (hour >= 5 && hour < 8) earlyBird++;
    if (weekday === 0 || weekday === 6) weekend++;

    const firstWord = c.message.trim().split(/\s+/)[0]?.toLowerCase() || "";
    if (vagueWords.has(firstWord) || c.message.trim().length <= 4) {
      vagueMessages++;
    }
  }

  const total = sorted.length;

  // Messiest day = most commits in a single calendar day
  let messiestDay = { date: null, count: 0 };
  for (const [date, count] of dayBuckets.entries()) {
    if (count > messiestDay.count) messiestDay = { date, count };
  }

  // Streak calculation (consecutive calendar days with >=1 commit)
  const activeDays = [...dayBuckets.keys()].sort();
  let longestStreak = 0;
  let currentRun = 0;
  let prevDate = null;

  for (const dayKey of activeDays) {
    const d = new Date(dayKey + "T00:00:00Z");
    if (prevDate) {
      const diffDays = Math.round((d - prevDate) / (1000 * 60 * 60 * 24));
      currentRun = diffDays === 1 ? currentRun + 1 : 1;
    } else {
      currentRun = 1;
    }
    longestStreak = Math.max(longestStreak, currentRun);
    prevDate = d;
  }

  // Is the streak still "live" (last active day was today or yesterday)?
  const lastActive = new Date(activeDays[activeDays.length - 1] + "T00:00:00Z");
  const today = new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z");
  const daysSinceLast = Math.round((today - lastActive) / (1000 * 60 * 60 * 24));
  const currentStreak = daysSinceLast <= 1 ? currentRun : 0;

  const avgMessageLength = Math.round(totalMessageLength / total);
  const nightOwlPct = Math.round((nightOwl / total) * 100);
  const earlyBirdPct = Math.round((earlyBird / total) * 100);
  const weekendPct = Math.round((weekend / total) * 100);
  const vaguePct = Math.round((vagueMessages / total) * 100);

  const peakHour = hourHistogram.indexOf(Math.max(...hourHistogram));
  const peakDayIdx = weekdayHistogram.indexOf(Math.max(...weekdayHistogram));

  const firstDate = new Date(sorted[0].date);
  const lastDate = new Date(sorted[sorted.length - 1].date);

  const stats = {
    total,
    hourHistogram,
    weekdayHistogram,
    grid,
    messiestDay,
    longestStreak,
    currentStreak,
    avgMessageLength,
    nightOwlPct,
    earlyBirdPct,
    weekendPct,
    vaguePct,
    peakHour,
    peakDay: DAY_NAMES[peakDayIdx],
    firstDate: firstDate.toISOString(),
    lastDate: lastDate.toISOString(),
    dayNames: DAY_NAMES,
  };

  stats.personality = buildPersonality(stats);
  return stats;
}

function buildPersonality(s) {
  const archetypes = [
    {
      key: "night-crawler",
      title: "The Night Crawler",
      score: s.nightOwlPct,
      tagline: "Ships code while everyone else is asleep.",
      lines: [
        { label: "late-night commits", value: `${s.nightOwlPct}%`, sign: "+" },
        { label: "sleep schedule", value: "questionable", sign: "-" },
      ],
    },
    {
      key: "dawn-patrol",
      title: "The Dawn Patrol",
      score: s.earlyBirdPct * 1.5,
      tagline: "Commits before coffee. Suspicious levels of discipline.",
      lines: [
        { label: "before-8am commits", value: `${s.earlyBirdPct}%`, sign: "+" },
        { label: "excuses for skipping standup", value: "0", sign: "-" },
      ],
    },
    {
      key: "weekend-warrior",
      title: "The Weekend Warrior",
      score: s.weekendPct * 1.4,
      tagline: "Doesn't believe in a five-day work week.",
      lines: [
        { label: "weekend commits", value: `${s.weekendPct}%`, sign: "+" },
        { label: "work-life balance", value: "TBD", sign: "-" },
      ],
    },
    {
      key: "steady-hand",
      title: "The Steady Hand",
      score: s.longestStreak * 3,
      tagline: `A ${s.longestStreak}-day streak. Consistency as a personality trait.`,
      lines: [
        { label: "longest streak", value: `${s.longestStreak} days`, sign: "+" },
        { label: "days off", value: "what are those", sign: "-" },
      ],
    },
    {
      key: "minimalist",
      title: "The Minimalist Committer",
      score: s.vaguePct * 1.3,
      tagline: 'Believes "fix" is a complete sentence.',
      lines: [
        { label: "vague commit messages", value: `${s.vaguePct}%`, sign: "+" },
        { label: "avg message length", value: `${s.avgMessageLength} chars`, sign: "-" },
      ],
    },
    {
      key: "chaos-agent",
      title: "The Chaos Agent",
      score: s.messiestDay.count * 2,
      tagline: `Once shipped ${s.messiestDay.count} commits in a single day. No further questions.`,
      lines: [
        { label: "commits on messiest day", value: `${s.messiestDay.count}`, sign: "+" },
        { label: "impulse control", value: "loading...", sign: "-" },
      ],
    },
  ];

  archetypes.sort((a, b) => b.score - a.score);
  return archetypes[0];
}
