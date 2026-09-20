import { useEffect, useMemo, useRef, useState } from "react";
import { CircleCheck, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";
import {
  CharacteristicsTable,
  DescriptionScroll,
  ExtrasList,
  FunctionalityGrid,
  ItemPhoto,
  PriceBlock,
} from "./OrderPage.jsx";
import { FinalCTA } from "./FinalCTA.jsx";
import { submitOrder } from "../lib/submitOrder.js";

const MAX_QUANTITY = 300;

const parsePrice = (value) => Number(String(value).replace(/\D/g, "")) || 0;

const lineKey = (item, length) => (length ? `${item.id}:${length}` : item.id);
const DEFAULT_PHONE = "+380";

// Keeps only "+" and digits so words and symbols can't be typed in.
function sanitizePhone(value) {
  return `+${value.replace(/\D/g, "").slice(0, 15)}`;
}

function isValidPhone(value) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("380")) return digits.length === 12;
  return digits.length >= 8 && digits.length <= 15;
}

function QuantitySelect({ label, value, min, onChange, id }) {
  const options = [];
  for (let n = min; n <= MAX_QUANTITY; n += 1) options.push(n);

  return (
    <label className="cart-qty" htmlFor={id}>
      <span>{label}</span>
      <select id={id} value={value} onChange={(event) => onChange(Number(event.target.value))}>
        {options.map((n) => (
          <option value={n} key={n}>
            {n}
          </option>
        ))}
      </select>
    </label>
  );
}

function ProductPreview({ item, order, cart, onClose }) {
  const [firstGroup, secondGroup] = item.characteristics || [];
  const closeRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      previousFocus?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="cart-modal-backdrop" onClick={onClose}>
      <div
        className="cart-modal"
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="cart-modal-close" aria-label={cart.close} onClick={onClose} ref={closeRef}>
          <X aria-hidden="true" strokeWidth={3} />
        </button>
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
      </div>
    </div>
  );
}

export function CartPage({ content, search, onNavigate }) {
  const { cart, order } = content;
  const requestedId = new URLSearchParams(search).get("item");
  const mainItem = order.items.find((item) => item.id === requestedId) || order.items[0];
  const accessories = useMemo(() => order.items.filter((item) => item.id !== mainItem.id), [order.items, mainItem.id]);

  // Quantities keyed by line: "<id>" or "<id>:<cableLength>" for items sold in several lengths.
  const [quantities, setQuantities] = useState({});
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(true);
  const [previewId, setPreviewId] = useState(null);
  const [contact, setContact] = useState({ name: "", phone: DEFAULT_PHONE });
  const [status, setStatus] = useState("idle"); // idle | error | sending | done
  const [errors, setErrors] = useState({});
  const successRef = useRef(null);

  useEffect(() => {
    setQuantities({ [lineKey(mainItem, mainItem.cableLengths?.[0])]: 1 });
    setErrors({});
    setPreviewId(null);
    setStatus("idle");
  }, [mainItem.id]);

  useEffect(() => {
    if (status === "done") successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [status]);

  const previewItem = order.items.find((item) => item.id === previewId);
  const lineQty = (item, length) => quantities[lineKey(item, length)] || 0;
  const totalQty = (item) =>
    item.cableLengths?.length
      ? item.cableLengths.reduce((sum, length) => sum + lineQty(item, length), 0)
      : lineQty(item);
  const setLineQty = (item, length, value) =>
    setQuantities((current) => ({ ...current, [lineKey(item, length)]: value }));
  const orderLines = [mainItem, ...accessories].flatMap((item) => {
    if (item.cableLengths?.length) {
      return item.cableLengths
        .map((length, index) => ({
          id: item.id,
          name: item.name,
          cableLengthM: length,
          quantity: lineQty(item, length),
          unitPrice: parsePrice(item.price?.[index]?.[1]),
        }))
        .filter((line) => line.quantity > 0);
    }
    const quantity = lineQty(item);
    return quantity > 0 ? [{ id: item.id, name: item.name, quantity, unitPrice: parsePrice(item.price) }] : [];
  });
  const total = orderLines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  const formatMoney = (value) =>
    `${cart.moneyPrefix}${value.toLocaleString(content.meta.lang === "uk" ? "uk-UA" : "en-US")}${cart.moneySuffix}`;
  const renderPrice = (item) =>
    typeof item.price === "string" ? (
      <span className="cart-row-price">
        {order.priceLabel}: <strong>{item.price}</strong>
      </span>
    ) : null;
  const renderLengths = (item, badge) => {
    if (!item.cableLengths?.length) return null;
    return (
      <div className="cart-lengths">
        <span className="cart-lengths-title">{cart.lengthLabel}</span>
        {item.cableLengths.map((length, index) => {
          const qty = lineQty(item, length);
          const id = `cart-qty-${item.id}-${length}`;
          return (
            <div className={`cart-length-row ${qty > 0 ? "is-added" : ""}`} key={length}>
              <span className="cart-length-name">
                {length} {cart.lengthUnit}
              </span>
              <span className="cart-length-price">{item.price?.[index]?.[1]}</span>
              <label className="cart-length-qty" htmlFor={id}>
                <span className="sr-only">{`${cart.quantityLabel}, ${length} ${cart.lengthUnit}`}</span>
                <select
                  id={id}
                  value={qty}
                  onChange={(event) => setLineQty(item, length, Number(event.target.value))}
                >
                  {Array.from({ length: MAX_QUANTITY + 1 }, (_, value) => (
                    <option value={value} key={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          );
        })}
        {badge}
      </div>
    );
  };
  const addedBadge = (
    <span className="cart-added-badge">
      <CircleCheck aria-hidden="true" /> {cart.addedLabel}
    </span>
  );
  const removeLine = (line) =>
    setQuantities((current) => ({ ...current, [lineKey({ id: line.id }, line.cableLengthM)]: 0 }));
  const renderRow = (item) => {
    const qty = totalQty(item);
    return (
      <article className={`cart-row ${qty > 0 ? "is-added" : ""}`} id={`cart-row-${item.id}`} key={item.id}>
        <button type="button" className="cart-row-info" onClick={() => setPreviewId(item.id)} aria-label={`${cart.details}: ${item.name}`}>
          <ItemPhoto item={item} order={order} />
          <span className="cart-row-text">
            <strong>{item.name}</strong>
            <span className="cart-row-short">{item.short}</span>
            {renderPrice(item)}
          </span>
        </button>
        {item.cableLengths?.length ? null : (
          <div className="cart-row-controls">
            <QuantitySelect
              id={`cart-qty-${item.id}`}
              label={cart.quantityLabel}
              value={qty}
              min={0}
              onChange={(value) => setLineQty(item, undefined, value)}
            />
            {qty > 0 ? addedBadge : null}
          </div>
        )}
        {renderLengths(item, qty > 0 ? addedBadge : null)}
      </article>
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!orderLines.length) return;
    const nextErrors = {
      name: !contact.name.trim(),
      phone: !isValidPhone(contact.phone),
    };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.phone) return;

    setStatus("sending");

    try {
      await submitOrder({
        items: orderLines,
        total,
        name: contact.name.trim(),
        phone: contact.phone.trim(),
        comment: comment.trim(),
        whatsappConsent: consent,
        language: content.meta.lang,
        submittedAt: new Date().toISOString(),
      });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <main className="order-page cart-page">
        <section className="section order-hero">
          <h1>{cart.title}</h1>
        </section>
        <section className="section">
          <div className="cart-success" role="status" ref={successRef}>
            <CircleCheck aria-hidden="true" />
            <p>{cart.success}</p>
            <a
              className="btn btn-secondary"
              href="/order"
              onClick={(event) => {
                event.preventDefault();
                onNavigate("/order");
              }}
            >
              <span>{cart.backToCatalog}</span>
            </a>
          </div>
        </section>
        <FinalCTA content={content} />
      </main>
    );
  }

  return (
    <main className="order-page cart-page">
      <section className="section order-hero">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, type: "spring", stiffness: 90, damping: 18 }}>
          <h1>{cart.title}</h1>
        </motion.div>
      </section>

      <section className="section cart-section">{renderRow(mainItem)}</section>

      {accessories.length ? (
        <section className="section cart-section">
          <h2 className="cart-subtitle">{cart.accessoriesTitle}</h2>
          <div className="cart-list">{accessories.map(renderRow)}</div>
        </section>
      ) : null}

      <section className="section cart-section cart-total-section">
        <div className="cart-total">
          <h2 className="cart-subtitle">{cart.totalTitle}</h2>
          {orderLines.length ? (
            <ul className="cart-total-lines">
              {orderLines.map((line) => {
                const label = `${line.name}${line.cableLengthM ? `, ${line.cableLengthM} ${cart.lengthUnit}` : ""}`;
                return (
                  <li key={`${line.id}-${line.cableLengthM || ""}`}>
                    <span className="cart-total-name">
                      {label} × {line.quantity}
                    </span>
                    <span className="cart-total-price">{formatMoney(line.quantity * line.unitPrice)}</span>
                    <button type="button" className="cart-remove" aria-label={`${cart.remove}: ${label}`} onClick={() => removeLine(line)}>
                      <Trash2 aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="cart-total-empty">{cart.emptyTotal}</p>
          )}
          <p className="cart-total-sum">
            <span>{cart.totalLabel}</span>
            <strong>{formatMoney(total)}</strong>
          </p>
        </div>
      </section>

      <section className="section cart-section">
        <form className="cart-submit" onSubmit={handleSubmit} noValidate>
          <h2 className="cart-subtitle">
            {cart.commentTitle} <span className="cart-tag">{cart.optionalLabel}</span>
          </h2>
          <label className="cart-comment">
            <span className="sr-only">{cart.commentTitle}</span>
            <textarea name="comment" rows={3} maxLength={1000} value={comment} onChange={(event) => setComment(event.target.value)} />
          </label>

          <h2 className="cart-subtitle">{cart.contactTitle}</h2>
          <div className="cart-fields">
            <label>
              <span>{cart.nameLabel} {cart.requiredLabel}</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                aria-invalid={errors.name || undefined}
                value={contact.name}
                onChange={(event) => {
                  setContact((c) => ({ ...c, name: event.target.value }));
                  setErrors((e) => ({ ...e, name: false }));
                }}
              />
              {errors.name ? <span className="cart-error" role="alert">{cart.nameError}</span> : null}
            </label>
            <label>
              <span>{cart.phoneLabel} {cart.requiredLabel}</span>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                maxLength={16}
                aria-invalid={errors.phone || undefined}
                value={contact.phone}
                onChange={(event) => {
                  setContact((c) => ({ ...c, phone: sanitizePhone(event.target.value) }));
                  setErrors((e) => ({ ...e, phone: false }));
                }}
              />
              {errors.phone ? <span className="cart-error" role="alert">{cart.phoneError}</span> : null}
            </label>
          </div>
          <div className="cart-terms">
            <h2 className="cart-subtitle">{cart.termsTitle}</h2>
            <ul>
              {cart.terms.map((term) => (
                <li key={term}>{term}</li>
              ))}
            </ul>
          </div>
          <label className="cart-consent">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
            <span>{cart.consent}</span>
          </label>
          {status === "error" ? <p className="cart-error" role="alert">{cart.errorMessage}</p> : null}
          <button type="submit" className="btn btn-primary cart-submit-btn" disabled={status === "sending" || !orderLines.length}>
            <span>{status === "sending" ? cart.sending : cart.submit}</span>
          </button>
        </form>
      </section>

      {previewItem ? <ProductPreview item={previewItem} order={order} cart={cart} onClose={() => setPreviewId(null)} /> : null}

      <FinalCTA content={content} />
    </main>
  );
}
