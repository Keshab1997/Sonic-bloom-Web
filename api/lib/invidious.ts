/**
 * Shared Invidious instances list
 * Used by both yt-stream and proxy-yt-download API routes
 * These are public instances that provide YouTube API access
 */
export const INVIDIOUS_INSTANCES = [
  "https://inv.tux.pizza",
  "https://vid.puffyan.us",
  "https://yewtu.be",
  "https://invidious.lunar.icu",
  "https://invidious.privacyredirect.com",
];

export const PIPED_INSTANCES = [
  "https://pipedapi.kavin.rocks",
  "https://pipedapi.leptons.xyz",
  "https://pipedapi.nosebs.ru",
  "https://api-piped.mha.fi",
  "https://pipedapi.syncpundit.io",
  "https://pipedapi.tokhmi.xyz",
  "https://piped-api.garudalinux.org",
  "https://pipedapi.duck.si",
  "https://pipedapi.colinslegacy.com",
  "https://piped-api.lunar.icu",
  "https://pipedapi.adminforge.de",
  "https://pipedapi.owo.si",
];

export const PIPED_INSTANCES_API = "https://piped-instances.kavin.rocks";

/**
 * Timeout for each instance request (ms)
 */
export const INVIDIOUS_REQUEST_TIMEOUT = 6000;

/**
 * Common headers for API requests
 */
export const INVIDIOUS_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Accept': 'application/json',
  'Referer': 'https://piped.video/',
};
