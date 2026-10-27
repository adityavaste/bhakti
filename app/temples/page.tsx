// app/api/temple-live/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const handleOrChannel = searchParams.get("handle");

  if (!handleOrChannel) {
    return NextResponse.json({ videoId: null, isLive: false });
  }

  try {
    const probeUrl = handleOrChannel.startsWith("UC")
      ? `https://www.youtube.com/channel/${handleOrChannel}/live`
      : `https://www.youtube.com/${handleOrChannel}/live`;

    const res = await fetch(probeUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      cache: "no-store",
    });

    const html = await res.text();

    const canonicalMatch = html.match(
      /<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})">/
    );

    if (canonicalMatch && canonicalMatch[1]) {
      return NextResponse.json({ videoId: canonicalMatch[1], isLive: true });
    }
  } catch (err) {
    console.error("Probe error:", err);
  }

  return NextResponse.json({ videoId: null, isLive: false });
}