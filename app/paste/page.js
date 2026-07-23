"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseGitLog, GIT_LOG_COMMAND } from "@/lib/parseGitLog";
import styles from "./paste.module.css";

export default function PastePage() {
  const router = useRouter();
  const [raw, setRaw] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  function handleCopy() {
    navigator.clipboard.writeText(GIT_LOG_COMMAND).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  function handleSubmit() {
    const commits = parseGitLog(raw);
    if (commits.length === 0) {
      setError(
        "Couldn't find any commits in that. Make sure you used the exact command above."
      );
      return;
    }
    sessionStorage.setItem("ci_commits", JSON.stringify(commits));
    router.push("/results?source=paste");
  }

  return (
    <main className={styles.main}>
      <button className={styles.back} onClick={() => router.push("/")}>
        ← back
      </button>

      <h1 className={styles.title}>Paste your git log</h1>
      <p className={styles.subtitle}>
        Run this from inside any local repo, then paste the output below.
        Nothing leaves your browser.
      </p>

      <div className={styles.commandBox}>
        <code className={styles.commandText}>{GIT_LOG_COMMAND}</code>
        <button className={styles.copyBtn} onClick={handleCopy}>
          {copied ? "copied" : "copy"}
        </button>
      </div>

      <textarea
        className={styles.textarea}
        placeholder={
          "2024-06-01 22:14:03 +0000|||fix login bug\n2024-06-02 09:02:11 +0000|||add tests for auth\n..."
        }
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        spellCheck={false}
      />

      {error && <p className={styles.error}>{error}</p>}

      <button className={styles.submit} onClick={handleSubmit}>
        analyze {raw.trim() ? `(${raw.trim().split("\n").length} lines)` : ""}
      </button>
    </main>
  );
}
