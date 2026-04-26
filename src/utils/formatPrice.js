export const formatPrice = (price) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    currencyDisplay: "code",
    maximumFractionDigits: 0,
  }).format(price);
};
