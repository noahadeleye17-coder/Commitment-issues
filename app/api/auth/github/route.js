import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!clientId || !appUrl) {
    return new NextResponse(
      "Missing GITHUB_CLIENT_ID or NEXT_PUBLIC_APP_URL env vars. See .env.example.",
      { status: 500 }
    );
  }

  const redirectUri = `${appUrl}/api/auth/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    // Empty scope = read-only access to the user's public profile and public
    // repo data only. Widen to "repo" if you want private repos included too
    // (and update the privacy copy on the landing page if you do).
    scope: "",
    allow_signup: "true",
  });

  return NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`
  );
}
