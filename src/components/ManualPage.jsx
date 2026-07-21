import { ArrowLeft, BookOpen, Clock3, ExternalLink, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import manualData from "../data/manual.generated.json";

function richTextKey(run, index) {
  return `${run.text}-${run.href || ""}-${index}`;
}

function plainText(value = []) {
  return value.map((run) => run.text).join("").trim();
}

function RichText({ value = [] }) {
  if (!value.length) return null;

  return value.map((run, index) => {
    let node = run.text;

    if (run.code) node = <code>{node}</code>;
    if (run.bold) node = <strong>{node}</strong>;
    if (run.italic) node = <em>{node}</em>;
    if (run.strike) node = <s>{node}</s>;
    if (run.href) {
      node = (
        <a href={run.href} target="_blank" rel="noreferrer">
          {node}
        </a>
      );
    }

    return <span key={richTextKey(run, index)}>{node}</span>;
  });
}

function renderList(blocks, ordered) {
  const ListTag = ordered ? "ol" : "ul";

  return (
    <ListTag className="manual-list">
      {blocks.map((block) => (
        <li key={block.id}>
          <RichText value={block.richText} />
          {block.children?.length ? <ManualBlocks blocks={block.children} /> : null}
        </li>
      ))}
    </ListTag>
  );
}

function ManualBlock({ block }) {
  switch (block.type) {
    case "heading_1":
      return (
        <h2 id={block.id}>
          <RichText value={block.richText} />
        </h2>
      );
    case "heading_2":
      return (
        <h3 id={block.id}>
          <RichText value={block.richText} />
        </h3>
      );
    case "heading_3":
      return (
        <h4 id={block.id}>
          <RichText value={block.richText} />
        </h4>
      );
    case "quote":
      return (
        <blockquote>
          <RichText value={block.richText} />
        </blockquote>
      );
    case "callout":
      return (
        <aside className="manual-callout">
          <span aria-hidden="true">{block.icon || "i"}</span>
          <div>
            <RichText value={block.richText} />
            {block.children?.length ? <ManualBlocks blocks={block.children} /> : null}
          </div>
        </aside>
      );
    case "code":
      return (
        <pre>
          <code>
            {block.richText?.map((run) => run.text).join("")}
          </code>
        </pre>
      );
    case "divider":
      return <hr />;
    case "image":
      return block.src ? (
        <figure>
          <img src={block.src} alt={block.caption?.map((run) => run.text).join("") || manualData.title} loading="lazy" />
          {block.caption?.length ? (
            <figcaption>
              <RichText value={block.caption} />
            </figcaption>
          ) : null}
        </figure>
      ) : null;
    case "table":
      return block.rows?.length ? (
        <div className="manual-table-wrap">
          <table className="manual-table">
            {block.hasColumnHeader ? (
              <thead>
                <tr>
                  {block.rows[0].cells.map((cell, index) => (
                    <th key={`${block.rows[0].id}-${index}`}>
                      <RichText value={cell} />
                    </th>
                  ))}
                </tr>
              </thead>
            ) : null}
            <tbody>
              {(block.hasColumnHeader ? block.rows.slice(1) : block.rows).map((row) => (
                <tr key={row.id}>
                  {row.cells.map((cell, index) => (
                    <td key={`${row.id}-${index}`}>
                      <RichText value={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null;
    case "toggle":
      return (
        <details className="manual-toggle">
          <summary>
            <RichText value={block.richText} />
          </summary>
          {block.children?.length ? <ManualBlocks blocks={block.children} /> : null}
        </details>
      );
    case "child_page":
      return (
        <div className="manual-child-page">
          <BookOpen aria-hidden="true" />
          <RichText value={block.richText} />
        </div>
      );
    default:
      return (
        <p>
          <RichText value={block.richText} />
        </p>
      );
  }
}

function ManualBlocks({ blocks = [] }) {
  const rendered = [];

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];

    if (block.type === "bulleted_list_item" || block.type === "numbered_list_item") {
      const ordered = block.type === "numbered_list_item";
      const group = [];

      while (blocks[index]?.type === block.type) {
        group.push(blocks[index]);
        index += 1;
      }

      index -= 1;
      rendered.push(<div key={`${block.id}-group`}>{renderList(group, ordered)}</div>);
      continue;
    }

    rendered.push(<ManualBlock block={block} key={block.id} />);
  }

  return rendered;
}

function formatDate(value, language) {
  if (!value) return "";
  return new Intl.DateTimeFormat(language === "uk" ? "uk-UA" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function ManualSyncCard({ manual, updatedAt }) {
  return (
    <aside className="manual-sync-card" aria-label={manual.syncLabel}>
      <BookOpen aria-hidden="true" />
      <strong>{manual.syncLabel}</strong>
      {updatedAt ? (
        <span>
          <Clock3 aria-hidden="true" />
          {manual.updatedLabel}: {updatedAt}
        </span>
      ) : null}
      <span>
        <RefreshCw aria-hidden="true" />
        {manual.sourceLabel}: {manualData.source === "notion-api" ? "Notion API" : "Notion"}
      </span>
      <a href={manualData.sourceUrl} target="_blank" rel="noreferrer">
        {manual.openSourceLabel}
        <ExternalLink aria-hidden="true" />
      </a>
    </aside>
  );
}

function ManualToc({ items, label }) {
  if (!items.length) return null;

  return (
    <nav className="manual-toc" aria-label={label}>
      <span>{label}</span>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>{item.title}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function ManualPage({ content, language, onNavigate }) {
  const manual = content.manual;
  const updatedAt = formatDate(manualData.lastEditedAt || manualData.syncedAt, language);
  const hasBlocks = Array.isArray(manualData.blocks) && manualData.blocks.length > 0;
  const tocItems = (manualData.blocks || [])
    .filter((block) => block.type === "heading_2")
    .map((block) => ({ id: block.id, title: plainText(block.richText) }))
    .filter((item) => item.title)
    .slice(0, 8);

  return (
    <main className="manual-page">
      <section className="section manual-hero">
        <motion.a
          className="manual-back"
          href="/"
          onClick={(event) => {
            event.preventDefault();
            onNavigate("/");
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ArrowLeft aria-hidden="true" />
          <span>{manual.backLabel}</span>
        </motion.a>
        <motion.div
          className="manual-hero-grid"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, type: "spring", stiffness: 90, damping: 18 }}
        >
          <div>
            <h1>{manualData.title || manual.title}</h1>
            <p>{manual.lead}</p>
          </div>
          <ManualToc items={tocItems} label={manual.contentsLabel} />
        </motion.div>
      </section>

      <section className="section manual-reader-section">
        <article className="manual-reader">
          {hasBlocks ? (
            <ManualBlocks blocks={manualData.blocks} />
          ) : (
            <aside className="manual-empty">
              <BookOpen aria-hidden="true" />
              <h2>{manual.emptyTitle}</h2>
              <p>{manual.emptyText}</p>
            </aside>
          )}
        </article>
      </section>

      <section className="section manual-sync-section">
        <ManualSyncCard manual={manual} updatedAt={updatedAt} />
      </section>
    </main>
  );
}
