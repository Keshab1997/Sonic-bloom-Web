import type { VercelRequest, VercelResponse } from "@vercel/node";
import { INVIDIOUS_INSTANCES, INVIDIOUS_REQUEST_TIMEOUT, PIPED_INSTANCES, PIPED_INSTANCES_API, INVIDIOUS_HEADERS } from "./lib/invidious.js";
import { checkRateLimit, getRateLimitHeaders, defaultRateLimits } from "./lib/rate-limiter.js";

interface PipedInstance {
  url: string;
  cdn: string | null;
}

async function getPipedInstancesFromAPI(): Promise<string[]> {
  try {
    const res = await fetch(`${PIPED_INSTANCES_API}/instances?type=piped`, {
      headers: INVIDIOUS_HEADERS,
    });
    if (!res.ok) return [];
    const data = await res.json() as { piped: PipedInstance[] };
    const instances = data.piped
      .filter((i) => i.cdn)
      .slice(0, 8)
      .map((i) => i.url);
    return instances;
  } catch {
    return [];
  }
}
import { checkRateLimit, getRateLimitHeaders, defaultRateLimits } from "./lib/rate-limiter.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || "https://sonic-bloom-player.vercel.app";
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=7200");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Rate limiting
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
  const rateKey = `yt-stream:${clientIp}`;
  const rateResult = checkRateLimit(rateKey, defaultRateLimits["/api/yt-stream"]);
  
  if (!rateResult.allowed) {
    const headers = getRateLimitHeaders(rateResult.remaining, rateResult.resetTime);
    Object.entries(headers).forEach(([key, value]: [string, string]) => res.setHeader(key, value));
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }
  
  const headers = getRateLimitHeaders(rateResult.remaining, rateResult.resetTime);
  Object.entries(headers).forEach(([key, value]: [string, string]) => res.setHeader(key, value));

  const videoId = req.query.id as string;
  if (!videoId) return res.status(400).json({ error: "Missing id parameter" });

  // Try Invidious instances
  const tryInvidious = async (instance: string): Promise<{ audioUrl: string; source: string } | null> => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), INVIDIOUS_REQUEST_TIMEOUT);
      
      const invRes = await fetch(
        `${instance}/api/v1/videos/${videoId}?fields=adaptiveFormats`,
        {
          signal: controller.signal,
          headers: INVIDIOUS_HEADERS,
        }
      );
      
      clearTimeout(timeout);
      
      if (invRes.ok) {
        const invData = await invRes.json().catch(() => null);
        if (!invData?.adaptiveFormats) return null;
        
        const audioFormats = invData.adaptiveFormats.filter(
          (f: { type: string }) => f.type?.startsWith("audio/")
        );
        
        if (audioFormats.length > 0) {
          const best = audioFormats.sort(
            (a: { bitrate: number }, b: { bitrate: number }) => b.bitrate - a.bitrate
          )[0];
          
          const rawUrl = best.url;
          if (rawUrl) {
            const audioUrl = `/api/proxy-yt-audio?url=${encodeURIComponent(rawUrl)}`;
            return { audioUrl, source: instance };
          }
        }
      }
    } catch {
      // Instance failed, will try next one
    }
    return null;
  };

  // Try Piped instances (alternative API - often more reliable)
  const tryPiped = async (instance: string): Promise<{ audioUrl: string; source: string } | null> => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), INVIDIOUS_REQUEST_TIMEOUT);
      
      const pipedRes = await fetch(
        `${instance}/streams/${videoId}`,
        {
          signal: controller.signal,
          headers: INVIDIOUS_HEADERS,
        }
      );
      
      clearTimeout(timeout);
      
      if (pipedRes.ok) {
        const pipedData = await pipedRes.json().catch(() => null);
        if (!pipedData?.audioStreams) return null;
        
        // Get the best audio stream (highest bitrate)
        const audioStreams = pipedData.audioStreams.filter(
          (s: { mimeType: string }) => s.mimeType?.includes("audio")
        );
        
        if (audioStreams.length > 0) {
          const best = audioStreams.sort(
            (a: { bitrate: number }, b: { bitrate: number }) => (b.bitrate || 0) - (a.bitrate || 0)
          )[0];
          
          const rawUrl = best.url;
          if (rawUrl) {
            const audioUrl = `/api/proxy-yt-audio?url=${encodeURIComponent(rawUrl)}`;
            return { audioUrl, source: instance };
          }
        }
      }
    } catch {
      // Instance failed
    }
    return null;
  };

  // Try dynamic instances API first
  const dynamicInstances = await getPipedInstancesFromAPI();
  if (dynamicInstances.length > 0) {
    const batch = dynamicInstances.slice(0, 4);
    const results = await Promise.allSettled(batch.map(tryPiped));
    for (const result of results) {
      if (result.status === "fulfilled" && result.value) {
        return res.status(200).json(result.value);
      }
    }
  }

  // Try static Piped list
  const pipedBatch = PIPED_INSTANCES.slice(0, 4);
  const pipedResults = await Promise.allSettled(pipedBatch.map(tryPiped));
  for (const result of pipedResults) {
    if (result.status === "fulfilled" && result.value) {
      return res.status(200).json(result.value);
    }
  }

  // Try remaining Piped
  const remainingPiped = PIPED_INSTANCES.slice(4);
  for (const instance of remainingPiped) {
    const result = await tryPiped(instance);
    if (result) {
      return res.status(200).json(result);
    }
  }

  // Try Invidious (batch of 3)
  const firstBatch = INVIDIOUS_INSTANCES.slice(0, 3);
  const batchResults = await Promise.allSettled(firstBatch.map(tryInvidious));
  for (const result of batchResults) {
    if (result.status === "fulfilled" && result.value) {
      return res.status(200).json(result.value);
    }
  }

  // Try remaining Invidious
  const remaining = INVIDIOUS_INSTANCES.slice(3);
  for (const instance of remaining) {
    const result = await tryInvidious(instance);
    if (result) {
      return res.status(200).json(result);
    }
  }

  return res.status(503).json({
    error: "Could not extract audio from any source",
    fallback: true
  });
}