export const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

export const MAGNET_PACKS = [
  { size: 6, price: 9900 },
  { size: 9, price: 13500 },
  { size: 12, price: 16900 },
];
