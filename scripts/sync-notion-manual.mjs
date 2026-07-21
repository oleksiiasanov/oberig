import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const DEFAULT_NOTION_URL = "https://righteous-inch-4a5.notion.site/SDR-374874c8aa8d80d9a786f2adfeb50383";
const OUTPUT_PATH = join(process.cwd(), "src/data/manual.generated.json");
const NOTION_VERSION = "2022-06-28";
const MAX_PUBLIC_CHUNKS = 40;

const sourceUrl = process.env.NOTION_MANUAL_URL || DEFAULT_NOTION_URL;
const pageId = normalizePageId(process.env.NOTION_PAGE_ID || extractPageId(sourceUrl));
const token = process.env.NOTION_TOKEN;

if (!pageId) {
  throw new Error("Unable to determine Notion page id. Set NOTION_PAGE_ID or NOTION_MANUAL_URL.");
}

function normalizePageId(value = "") {
  const clean = value.replace(/-/g, "").match(/[a-f0-9]{32}/i)?.[0];
  if (!clean) return "";
  return [clean.slice(0, 8), clean.slice(8, 12), clean.slice(12, 16), clean.slice(16, 20), clean.slice(20)].join("-");
}

function extractPageId(url) {
  return url.match(/[a-f0-9]{32}/i)?.[0] || "";
}

function textValue(value) {
  if (!Array.isArray(value)) return "";
  return value.map((part) => (Array.isArray(part) ? part[0] || "" : "")).join("");
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function oldRichText(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map(([plain, annotations = []]) => {
      const run = { text: plain || "" };

      for (const annotation of annotations) {
        if (!Array.isArray(annotation)) continue;
        if (annotation[0] === "a") run.href = annotation[1];
        if (annotation[0] === "b") run.bold = true;
        if (annotation[0] === "i") run.italic = true;
        if (annotation[0] === "s") run.strike = true;
        if (annotation[0] === "c") run.code = true;
      }

      return run;
    })
    .filter((run) => run.text);
}

function apiRichText(value = []) {
  return value
    .map((part) => ({
      text: part.plain_text || "",
      href: part.href || undefined,
      bold: part.annotations?.bold || undefined,
      italic: part.annotations?.italic || undefined,
      strike: part.annotations?.strikethrough || undefined,
      code: part.annotations?.code || undefined,
    }))
    .filter((run) => run.text);
}

function plainRichText(richText = []) {
  return cleanText(richText.map((run) => run.text).join(""));
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 280)}`);
  }

  return text ? JSON.parse(text) : {};
}

function publicApiUrl() {
  const url = new URL(sourceUrl);
  return `${url.origin}/api/v3/loadPageChunk`;
}

async function fetchPublicRecordMap() {
  const recordMap = { block: {} };
  let cursor = { stack: [] };
  let chunkNumber = 0;

  do {
    const data = await requestJson(publicApiUrl(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        pageId,
        limit: 100,
        cursor,
        chunkNumber,
        verticalColumns: false,
      }),
    });

    Object.assign(recordMap.block, data.recordMap?.block || {});
    cursor = data.cursor || { stack: [] };
    chunkNumber += 1;
  } while (cursor.stack?.length && chunkNumber < MAX_PUBLIC_CHUNKS);

  return recordMap;
}

function unwrapPublicBlock(entry) {
  return entry?.value?.value || entry?.value || null;
}

function publicFileUrl(block) {
  const source = textValue(block.properties?.source);
  const fileSource = block.format?.display_source || block.format?.source || source || "";

  if (fileSource.startsWith("attachment:")) {
    const url = new URL(sourceUrl);
    const params = new URLSearchParams({
      table: "block",
      id: block.id,
      spaceId: block.space_id,
      width: "2000",
      userId: "",
      cache: "v2",
    });

    return `${url.origin}/image/${encodeURIComponent(fileSource)}?${params}`;
  }

  return fileSource;
}

function publicTableRows(block, blocks) {
  const columnOrder = block.format?.table_block_column_order || [];

  return (block.content || [])
    .map((id) => blocks[id])
    .filter((row) => row?.type === "table_row")
    .map((row) => ({
      id: row.id,
      cells: columnOrder.map((columnId) => oldRichText(row.properties?.[columnId] || [])),
    }))
    .filter((row) => row.cells.some((cell) => plainRichText(cell)));
}

function convertPublicBlock(block, blocks) {
  if (!block) return null;

  const title = oldRichText(block.properties?.title);
  const children = (block.content || []).map((id) => convertPublicBlock(blocks[id], blocks)).filter(Boolean);
  const common = { id: block.id, richText: title, children };

  if (!plainRichText(title) && !children.length && !["divider", "image", "table"].includes(block.type)) return null;

  switch (block.type) {
    case "page":
      return { ...common, type: "child_page" };
    case "header":
      return { ...common, type: "heading_1" };
    case "sub_header":
      return { ...common, type: "heading_2" };
    case "sub_sub_header":
      return { ...common, type: "heading_3" };
    case "bulleted_list":
      return { ...common, type: "bulleted_list_item" };
    case "numbered_list":
      return { ...common, type: "numbered_list_item" };
    case "quote":
      return { ...common, type: "quote" };
    case "callout":
      return { ...common, icon: block.format?.page_icon || "i", type: "callout" };
    case "code":
      return { ...common, language: block.properties?.language?.[0]?.[0] || "", type: "code" };
    case "divider":
      return { id: block.id, type: "divider", richText: [], children: [] };
    case "image":
      return {
        id: block.id,
        type: "image",
        src: publicFileUrl(block),
        caption: oldRichText(block.properties?.caption),
        richText: [],
        children: [],
      };
    case "table":
      return {
        id: block.id,
        type: "table",
        hasColumnHeader: Boolean(block.format?.table_block_column_header),
        rows: publicTableRows(block, blocks),
        richText: [],
        children: [],
      };
    case "table_row":
      return null;
    case "toggle":
      return { ...common, type: "toggle" };
    default:
      return { ...common, type: "paragraph" };
  }
}

async function syncFromPublicPage() {
  const recordMap = await fetchPublicRecordMap();
  const blocks = Object.fromEntries(Object.entries(recordMap.block).map(([id, entry]) => [id, unwrapPublicBlock(entry)]));
  const page = blocks[pageId];

  if (!page) throw new Error("Notion public endpoint did not return the requested page.");

  const title = cleanText(textValue(page.properties?.title)) || "Посібник користувача SDR";
  const childIds = page.content || [];
  const blocksForSite = childIds.map((id) => convertPublicBlock(blocks[id], blocks)).filter(Boolean);

  return {
    source: "notion-public",
    sourceUrl,
    pageId,
    title,
    syncedAt: new Date().toISOString(),
    lastEditedAt: page.last_edited_time ? new Date(page.last_edited_time).toISOString() : null,
    blocks: blocksForSite,
  };
}

async function notionApi(path, options = {}) {
  return requestJson(`https://api.notion.com/v1${path}`, {
    ...options,
    headers: {
      authorization: `Bearer ${token}`,
      "notion-version": NOTION_VERSION,
      "content-type": "application/json",
      ...(options.headers || {}),
    },
  });
}

async function fetchApiChildren(blockId) {
  const children = [];
  let cursor;

  do {
    const params = new URLSearchParams({ page_size: "100" });
    if (cursor) params.set("start_cursor", cursor);
    const data = await notionApi(`/blocks/${blockId}/children?${params}`);

    for (const block of data.results || []) {
      children.push(await convertApiBlock(block));
    }

    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  return children.filter(Boolean);
}

async function convertApiBlock(block) {
  const value = block[block.type] || {};
  const richText = apiRichText(value.rich_text || []);
  const children = block.has_children ? await fetchApiChildren(block.id) : [];
  const common = { id: block.id, type: block.type, richText, children };

  switch (block.type) {
    case "paragraph":
    case "heading_1":
    case "heading_2":
    case "heading_3":
    case "bulleted_list_item":
    case "numbered_list_item":
    case "quote":
    case "toggle":
      return plainRichText(richText) || children.length ? common : null;
    case "callout":
      return { ...common, icon: value.icon?.emoji || value.icon?.external?.url || "i" };
    case "code":
      return { ...common, language: value.language || "" };
    case "divider":
      return { id: block.id, type: "divider", richText: [], children: [] };
    case "image":
      return {
        id: block.id,
        type: "image",
        src: value.file?.url || value.external?.url || "",
        caption: apiRichText(value.caption || []),
        richText: [],
        children: [],
      };
    case "table": {
      const rows = children
        .filter((child) => child.type === "table_row")
        .map((child) => ({ id: child.id, cells: child.cells || [] }));
      return {
        id: block.id,
        type: "table",
        hasColumnHeader: Boolean(value.has_column_header),
        rows,
        richText: [],
        children: [],
      };
    }
    case "table_row":
      return {
        id: block.id,
        type: "table_row",
        cells: (value.cells || []).map(apiRichText),
        richText: [],
        children: [],
      };
    case "child_page":
      return { ...common, richText: [{ text: value.title || "Untitled" }] };
    default:
      return plainRichText(richText) || children.length ? { ...common, type: "paragraph" } : null;
  }
}

async function syncFromApi() {
  const page = await notionApi(`/pages/${pageId}`);
  const titleProperty = Object.values(page.properties || {}).find((property) => property.type === "title");
  const title = cleanText((titleProperty?.title || []).map((part) => part.plain_text).join("")) || "Посібник користувача SDR";

  return {
    source: "notion-api",
    sourceUrl,
    pageId,
    title,
    syncedAt: new Date().toISOString(),
    lastEditedAt: page.last_edited_time || null,
    blocks: await fetchApiChildren(pageId),
  };
}

function fallbackManual(error) {
  return {
    source: "fallback",
    sourceUrl,
    pageId,
    title: "Посібник користувача SDR",
    syncedAt: new Date().toISOString(),
    lastEditedAt: null,
    error: error?.message || "Notion sync did not run.",
    blocks: [
      {
        id: "manual-fallback-callout",
        type: "callout",
        icon: "!",
        richText: [
          {
            text:
              "Інструкція підключена до Notion, але актуальний текст ще не синхронізовано. Запустіть npm run sync:manual або додайте NOTION_TOKEN для стабільного щоденного оновлення.",
          },
        ],
        children: [],
      },
    ],
  };
}

async function main() {
  let manual;

  try {
    manual = token ? await syncFromApi() : await syncFromPublicPage();
  } catch (error) {
    if (process.env.NOTION_SYNC_STRICT === "1") throw error;
    console.warn(`Notion manual sync fell back to placeholder content: ${error.message}`);
    manual = fallbackManual(error);
  }

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(manual, null, 2)}\n`);
  console.log(`Synced ${manual.blocks.length} manual blocks from ${manual.source} to ${OUTPUT_PATH}`);
}

main();
