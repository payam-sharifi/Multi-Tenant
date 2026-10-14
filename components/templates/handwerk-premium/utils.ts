export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function monthlyRate(amount: number, years: number, annualPercent: number) {
  if (!amount || !years) return 0;
  const months = years * 12;
  const r = annualPercent / 100 / 12;
  if (r === 0) return amount / months;
  return (amount * r * (1 + r) ** months) / ((1 + r) ** months - 1);
}

export function googleMapsEmbed(query: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;
}

export function googleMapsSearch(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function euro(value: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}
