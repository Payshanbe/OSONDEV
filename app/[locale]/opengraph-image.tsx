import { ImageResponse } from "next/og";

export const alt = "OSONDEV — independent digital studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "edge";

interface ImageProps {
  params: Promise<{ locale: string }>;
}

export default async function OpenGraphImage({ params }: ImageProps) {
  const { locale } = await params;
  const copy =
    locale === "ru"
      ? {
          title: "Цифровые продукты",
          subtitle: "проектируем и разрабатываем с вниманием к деталям.",
          eyebrow: "НЕЗАВИСИМАЯ ЦИФРОВАЯ СТУДИЯ",
        }
      : {
          title: "Digital products",
          subtitle: "designed and engineered with clarity.",
          eyebrow: "INDEPENDENT DIGITAL STUDIO",
        };

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#09090b",
          color: "#fafafa",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px 80px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background:
              "radial-gradient(circle at 78% 18%, rgba(111, 61, 190, 0.42), transparent 34%), radial-gradient(circle at 22% 88%, rgba(22, 111, 138, 0.28), transparent 38%)",
            display: "flex",
            inset: 0,
            position: "absolute",
          }}
        />
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            display: "flex",
            inset: 32,
            position: "absolute",
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: "0.18em",
            position: "relative",
          }}
        >
          OSONDEV
        </div>
        <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 650, lineHeight: 1.05 }}>
            {copy.title}
          </div>
          <div
            style={{
              color: "rgba(250,250,250,0.68)",
              display: "flex",
              fontSize: 34,
              marginTop: 18,
            }}
          >
            {copy.subtitle}
          </div>
        </div>
        <div
          style={{
            color: "rgba(250,250,250,0.58)",
            display: "flex",
            fontSize: 22,
            justifyContent: "space-between",
            letterSpacing: "0.08em",
            position: "relative",
          }}
        >
          <span>{copy.eyebrow}</span>
          <span>OSONDEV.TJ</span>
        </div>
      </div>
    ),
    size,
  );
}
