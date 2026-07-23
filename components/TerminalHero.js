"use client";

import { useEffect, useState } from "react";
import styles from "./TerminalHero.module.css";

const COMMAND = "git log --author=you --since=always --stat";
const TYPE_SPEED = 38;

export default function TerminalHero({ onPaste, onGithub }) {
  const [typed, setTyped] = useState("");
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTyped(COMMAND.slice(0, i));
      if (i >= COMMAND.length) {
        clearInterval(interval);
        setTimeout(() => setShowResult(true), 300);
      }
    }, TYPE_SPEED);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.window}>
      <div className={styles.titlebar}>
        <span className={styles.dot} style={{ background: "#f2777a" }} />
        <span className={styles.dot} style={{ background: "#f2b84b" }} />
        <span className={styles.dot} style={{ background: "#6fcf97" }} />
        <span className={styles.titleText}>zsh — commitment-issues</span>
      </div>
      <div className={styles.body}>
        <div className={styles.line}>
          <span className={styles.prompt}>~ $</span>
          <span className={styles.command}>{typed}</span>
          <span className={styles.cursor} aria-hidden="true">
            ▍
          </span>
        </div>

        {showResult && (
          <div className={styles.result}>
            <p className={styles.resultText}>
              analyzing {`{`}your entire coding personality{`}`}...
            </p>
            <div className={styles.actions}>
              <button className={styles.btnPrimary} onClick={onPaste}>
                <span className={styles.btnLabel}>paste git log</span>
                <span className={styles.btnHint}>no login, runs locally</span>
              </button>
              <button className={styles.btnSecondary} onClick={onGithub}>
                <span className={styles.btnLabel}>connect github</span>
                <span className={styles.btnHint}>pulls your recent repos</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
