import { useEffect, useMemo, useRef, useState } from "react";
import { CircleCheck, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";
import {
  CharacteristicsTable,
  DescriptionScroll,
  ExtrasList,
  FunctionalityGrid,
  ItemModel,
  ItemNotice,
  ItemPhoto,
  PART_CATEGORY,
  PriceBlock,
} from "./OrderPage.jsx";
import { CheckoutChallenge } from "./CheckoutChallenge.jsx";
import { clearAttempt, readAttempt, saveAttempt, orderAttempt, sendCrmOrder, submitCheckout } from "../lib/checkout.js";
import { itemPrice, checkCart } from "../lib/liveCatalog.js";
import { FinalCTA } from "./FinalCTA.jsx";
import { submitOrder, submitSurvey } from "../lib/submitOrder.js";
import { lineKey, useCart } from "../lib/cartStore.js";

const ORDER_API_URL = import.meta.env.VITE_ORDER_API_URL || "https://api.dvision.com.ua/order";
const TURNSTILE_SITEKEY = import.meta.env.VITE_TURNSTILE_SITEKEY || "";
const tabStorage = () => { try { return window.sessionStorage; } catch { return null; } };


// "Where did you hear about us" after the thank-you message; the answer lands in the order's row in the CRM sheet.
function SourceSurvey({ survey, order }) {
  const [choice, setChoice] = useState("");
  const [other, setOther] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | error | done
  const options = [
    { value: survey.recommendation, label: survey.recommendation },
    ...survey.social.map((name) => ({ value: `${survey.socialTitle}: ${name}`, label: name, social: true })),
    { value: survey.google, label: survey.google },
    { value: survey.other, label: survey.other },
  ];
  const isOther = choice === survey.other;
  const source = isOther ? (other.trim() ? `${survey.other}: ${other.trim()}` : "") : choice;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!source) return;
    setStatus("sending");
    try {
      await submitSurvey({ orderNumber: order.orderNumber, clientOrderId: order.clientOrderId, phone: order.phone, source });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="cart-survey" role="status">
        <p className="cart-survey-thanks">{survey.thanks}</p>
      </div>
    );
  }

  const renderOption = (option) => (
    <label className="cart-survey-option" key={option.value}>
      <input
        type="radio"
        name="source"
        value={option.value}
        checked={choice === option.value}
        onChange={() => setChoice(option.value)}
      />
      <span>{option.label}</span>
    </label>
  );

  return (
    <form className="cart-survey" onSubmit={handleSubmit}>
      <fieldset>
        <legend>
          <strong>{survey.title}</strong>
          <span>{survey.question}</span>
        </legend>
        {renderOption(options[0])}
        <div className="cart-survey-group">
          <span className="cart-survey-group-title">{survey.socialTitle}</span>
          {options.filter((option) => option.social).map(renderOption)}
        </div>
        {options.filter((option, index) => index > 0 && !option.social).map(renderOption)}
        {isOther ? (
          <input
            className="cart-survey-other"
            type="text"
            maxLength={200}
            value={other}
            placeholder={survey.otherPlaceholder}
            aria-label={survey.otherPlaceholder}
            onChange={(event) => setOther(event.target.value)}
            autoFocus
          />
        ) : null}
      </fieldset>
      {status === "error" ? <p className="cart-error">{survey.error}</p> : null}
      <button type="submit" className="btn btn-primary" disabled={!source || status === "sending"}>
        <span>{status === "sending" ? survey.sending : survey.submit}</span>
      </button>
    </form>
  );
}


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

function QuantityInput({ id, label, value, min, onChange }) {
  const [draft, setDraft] = useState(String(value));
  const inputRef = useRef(null);
  useEffect(() => { setDraft(String(value)); inputRef.current?.setCustomValidity(""); }, [value]);
  return <input ref={inputRef} id={id} className="qty-input" form="checkout-form" type="number" inputMode="numeric"
    aria-label={label} min={min} step="1" required value={draft}
    onChange={(event) => {
      const raw = event.target.value;
      setDraft(raw);
      const next = Number(raw);
      const valid = raw !== "" && Number.isSafeInteger(next) && next >= min;
      event.target.setCustomValidity(valid ? "" : (document.documentElement.lang === "en" ? "Enter a whole quantity." : "Вкажіть цілу кількість."));
      if (valid) onChange(next);
    }}
    onBlur={(event) => {
      if (draft === "") { setDraft(String(min)); onChange(min); event.target.setCustomValidity(""); }
    }} />;
}

function AddedBadge({ label, iconOnly }) {
  return (
    <span className="cart-added-badge" role={iconOnly ? "img" : undefined} aria-label={iconOnly ? label : undefined}>
      <CircleCheck aria-hidden="true" />
      {iconOnly ? null : ` ${label}`}
    </span>
  );
}

function QuantitySelect({ label, value, min, onChange, id, reset }) {
  return (
    <div className="cart-qty">
      <span>{label}</span>
      <QuantityInput key={reset} id={id} label={label} value={value} min={min} onChange={onChange} />
    </div>
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
            <ItemModel item={item} order={order} />
            <p className="order-item-short">{item.short}</p>
            {firstGroup ? <CharacteristicsTable title={firstGroup.title} rows={firstGroup.rows} /> : null}
          </div>
        </div>
        <div className={`order-description-row ${secondGroup ? "" : "order-description-row-single"}`}>
          <DescriptionScroll label={item.descriptionLabel || order.descriptionLabel} paragraphs={item.description} />
          {secondGroup ? <CharacteristicsTable title={secondGroup.title} rows={secondGroup.rows} /> : null}
        </div>
        {item.functionality?.items?.length ? (
          <FunctionalityGrid title={item.functionality.title} items={item.functionality.items} />
        ) : null}
        {item.notice ? <ItemNotice notice={item.notice} /> : null}
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
  // Opened from a "Замовити" button: that product goes on top. Opened from the header: no product is preselected.
  const mainItem = order.items.find((item) => item.id === requestedId);
  const others = useMemo(() => order.items.filter((item) => item.id !== mainItem?.id), [order.items, mainItem?.id]);
  const accessories = others.filter((item) => item.category !== PART_CATEGORY);
  const parts = others.filter((item) => item.category === PART_CATEGORY);

  // Quantities keyed by line: "<id>" or "<id>:<cableLength>" for items sold in several lengths.
  const [quantities, setQuantities] = useCart();
  const [restored] = useState(() => readAttempt(tabStorage()));
  const attemptRef = useRef(restored);
  const challengeRef = useRef(null);
  const submittingRef = useRef(false);
  const submittedIdRef = useRef(null);
  const [comment, setComment] = useState(restored?.payload.comment || "");
  const [consent, setConsent] = useState(restored?.payload.whatsappConsent ?? true);
  const [previewId, setPreviewId] = useState(null);
  const [contact, setContact] = useState({ name: restored?.payload.name || "", phone: restored?.payload.phone || DEFAULT_PHONE });
  const [status, setStatus] = useState("idle"); // idle | error | sending | done
  const [errors, setErrors] = useState({});
  const [snapshots,setSnapshots] = useState(()=>{try{return JSON.parse(tabStorage()?.getItem('dvision-cart-prices')||'{}')}catch{return {}}});
  const [changes,setChanges] = useState([]);
  const [pendingAdd,setPendingAdd] = useState(null);
  const [checking,setChecking] = useState(false);
  const [quantityRevision,setQuantityRevision]=useState(0);
  const checkingRef=useRef(false);
  const quantityChecks=useRef({});
  const [catalogError,setCatalogError] = useState('');
  useEffect(()=>{try{tabStorage()?.setItem('dvision-cart-prices',JSON.stringify(snapshots));}catch{}},[snapshots]);
  const [placedOrder, setPlacedOrder] = useState(null); // { orderNumber, phone } for the survey after the thank-you
  const successRef = useRef(null);

  useEffect(() => {
    if (mainItem) {
      const length=mainItem.cableLengths?.[0];
      const keys=mainItem.cableLengths?.map(x=>lineKey(mainItem,x)) || [lineKey(mainItem)];
      if(!keys.some(key=>quantities[key]>0)) void setLineQty(mainItem,length,1);
    }
    setErrors({});setPreviewId(null);setStatus('idle');
  }, [mainItem?.id]);

  useEffect(() => {
    if (status === "done") successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [status]);

  const previewItem = order.items.find((item) => item.id === previewId);
  const lineQty = (item, length) => quantities[lineKey(item, length)] || 0;
  const totalQty = (item) =>
    item.cableLengths?.length
      ? item.cableLengths.reduce((sum, length) => sum + lineQty(item, length), 0)
      : lineQty(item);
  const setLineQty = async (item,length,value) => {
    if(submittingRef.current)return;
    const key=lineKey(item,length),current=quantities[key]||0;
    const ticket=Symbol();quantityChecks.current[key]=ticket;
    if(value<=current){delete quantityChecks.current[key];checkingRef.current=Object.keys(quantityChecks.current).length>0;setChecking(checkingRef.current);setQuantities(q=>({...q,[key]:value}));return;}
    const line={id:item.id,name:item.name,...(length===undefined?{}:{cableLengthM:length}),unitPrice:snapshots[key]?.unitPrice ?? itemPrice(item,length)};
    checkingRef.current=true;setChecking(true);setCatalogError('');
    try{const next=await checkCart([line]);if(quantityChecks.current[key]!==ticket)return;if(next.length){setChanges(next);setPendingAdd({line,key,value});return;}
      setSnapshots(p=>({...p,[key]:line}));setQuantities(q=>({...q,[key]:value}));
    }catch{if(quantityChecks.current[key]!==ticket)return;setQuantityRevision(x=>x+1);setCatalogError(content.meta.lang==='uk'?'Не вдалося перевірити товар. Спробуйте ще раз.':'Unable to verify product. Please retry.');}
    finally{if(quantityChecks.current[key]===ticket)delete quantityChecks.current[key];checkingRef.current=Object.keys(quantityChecks.current).length>0;setChecking(checkingRef.current);}
  };
  const orderLines = Object.entries(quantities).filter(([,quantity])=>quantity>0).map(([key,quantity])=>{
    const [id,length]=key.split(':'),cableLengthM=length?Number(length):undefined;
    const item=order.items.find(x=>x.id===id);
    const prior=snapshots[key] || restored?.payload.items.find(x=>lineKey(x,x.cableLengthM)===key);
    return {id,name:item?.name||prior?.name||id,...(cableLengthM===undefined?{}:{cableLengthM}),quantity,unitPrice:prior?.unitPrice ?? (item?itemPrice(item,cableLengthM):0)};
  });
  const confirmChanges = async () => {
    if(checkingRef.current)return;checkingRef.current=true;setChecking(true);setCatalogError('');
    const proposed=(pendingAdd?[pendingAdd.line]:orderLines).filter(line=>!changes.some(c=>c.type==='unavailable'&&lineKey(c,c.cableLengthM)===lineKey(line,line.cableLengthM))).map(line=>{
      const change=changes.find(c=>lineKey(c,c.cableLengthM)===lineKey(line,line.cableLengthM));
      return change?.type==='price_changed'?{...line,unitPrice:change.priceMinor/100}:line;
    });
    try{
      const newer=proposed.length?await checkCart(proposed):[];
      if(newer.length){setChanges(newer);return;}
      setSnapshots(p=>({...p,...Object.fromEntries(proposed.map(l=>[lineKey(l,l.cableLengthM),l]))}));
      setQuantities(q=>{const next={...q};for(const c of changes)if(c.type==='unavailable')next[lineKey(c,c.cableLengthM)]=0;if(pendingAdd&&proposed.length)next[pendingAdd.key]=pendingAdd.value;return next;});
      setChanges([]);setPendingAdd(null);setStatus('idle');
    }catch{setCatalogError(content.meta.lang==='uk'?'Не вдалося перевірити кошик. Спробуйте ще раз.':'Unable to verify cart. Please retry.');}
    finally{checkingRef.current=false;setChecking(false);}
  };
  useEffect(()=>{setSnapshots(prior=>{const missing=orderLines.filter(l=>!prior[lineKey(l,l.cableLengthM)]);return missing.length?{...prior,...Object.fromEntries(missing.map(l=>[lineKey(l,l.cableLengthM),l]))}:prior;});},[order.items,quantities]);
  const total = orderLines.reduce((sum, line) => sum + line.quantity * Math.round(line.unitPrice * 100), 0) / 100;
  const formatMoney = (value) =>
    `${cart.moneyPrefix}${value.toLocaleString(content.meta.lang === "uk" ? "uk-UA" : "en-US")}${cart.moneySuffix}`;
  const renderPrice = (item) =>
    typeof item.price === "string" ? (
      <span className="cart-row-price">
        {order.priceLabel}: <strong>{formatMoney(snapshots[lineKey(item)]?.unitPrice ?? itemPrice(item))}</strong>
      </span>
    ) : null;
  const renderLengths = (item) => {
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
              <span className="cart-length-price">{formatMoney(snapshots[lineKey(item,length)]?.unitPrice ?? itemPrice(item,length))}</span>
              <div className="cart-length-qty">
                <span className="sr-only">{`${cart.quantityLabel}, ${length} ${cart.lengthUnit}`}</span>
                <QuantityInput
                  key={quantityRevision}
                  id={id}
                  label={`${cart.quantityLabel}, ${length} ${cart.lengthUnit}`}
                  value={qty}
                  min={0}
                  onChange={(value) => setLineQty(item, length, value)}
                />
                {qty > 0 ? <AddedBadge label={cart.addedLabel} iconOnly /> : <span className="cart-added-spacer" aria-hidden="true" />}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  const removeLine = (line) => {
    const key=lineKey(line,line.cableLengthM);delete quantityChecks.current[key];checkingRef.current=Object.keys(quantityChecks.current).length>0;setChecking(checkingRef.current);
    setQuantities(current=>({...current,[key]:0}));
  };
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
              reset={quantityRevision}
              id={`cart-qty-${item.id}`}
              label={cart.quantityLabel}
              value={qty}
              min={0}
              onChange={(value) => setLineQty(item, undefined, value)}
            />
            {qty > 0 ? <AddedBadge label={cart.addedLabel} /> : null}
          </div>
        )}
        {renderLengths(item)}
      </article>
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submittingRef.current || checkingRef.current || changes.length || !orderLines.length || !event.currentTarget.reportValidity()) return;
    const nextErrors = {
      name: !contact.name.trim(),
      phone: !isValidPhone(contact.phone),
    };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.phone) return;

    submittingRef.current = true;
    setStatus("sending");
    const data = { items: orderLines, total, name: contact.name.trim(), phone: contact.phone.trim(),
      comment: comment.trim(), whatsappConsent: consent, language: content.meta.lang };
    try {
      const attempt = orderAttempt(attemptRef.current, data);
      // A pending unchanged order may already be committed: replay its original ID
      // before current catalog checks. The CRM validates new attempts atomically.
      if(attempt !== attemptRef.current){
        const fresh = await checkCart(orderLines);
        if(fresh.length){setChanges(fresh);setPendingAdd(null);setStatus('idle');return;}
      }
      attemptRef.current = attempt;
      submittedIdRef.current = attempt.payload.clientOrderId;
      saveAttempt(tabStorage(), attempt);
      const payload = attempt.payload;
      const onSheets = (result) => {
        if (submittedIdRef.current === payload.clientOrderId)
          setPlacedOrder({ orderNumber: result.orderNumber, phone: payload.phone, clientOrderId: payload.clientOrderId });
      };
        await submitCheckout({ payload, submitSheets: submitOrder, onSheets,
          submitCrm: async () => {
            if (!TURNSTILE_SITEKEY || !challengeRef.current) throw new Error("verification_unavailable");
            const token = await challengeRef.current();
            return sendCrmOrder(ORDER_API_URL, payload, token);
          },
          report: (code, clientOrderId) => console.error("checkout", { code, clientOrderId }),
        });
      clearAttempt(tabStorage());
      attemptRef.current = null;
      try { if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", "purchase", {
          transaction_id: `order-${Date.now()}`,
          currency: "UAH",
          value: total,
          items: orderLines.map((line) => ({
            item_id: line.id,
            item_name: line.name,
            price: line.unitPrice,
            quantity: line.quantity,
          })),
        });
      }
      } catch { /* Analytics cannot turn a saved order into a failed checkout. */ }
      setQuantities({});
      setSnapshots({});
      setStatus("done");
    } catch (error) {
      if(error.code==='cart_changed'){setChanges(error.changes);setPendingAdd(null);setStatus('idle');}
      else setStatus("error");
    } finally { submittingRef.current = false; }
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
          {placedOrder ? <SourceSurvey survey={cart.survey} order={placedOrder} /> : null}
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

      {mainItem ? <section className="section cart-section">{renderRow(mainItem)}</section> : null}

      {accessories.length ? (
        <section className="section cart-section">
          <h2 className="cart-subtitle">{mainItem ? cart.accessoriesTitle : cart.productsTitle}</h2>
          <div className="cart-list">{accessories.map(renderRow)}</div>
        </section>
      ) : null}

      {parts.length ? (
        <section className="section cart-section">
          <h2 className="cart-subtitle">{cart.partsTitle}</h2>
          <div className="cart-list">{parts.map(renderRow)}</div>
        </section>
      ) : null}

      {(changes.length>0 || catalogError || checking) && <section className="section cart-section" aria-live="polite">
        {checking&&<p>{content.meta.lang==='uk'?'Перевіряємо актуальну ціну та доступність…':'Checking price and availability…'}</p>}
        {catalogError&&<p role="alert" className="cart-error">{catalogError}</p>}
        {changes.length>0&&<div role="alert" className="cart-total">
          {changes.map(c=>{const key=lineKey(c,c.cableLengthM),line=pendingAdd?.key===key?pendingAdd.line:orderLines.find(l=>lineKey(l,l.cableLengthM)===key);const name=line?.name||order.items.find(i=>i.id===c.id)?.name||c.id;
            return <p key={key}>{c.type==='unavailable' ? (content.meta.lang==='uk'?`Товар «${name}» більше недоступний для замовлення. Оберіть інший товар.`:`“${name}” is no longer available. Please choose another product.`) : (content.meta.lang==='uk'?`Ціна «${name}» змінилася з ${formatMoney(line?.unitPrice||0)} на ${formatMoney(c.priceMinor/100)}.`:`The price of “${name}” changed from ${formatMoney(line?.unitPrice||0)} to ${formatMoney(c.priceMinor/100)}.`)}</p>;})}
          <button type="button" className="btn btn-primary" disabled={checking} onClick={confirmChanges}>{content.meta.lang==='uk'?(changes.some(c=>c.type==='unavailable')?'Прибрати недоступне та підтвердити зміни':'Підтвердити нову ціну'):'Confirm cart changes'}</button>
          {pendingAdd&&<button type="button" className="btn btn-secondary" onClick={()=>{setChanges([]);setPendingAdd(null);setQuantityRevision(x=>x+1);}}>{content.meta.lang==='uk'?'Скасувати':'Cancel'}</button>}
        </div>}
      </section>}
      <section className="section cart-section cart-total-section">
        <div className="cart-total">
          <h2 className="cart-subtitle">{cart.totalTitle}</h2>
          {orderLines.length ? (
            <ul className="cart-total-lines">
              {orderLines.map((line) => {
                const label = `${line.name}${line.cableLengthM ? `, ${line.cableLengthM} ${cart.lengthUnit}` : ""}`;
                // Models are listed in the same order as cableLengths.
                const item = order.items.find((candidate) => candidate.id === line.id);
                const model = item?.model?.split(", ")[line.cableLengthM ? item.cableLengths.indexOf(line.cableLengthM) : 0];
                return (
                  <li key={`${line.id}-${line.cableLengthM || ""}`}>
                    <span className="cart-total-name">
                      {label} × {line.quantity}
                      {model ? <span className="cart-total-model">{model}</span> : null}
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
        <form id="checkout-form" className="cart-submit" onSubmit={handleSubmit} noValidate>
          <h2 className="cart-subtitle">
            {cart.commentTitle} <span className="cart-optional">{cart.optionalLabel}</span>
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
                maxLength={200}
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
          {ORDER_API_URL && TURNSTILE_SITEKEY ? <CheckoutChallenge sitekey={TURNSTILE_SITEKEY} challengeRef={challengeRef} /> : null}
          <button type="submit" className="btn btn-primary cart-submit-btn" disabled={status === "sending" || checking || changes.length > 0 || !orderLines.length}>
            <span>{status === "sending" ? cart.sending : cart.submit}</span>
          </button>
        </form>
      </section>

      {previewItem ? <ProductPreview item={previewItem} order={order} cart={cart} onClose={() => setPreviewId(null)} /> : null}

      <FinalCTA content={content} />
    </main>
  );
}
