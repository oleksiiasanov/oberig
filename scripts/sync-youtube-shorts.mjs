import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const ROOT = process.cwd();
const OUTPUT_PATH = join(ROOT, "src/data/reels.generated.json");

const API_BASE = "https://www.googleapis.com/youtube/v3";
const KEY = process.env.YOUTUBE_API_KEY || process.env.YT_API_KEY || "";
const CHANNEL_ID = process.env.YT_CHANNEL_ID || "";
const PLAYLIST_ID = process.env.YT_PLAYLIST_ID || "";
const HANDLE = normalizeHandle(process.env.YT_HANDLE || "@D·VisionSDR");
const SHORTS_LIMIT = clampInt(process.env.YT_SHORTS_LIMIT, 12, 50);
const MAX_DURATION = clampInt(process.env.YT_MAX_DURATION_SECONDS, 180, 600);
const STRICT = process.env.YT_SYNC_STRICT === "1";

function normalizeHandle(value) {
  const trimmed = String(value || "").trim();
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

function clampInt(value, fallback, max) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function parseIsoDuration(value) {
  const match = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(value || "");
  if (!match) return Number.POSITIVE_INFINITY;
  const [, h = 0, m = 0, s = 0] = match;
  return Number(h) * 3600 + Number(m) * 60 + Number(s);
}

async function api(path, params) {
  const url = new URL(`${API_BASE}/${path}`);
  for (const [name, val] of Object.entries(params)) {
    if (val !== undefined && val !== "") url.searchParams.set(name, String(val));
  }
  url.searchParams.set("key", KEY);

  const response = await fetch(url);
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 280)}`);
  }
  return text ? JSON.parse(text) : {};
}

async function resolveUploadsPlaylist() {
  if (PLAYLIST_ID) return { playlistId: PLAYLIST_ID, channelId: CHANNEL_ID, channelTitle: "" };

  const query = CHANNEL_ID
    ? { part: "contentDetails,snippet", id: CHANNEL_ID }
    : { part: "contentDetails,snippet", forHandle: HANDLE };

  let data = await api("channels", query);

  if (!data.items?.length && !CHANNEL_ID) {
    data = await api("channels", { part: "contentDetails,snippet", forHandle: HANDLE.replace(/^@/, "") });
  }

  const channel = data.items?.[0];
  if (!channel) throw new Error(`Channel not found for ${CHANNEL_ID || HANDLE}.`);

  return {
    playlistId: channel.contentDetails?.relatedPlaylists?.uploads,
    channelId: channel.id,
    channelTitle: cleanText(channel.snippet?.title),
  };
}

async function collectPlaylistVideos(playlistId) {
  const videos = [];
  let pageToken;

  do {
    const data = await api("playlistItems", {
      part: "contentDetails,snippet",
      playlistId,
      maxResults: 50,
      pageToken,
    });

    for (const item of data.items || []) {
      const id = item.contentDetails?.videoId;
      if (!id) continue;
      videos.push({
        id,
        title: cleanText(item.snippet?.title),
        publishedAt: item.contentDetails?.videoPublishedAt || item.snippet?.publishedAt || null,
      });
    }

    pageToken = data.nextPageToken;
  } while (pageToken && videos.length < 200);

  return videos;
}

async function keepShorts(videos) {
  const durations = new Map();

  for (let i = 0; i < videos.length; i += 50) {
    const batch = videos.slice(i, i + 50);
    const data = await api("videos", { part: "contentDetails", id: batch.map((v) => v.id).join(",") });
    for (const item of data.items || []) {
      durations.set(item.id, parseIsoDuration(item.contentDetails?.duration));
    }
  }

  return videos.filter((video) => (durations.get(video.id) ?? Number.POSITIVE_INFINITY) <= MAX_DURATION);
}

async function syncFromApi() {
  if (!KEY) throw new Error("YOUTUBE_API_KEY is not set.");

  const { playlistId, channelId, channelTitle } = await resolveUploadsPlaylist();
  if (!playlistId) throw new Error("Could not resolve an uploads playlist for the channel.");

  const all = await collectPlaylistVideos(playlistId);
  const shorts = (await keepShorts(all))
    .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
    .slice(0, SHORTS_LIMIT);

  return {
    source: "youtube",
    channelId: channelId || CHANNEL_ID || "",
    channelTitle,
    handle: HANDLE,
    syncedAt: new Date().toISOString(),
    items: shorts.map((video) => ({
      id: video.id,
      title: video.title,
      publishedAt: video.publishedAt,
      url: `https://www.youtube.com/shorts/${video.id}`,
      thumbnail: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
      thumbnails: [
        `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`,
        `https://i.ytimg.com/vi/${video.id}/hq720.jpg`,
        `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
      ],
      embedUrl: `https://www.youtube-nocookie.com/embed/${video.id}`,
    })),
  };
}

async function readExisting() {
  try {
    return JSON.parse(await readFile(OUTPUT_PATH, "utf8"));
  } catch {
    return null;
  }
}

async function main() {
  let payload;

  try {
    payload = await syncFromApi();
  } catch (error) {
    if (STRICT) throw error;

    console.warn(`YouTube Shorts sync fell back: ${error.message}`);
    const existing = await readExisting();
    payload = existing?.items?.length
      ? { ...existing, source: existing.source === "youtube" ? "cache" : existing.source || "cache", syncedAt: new Date().toISOString(), error: error.message }
      : { source: "fallback", handle: HANDLE, syncedAt: new Date().toISOString(), error: error.message, items: [] };
  }

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Synced ${payload.items.length} shorts from ${payload.source} to ${OUTPUT_PATH}`);
}

main();
