// Expects output from:
//   git log --pretty=format:"%ad|||%s" --date=iso
// One commit per line: ISO timestamp, then "|||", then subject line.
// Tolerant of extra blank lines and slightly different spacing.

export function parseGitLog(raw) {
  if (!raw || !raw.trim()) return [];

  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  const commits = [];

  for (const line of lines) {
    const sepIndex = line.indexOf("|||");
    if (sepIndex === -1) continue;

    const dateStr = line.slice(0, sepIndex).trim();
    const message = line.slice(sepIndex + 3).trim();
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) continue;

    commits.push({
      date: date.toISOString(),
      message,
    });
  }

  return commits;
}

export const GIT_LOG_COMMAND =
  'git log --all --pretty=format:"%ad|||%s" --date=iso';
