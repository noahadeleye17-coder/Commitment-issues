import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Commitment Issues — a personality readout for your git habits";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 90px",
          background: "#11141b",
          backgroundImage:
            "radial-gradient(ellipse 900px 500px at 10% -10%, rgba(242,184,75,0.16), transparent), radial-gradient(ellipse 700px 500px at 100% 20%, rgba(111,207,151,0.10), transparent)",
        }}
      >
        {/* fake terminal titlebar */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 50 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "#f2777a",
              marginRight: 10,
              display: "flex",
            }}
          />
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "#f2b84b",
              marginRight: 10,
              display: "flex",
            }}
          />
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "#6fcf97",
              display: "flex",
            }}
          />
          <div
            style={{
              marginLeft: 20,
              fontSize: 24,
              color: "#5b606d",
              display: "flex",
            }}
          >
            zsh — commitment-issues
          </div>
        </div>

        <div
          style={{
            fontSize: 30,
            color: "#f2b84b",
            marginBottom: 18,
            display: "flex",
          }}
        >
          a personality readout, powered by your commit history
        </div>

        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: "#e9e4d8",
            lineHeight: 1.1,
            display: "flex",
          }}
        >
          Commitment Issues
        </div>

        <div
          style={{
            fontSize: 30,
            color: "#8b909e",
            marginTop: 34,
            maxWidth: 900,
            display: "flex",
          }}
        >
          Every commit has a timestamp. Yours have been telling on you.
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}