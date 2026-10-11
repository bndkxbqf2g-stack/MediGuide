export function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("de-DE")
    .trim();
}

export function searchableText(entry) {
  return [
    entry.activeIngredient,
    entry.tradeName,
    entry.strengthForm,
    entry.category,
    ...(Array.isArray(entry.searchTerms) ? entry.searchTerms : []),
  ]
    .filter(Boolean)
    .map(normalizeText)
    .join(" ");
}

export function filterMedications(entries, query) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return [...entries];

  return entries.filter((entry) => searchableText(entry).includes(normalizedQuery));
}
