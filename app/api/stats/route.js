import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const GH_HEADERS = (token) => ({
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${token}`,
  "X-GitHub-Api-Version": "2022-11-28",
});

// How many of the user's most recently pushed-to repos to pull commits from.
// Kept small to stay well within GitHub's rate limits and response time.
const MAX_REPOS = 12;
const COMMITS_PER_REPO = 100;

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("gh_token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Not authenticated. Please connect GitHub again." },
      { status: 401 }
    );
  }

  try {
    const userRes = await fetch("https://api.github.com/user", {
      headers: GH_HEADERS(token),
    });
    if (!userRes.ok) throw new Error("Failed to fetch GitHub user");
    const user = await userRes.json();

    const reposRes = await fetch(
      `https://api.github.com/user/repos?per_page=${MAX_REPOS}&sort=pushed&direction=desc&affiliation=owner,collaborator`,
      { headers: GH_HEADERS(token) }
    );
    if (!reposRes.ok) throw new Error("Failed to fetch repos");
    const repos = await reposRes.json();

    const commitPromises = repos.map(async (repo) => {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${repo.full_name}/commits?author=${user.login}&per_page=${COMMITS_PER_REPO}`,
          { headers: GH_HEADERS(token) }
        );
        if (!res.ok) return [];
        const commits = await res.json();
        if (!Array.isArray(commits)) return [];
        return commits
          .filter((c) => c.commit?.author?.date)
          .map((c) => ({
            date: c.commit.author.date,
            message: (c.commit.message || "").split("\n")[0],
          }));
      } catch {
        return [];
      }
    });

    const results = await Promise.all(commitPromises);
    const commits = results.flat();

    if (commits.length === 0) {
      return NextResponse.json(
        {
          error:
            "Couldn't find any commits across your recent public repos. Try the paste option instead.",
        },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      username: user.login,
      commits,
      repoCount: repos.length,
    });

    // Token was single-use for this request — clear it now.
    response.cookies.set("gh_token", "", { maxAge: 0, path: "/" });

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong talking to GitHub. Please try again." },
      { status: 500 }
    );
  }
}
