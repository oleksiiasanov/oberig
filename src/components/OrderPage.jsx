import { ArrowUpRight, Antenna, CarFront, CircleCheck, Radar, ShieldHalf, ImageOff } from "lucide-react";
import { motion } from "framer-motion";
import { FinalCTA } from "./FinalCTA.jsx";

const ITEM_ICONS = {
  radar: Radar,
  "car-front": CarFront,
  antenna: Antenna,
  "shield-half": ShieldHalf,
};

function ItemTag({ item }) {
  if (!item.tag) return null;
  return <span className={`order-item-tag order-item-tag-${item.tagStatus}`}>{item.tag}</span>;
}

function ItemPhoto({ item, order }) {
  if (item.photo) {
    return (
      <div className="order-item-photo has-photo">
        <ItemTag item={item} />
        <img src={item.photo} alt={item.name} loading="lazy" />
      </div>
    );
  }

  const Icon = ITEM_ICONS[item.icon] || ImageOff;

  return (
    <div className="order-item-photo">
      <ItemTag item={item} />
      <Icon aria-hidden="true" />
      <span aria-hidden="true">{order.photoPendingLabel}</span>
    </div>
  );
}

function DescriptionScroll({ label, paragraphs }) {
  return (
    <div className="order-description">
      <h4>{label}</h4>
      <div className="order-description-full">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

function CharacteristicsTable({ title, rows }) {
  return (
    <div className="order-spec-table">
      <h4>{title}</h4>
      <dl className="order-spec-list">
        {rows.map(([label, value]) => (
          <div className="order-spec-row" key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function FunctionalityGrid({ title, items }) {
  return (
    <div className="order-functionality">
      <h4>{title}</h4>
      <div className="order-functionality-grid">
        {items.map((text) => (
          <div className="order-functionality-tile" key={text}>
            <CircleCheck aria-hidden="true" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExtrasList({ title, items }) {
  return (
    <div className="order-extra-group">
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function PriceBlock({ label, price }) {
  if (Array.isArray(price)) {
    return (
      <div className="order-price order-price-tiers">
        <span className="order-price-label">{label}</span>
        <ul>
          {price.map(([tierLabel, tierValue]) => (
            <li key={tierLabel}>
              {tierLabel}: <strong>{tierValue}</strong>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <p className="order-price">
      {label}: <strong>{price}</strong>
    </p>
  );
}

function OrderItem({ item, order, orderUrl, orderLabel }) {
  const [firstGroup, secondGroup] = item.characteristics || [];

  return (
    <motion.article
      className="order-item"
      id={item.id}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 90, damping: 18 }}
    >
      <div className="order-item-top">
        <ItemPhoto item={item} order={order} />
        <div className="order-item-intro">
          <h3>{item.name}</h3>
          <p className="order-item-short">{item.short}</p>
          {firstGroup ? <CharacteristicsTable title={firstGroup.title} rows={firstGroup.rows} /> : null}
        </div>
      </div>

      <div className={`order-description-row ${secondGroup ? "" : "order-description-row-single"}`}>
        <DescriptionScroll label={order.descriptionLabel} paragraphs={item.description} />
        {secondGroup ? <CharacteristicsTable title={secondGroup.title} rows={secondGroup.rows} /> : null}
      </div>

      {item.functionality?.items?.length ? (
        <FunctionalityGrid title={item.functionality.title} items={item.functionality.items} />
      ) : null}

      {item.extras?.length ? (
        <div className="order-extras">
          {item.extras.map((extra) => (
            <ExtrasList title={extra.title} items={extra.items} key={extra.title} />
          ))}
        </div>
      ) : null}

      {item.price ? <PriceBlock label={order.priceLabel} price={item.price} /> : null}

      <a className="btn btn-primary order-item-cta" href={orderUrl} target="_blank" rel="noreferrer">
        <span>{orderLabel}</span>
        <ArrowUpRight aria-hidden="true" />
      </a>
    </motion.article>
  );
}

function QuickNav({ items, quickNav }) {
  const links = quickNav
    .map(([label, category]) => [label, items.find((item) => item.category === category)?.id])
    .filter(([, id]) => id);

  if (!links.length) return null;

  return (
    <nav className="order-quicknav" aria-label="Quick product navigation">
      {links.map(([label, id]) => (
        <a className="order-quicknav-tab" href={`#${id}`} key={id}>
          {label}
        </a>
      ))}
    </nav>
  );
}

export function OrderPage({ content }) {
  const { order } = content;

  return (
    <main className="order-page">
      <section className="section order-hero">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, type: "spring", stiffness: 90, damping: 18 }}>
          <h1>{order.title}</h1>
        </motion.div>
        <QuickNav items={order.items} quickNav={order.quickNav} />
      </section>

      <section className="section order-list-section">
        <div className="order-list">
          {order.items.map((item) => (
            <OrderItem item={item} order={order} orderUrl={content.orderUrl} orderLabel={content.meta.primaryAction} key={item.id} />
          ))}
        </div>
      </section>

      <FinalCTA content={content} />
    </main>
  );
}
