import { filterMedications } from "./search.js";

const APP_VERSION = "0.1.0";
const DATA_URL = "../data/medications-historical.v0.1.0.json";
const DATA_CACHE_KEY = "mediguide:medications-historical:v0.1.0";

const elements = {
  input: document.querySelector("#search-input"),
  clear: document.querySelector("#clear-search"),
  results: document.querySelector("#results"),
  resultCount: document.querySelector("#result-count"),
  searchMeta: document.querySelector("#search-meta"),
  datasetVersion: document.querySelector("#dataset-version"),
  footerDataVersion: document.querySelector("#footer-data-version"),
  details: document.querySelector("#details"),
  closeDetails: document.querySelector("#close-details"),
  detailsTitle: document.querySelector("#details-title"),
  detailsTrade: document.querySelector("#details-trade"),
  detailsStatus: document.querySelector("#details-status"),
  detailsStrength: document.querySelector("#details-strength"),
  detailsPreparation: document.querySelector("#details-preparation"),
  detailsConcentration: document.querySelector("#details-concentration"),
  detailsInfusion: document.querySelector("#details-infusion"),
  detailsStability: document.querySelector("#details-stability"),
  detailsWarning: document.querySelector("#details-warning"),
  detailsCategory: document.querySelector("#details-category"),
  detailsSourceVersion: document.querySelector("#details-source-version"),
  detailsSourcePage: document.querySelector("#details-source-page"),
  detailsDataVersion: document.querySelector("#details-data-version"),
};

let dataset = null;
let entries = [];

function displayValue(value) {
  return value === null || value === undefined || value === "" ? "Nicht dokumentiert" : String(value);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function sourcePageLabel(entry) {
  return entry.sourcePage ? `Seite ${escapeHtml(entry.sourcePage)}` : "Seite nicht dokumentiert";
}

function renderResults(query = "") {
  const filtered = filterMedications(entries, query);
  elements.resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "Treffer" : "Treffer"}`;
  elements.searchMeta.textContent = query
    ? `${filtered.length} Treffer für „${query}“`
    : `${entries.length} Einträge verfügbar · Suche nach Wirkstoff, Handelsname, Stärke oder Kategorie`;
  elements.clear.hidden = !query;

  if (!filtered.length) {
    elements.results.innerHTML = `
      <div class="empty-state">
        <strong>Keine Treffer</strong>
        <span>Bitte Suchbegriff prüfen. Es werden keine neuen medizinischen Begriffe erzeugt.</span>
      </div>`;
    return;
  }

  elements.results.innerHTML = filtered
    .map(
      (entry) => `
        <button class="result-card" type="button" data-entry-id="${escapeHtml(entry.id)}">
          <span class="result-card-top">
            <span>
              <strong>${escapeHtml(entry.activeIngredient)}</strong>
              <small>${escapeHtml(displayValue(entry.tradeName))}</small>
            </span>
            <span class="status-pill">Historisch</span>
          </span>
          <span class="result-card-meta">
            <span>${escapeHtml(displayValue(entry.strengthForm))}</span>
            <span>${escapeHtml(displayValue(entry.category))}</span>
          </span>
          <span class="result-card-source">UKW · ${sourcePageLabel(entry)} · ${escapeHtml(entry.sourceVersion)}</span>
        </button>`
    )
    .join("");
}

function setDetailValue(element, value) {
  element.textContent = displayValue(value);
}

function openDetails(entry) {
  elements.details.hidden = false;
  elements.detailsTitle.textContent = displayValue(entry.activeIngredient);
  elements.detailsTrade.textContent = entry.tradeName ? entry.tradeName : "";
  elements.detailsStatus.textContent = displayValue(entry.reviewStatus);
  setDetailValue(elements.detailsStrength, entry.strengthForm);
  setDetailValue(elements.detailsPreparation, entry.preparationText);
  setDetailValue(elements.detailsConcentration, entry.finalConcentration);
  setDetailValue(elements.detailsInfusion, entry.infusionDurationOrRate);
  setDetailValue(elements.detailsStability, entry.stabilityText);
  setDetailValue(elements.detailsWarning, entry.warningText);
  setDetailValue(elements.detailsCategory, entry.category);
  setDetailValue(elements.detailsSourceVersion, entry.sourceVersion);
  setDetailValue(elements.detailsSourcePage, entry.sourcePage ? `Seite ${entry.sourcePage}` : null);
  setDetailValue(elements.detailsDataVersion, dataset.dataVersion);
  elements.details.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeDetails() {
  elements.details.hidden = true;
}

function setDatasetStatus(source) {
  const version = dataset?.dataVersion ?? "0.1.0-historisch";
  elements.datasetVersion.textContent = version;
  elements.footerDataVersion.textContent = version;
  elements.searchMeta.dataset.source = source;
}

async function loadDataset() {
  try {
    const response = await fetch(DATA_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const fresh = await response.json();
    localStorage.setItem(DATA_CACHE_KEY, JSON.stringify(fresh));
    return { data: fresh, source: "Quelldatei" };
  } catch (error) {
    const cached = localStorage.getItem(DATA_CACHE_KEY);
    if (!cached) throw error;
    return { data: JSON.parse(cached), source: "lokaler Offline-Speicher" };
  }
}

async function start() {
  document.querySelector("#app-version").textContent = APP_VERSION;
  try {
    const loaded = await loadDataset();
    dataset = loaded.data;
    entries = Array.isArray(dataset.entries) ? dataset.entries : [];
    setDatasetStatus(loaded.source);
    renderResults();
    elements.searchMeta.textContent += loaded.source === "lokaler Offline-Speicher" ? " · offline verfügbar" : "";
  } catch (error) {
    elements.datasetVersion.textContent = "nicht verfügbar";
    elements.searchMeta.textContent = "Datenbasis konnte nicht geladen werden.";
    elements.results.innerHTML = `<div class="empty-state"><strong>Keine Datenbasis geladen</strong><span>${escapeHtml(error.message)}</span></div>`;
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("../service-worker.js", { scope: "../" }).catch(() => {});
  }
}

elements.input.addEventListener("input", (event) => renderResults(event.target.value));
elements.clear.addEventListener("click", () => {
  elements.input.value = "";
  renderResults();
  elements.input.focus();
});
elements.closeDetails.addEventListener("click", closeDetails);
elements.results.addEventListener("click", (event) => {
  const card = event.target.closest("[data-entry-id]");
  if (!card) return;
  const entry = entries.find((item) => item.id === card.dataset.entryId);
  if (entry) openDetails(entry);
});

start();
