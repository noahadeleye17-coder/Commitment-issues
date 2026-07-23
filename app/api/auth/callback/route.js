import { NextResponse } from "next/server";

export async function GET(request) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${appUrl}/?error=no_code`);
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${appUrl}/api/auth/callback`,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return NextResponse.redirect(`${appUrl}/?error=token_exchange_failed`);
  }

  const response = NextResponse.redirect(`${appUrl}/results?source=github`);

  // Short-lived, httpOnly — consumed once by /api/stats and cleared there.
  response.cookies.set("gh_token", tokenData.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  });

  return response;
}
