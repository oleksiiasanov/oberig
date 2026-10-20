// Prices as the cart computes them, also published as /catalog.json for the OMS order intake.
export const parsePrice = (value) => Number(String(value).replace(/\D/g, "")) || 0;

// One entry per sellable line: plain items, or one per cable length (prices are listed in the same order).
export function buildCatalog(items) {
  return {
    version: 1,
    currency: "UAH",
    items: items.flatMap((item) =>
      item.cableLengths?.length
        ? item.cableLengths.map((cableLengthM, index) => ({
            id: item.id,
            cableLengthM,
            price: parsePrice(item.price?.[index]?.[1]),
          }))
        : [{ id: item.id, price: parsePrice(item.price) }]
    ),
  };
}
