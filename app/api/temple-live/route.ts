// app/api/temple-live/route.ts
import { NextResponse } from "next/server";

// Fallback IDs in case temple is between streams
const DEFAULT_FALLBACKS: Record<string, string> = {
  "vitthal-pandharpur": "0VfT9g20lMY",
  "kashi-vishwanath": "WPZ0xL0-sKs",
  "tirupati-balaji": "EMMWSBPvbrE",
  "shirdi-saibaba": "FIyZjCazWdI",
  "siddhivinayak-mumbai": "oWdSHxrwcBI",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const handleOrChannel = searchParams.get("handle"); // e.g. "@ShreeVitthalRukminiMandir" or channelId
  const templeId = searchParams.get("templeId") || "";

  if (!handleOrChannel) {
    return NextResponse.json({
      videoId: DEFAULT_FALLBACKS[templeId] || null,
      isLive: false,
    });
  }

  try {
    // Probe the channel's canonical live URL
    const probeUrl = handleOrChannel.startsWith("UC")
      ? `https://www.youtube.com/channel/${handleOrChannel}/live`
      : `https://www.youtube.com/${handleOrChannel}/live`;

    const res = await fetch(probeUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 300 }, // Cache resolution for 5 minutes
    });

    const html = await res.text();

    // 1. Check if an active video ID is in the canonical link
    const canonicalMatch = html.match(
      /<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})">/
    );

    if (canonicalMatch && canonicalMatch[1]) {
      return NextResponse.json({
        videoId: canonicalMatch[1],
        isLive: true,
      });
    }

    // 2. Secondary regex check for active video renderer
    const videoIdMatch = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
    if (videoIdMatch && videoIdMatch[1]) {
      return NextResponse.json({
        videoId: videoIdMatch[1],
        isLive: true,
      });
    }
  } catch (error) {
    console.error("Live resolver failed:", error);
  }

  // Return fallback if parsing fails or trust is offline
  return NextResponse.json({
    videoId: DEFAULT_FALLBACKS[templeId] || null,
    isLive: false,
  });
}