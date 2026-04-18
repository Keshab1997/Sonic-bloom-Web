/**
 * Shared Invidious instances list
 * Used by both yt-stream and proxy-yt-download API routes
 * These are public Invidious instances that provide YouTube API access
 */
export const INVIDIOUS_INSTANCES = [
  "https://invidious.privacyredirect.com",
  "https://inv.tux.pizza",
  "https://vid.puffyan.us",
  "https://yewtu.be",
  "https://invidious.lunar.icu",
  "https://yewtu.be",
];

export const PIPED_INSTANCES = [
  "https://pipedapi.kavin.rocks",
  "https://pipedapi.leptons.xyz",
  "https://pipedapi.nosebs.ru",
  "https://pipedapi.tokhmi.xyz",
  "https://pipedapi.syncpundit.io",
  "https://api-piped.mha.fi",
  "https://piped-api.garudalinux.org",
  "https://pipedapi.duck.si",
  "https://pipedapi.colinslegacy.com",
  "https://piped-api.lunar.icu",
];

export const PIPED_INSTANCES_API = "https://piped-instances.kavin.rocks";

/**
 * Timeout for each Invidious instance request (ms)
 */
export const INVIDIOUS_REQUEST_TIMEOUT = 8000;

/**
 * Common headers for Invidious API requests
 */
export const INVIDIOUS_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json',
  'Referer': 'https://piped.video/',
};
