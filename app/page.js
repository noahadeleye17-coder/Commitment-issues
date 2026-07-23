"use client";

import { useRouter } from "next/navigation";
import TerminalHero from "@/components/TerminalHero";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();

  return (
    <main className={styles.main}>
      <div className={styles.eyebrow}>a personality readout, powered by your commit history</div>
      <h1 className={styles.headline}>
        Commitment <span className={styles.strike}>Issues</span>
      </h1>
      <p className={styles.subhead}>
        Every commit has a timestamp. Yours have been quietly building a profile
        of you — when you actually work, how long your streaks last, and how
        many times you&apos;ve committed something called <code>fix</code>.
        Let&apos;s read it back to you.
      </p>

      <div className={styles.heroWrap}>
        <TerminalHero
          onPaste={() => router.push("/paste")}
          onGithub={() => (window.location.href = "/api/auth/github")}
        />
      </div>

      <p className={styles.privacy}>
        Pasting a log processes everything in your browser — nothing is
        uploaded. Connecting GitHub only reads commit metadata (timestamps,
        messages) from repos you have access to.
      </p>
    </main>
  );
}
