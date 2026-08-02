const storeRows = Array.from(document.querySelectorAll("[data-store-row]"));
const searchForm = document.querySelector("[data-store-search]");
const searchInput = document.querySelector("[data-store-input]");
const resultCount = document.querySelector("[data-result-count]");
const emptyState = document.querySelector("[data-empty-state]");

const normalize = (value) =>
  value
    .toLocaleLowerCase("nl-NL")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const filterStores = (rawQuery) => {
  const query = normalize(rawQuery);
  let visible = 0;

  storeRows.forEach((row) => {
    const match = normalize(row.dataset.search || "").includes(query);
    row.hidden = !match;
    if (match) visible += 1;
  });

  if (resultCount) {
    resultCount.textContent = query
      ? `${visible} uitgewerkte winkel${visible === 1 ? "" : "s"} gevonden voor ‘${rawQuery.trim()}’.`
      : "Twee pilotlocaties met een eigen Purdey-beeld en directe bezoekinformatie.";
  }

  if (emptyState) emptyState.hidden = visible !== 0;
};

searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  filterStores(searchInput?.value || "");
  document.querySelector("#winkels")?.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelectorAll("[data-event]").forEach((element) => {
  element.addEventListener("click", () => {
    const detail = {
      event: element.dataset.event,
      store: element.dataset.store || "oisterwijk",
      label: element.textContent.trim(),
    };
    window.dispatchEvent(new CustomEvent("purdey:soft-conversion", { detail }));
    console.info("[Purdey demo event]", detail);
  });
});

const statusNode = document.querySelector("[data-open-status]");

if (statusNode) {
  const now = new Date();
  const day = now.getDay();
  const date = now.getDate();
  const firstSunday = day === 0 && date <= 7;
  const schedule = {
    1: [12, 18],
    2: [10, 18],
    3: [10, 18],
    4: [10, 18],
    5: [10, 18],
    6: [10, 17],
  };

  if (firstSunday) schedule[0] = [12, 17];

  const hours = schedule[day];
  if (!hours) {
    statusNode.textContent = "Vandaag gesloten · bekijk openingstijden";
  } else {
    const current = now.getHours() + now.getMinutes() / 60;
    const isOpen = current >= hours[0] && current < hours[1];
    statusNode.textContent = `${isOpen ? "Nu open" : "Vandaag open"} · ${String(hours[0]).padStart(2, "0")}:00–${String(hours[1]).padStart(2, "0")}:00`;
  }
}
