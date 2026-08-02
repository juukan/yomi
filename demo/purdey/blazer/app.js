const state = {
  size: null,
  available: true,
  bagCount: 0,
};

const mainImage = document.querySelector("#main-image");
const galleryStage = document.querySelector(".gallery-stage");
const counter = document.querySelector("#image-counter");
const stockPanel = document.querySelector("#stock-panel");
const visitPanel = document.querySelector("#visit-panel");
const addProduct = document.querySelector("#add-product");
const checkStock = document.querySelector("#check-stock");
const sizePicker = document.querySelector(".size-picker");
const sizeMessage = document.querySelector("#size-message");
const availabilityPanel = document.querySelector("#availability-panel");
const restockForm = document.querySelector("#restock-form");
const restockEmail = document.querySelector("#restock-email");
const restockMessage = document.querySelector("#restock-message");
const toast = document.querySelector("#toast");
const toastMessage = document.querySelector("#toast-message");

function showToast(message) {
  toastMessage.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.hidden = true;
  }, 4200);
}

function updateBag(amount) {
  state.bagCount += amount;
  document.querySelector("#bag-count").textContent = state.bagCount;
}

function requireSize() {
  if (state.size) return true;
  sizePicker.classList.add("is-invalid");
  sizeMessage.textContent = "Kies eerst uw maat. Daarna kunt u online bestellen of de winkelvoorraad bekijken.";
  document.querySelector(".size-options button")?.focus();
  return false;
}

document.querySelectorAll(".thumb").forEach((button) => {
  button.addEventListener("click", () => {
    galleryStage.classList.add("is-changing");
    window.setTimeout(() => {
      mainImage.src = button.dataset.src;
      mainImage.alt = button.dataset.alt;
      counter.textContent = `${button.dataset.index} / 4`;
      document.querySelectorAll(".thumb").forEach((thumb) => {
        const active = thumb === button;
        thumb.classList.toggle("is-active", active);
        thumb.setAttribute("aria-pressed", String(active));
      });
      galleryStage.classList.remove("is-changing");
    }, 140);
  });
});

document.querySelectorAll(".size-options button").forEach((button) => {
  button.addEventListener("click", () => {
    state.size = button.dataset.size;
    state.available = button.dataset.available !== "false";
    sizePicker.classList.remove("is-invalid");
    document.querySelectorAll(".size-options button").forEach((sizeButton) => {
      sizeButton.classList.toggle("is-selected", sizeButton === button);
      sizeButton.setAttribute("aria-pressed", String(sizeButton === button));
    });
    document.querySelector("#stock-size").textContent = state.size;
    document.querySelector("#visit-size").textContent = state.size;
    document.querySelector("#availability-size").textContent = state.size;
    document.querySelector("#unavailable-stock-size").textContent = state.size;

    if (state.available) {
      availabilityPanel.hidden = true;
      addProduct.textContent = "Voeg toe aan winkelmand";
      sizeMessage.textContent = `Maat ${state.size} gekozen. Kies online bestellen of bekijken waar u deze maat kunt passen.`;
    } else {
      availabilityPanel.hidden = false;
      addProduct.textContent = "Mail mij bij nieuwe voorraad";
      stockPanel.hidden = true;
      visitPanel.hidden = true;
      sizeMessage.textContent = `Demo: maat ${state.size} is online tijdelijk niet beschikbaar. Kies een voorraadmail, winkelvoorraad of alternatief.`;
    }

    if (!stockPanel.hidden) {
      stockPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
});

addProduct.addEventListener("click", () => {
  if (!requireSize()) return;
  if (!state.available) {
    availabilityPanel.hidden = false;
    restockEmail.focus();
    return;
  }
  updateBag(1);
  showToast(`Iris Blazer Camel, maat ${state.size}, is in deze demo toegevoegd.`);
});

checkStock.addEventListener("click", () => {
  if (!requireSize()) return;
  stockPanel.hidden = false;
  visitPanel.hidden = true;
  stockPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

restockForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!restockEmail.checkValidity()) {
    restockEmail.setAttribute("aria-invalid", "true");
    restockMessage.classList.add("is-error");
    restockMessage.textContent = "Vul een geldig e-mailadres in om een voorraadmelding te simuleren.";
    restockEmail.focus();
    return;
  }
  restockEmail.removeAttribute("aria-invalid");
  restockMessage.classList.remove("is-error");
  restockMessage.textContent = `Demo bevestigd: in productie ontvangt u één bericht zodra maat ${state.size} terug is. Dit adres is niet opgeslagen.`;
  showToast(`Voorraadmelding voor maat ${state.size} gesimuleerd — er is geen e-mailadres opgeslagen.`);
});

restockEmail.addEventListener("input", () => {
  restockEmail.removeAttribute("aria-invalid");
  restockMessage.classList.remove("is-error");
  restockMessage.textContent = "Conceptdemo: het e-mailadres wordt niet opgeslagen of verzonden.";
});

document.querySelector("#check-unavailable-stock").addEventListener("click", () => {
  checkStock.click();
});

document.querySelector("#close-stock").addEventListener("click", () => {
  stockPanel.hidden = true;
  checkStock.focus();
});

document.querySelector("#location-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const term = document.querySelector("#postcode").value.trim();
  if (!term) {
    showToast("Vul een postcode of plaats in om winkels te tonen.");
    return;
  }
  showToast(`Voorbeeldwinkels getoond voor “${term}”. Voorraad blijft demo-data.`);
});

document.querySelectorAll(".visit-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector("#visit-store").textContent = button.dataset.store;
    visitPanel.hidden = false;
    visitPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});

function updateLookTotal() {
  const selected = [...document.querySelectorAll(".look-item")].filter((item) => item.querySelector("input").checked);
  const total = selected.reduce((sum, item) => sum + Number(item.dataset.price), 0);
  document.querySelector("#selected-count").textContent = `${selected.length} ${selected.length === 1 ? "item" : "items"}`;
  document.querySelector("#look-total").textContent = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(total);
  document.querySelector("#add-look").disabled = selected.length === 0;
}

document.querySelectorAll(".look-item input[type='checkbox']").forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    checkbox.closest(".look-item").classList.toggle("is-off", !checkbox.checked);
    updateLookTotal();
  });
});

document.querySelector("#add-look").addEventListener("click", () => {
  const selected = [...document.querySelectorAll(".look-item")].filter((item) => item.querySelector("input").checked);
  updateBag(selected.length);
  showToast(`${selected.length} items uit de look zijn in deze demo toegevoegd.`);
});

document.querySelector("#look-stock").addEventListener("click", () => {
  document.querySelector("#look-note").textContent = "Demo: Iris maat 38 is in Oisterwijk beschikbaar; top M en jeans 38 vragen een gezamenlijke voorraadcheck vóór vertrek.";
  showToast("Voorraadcheck voor drie gekozen items voorbereid — demo-data, geen reservering.");
});

document.querySelector("#close-toast").addEventListener("click", () => {
  toast.hidden = true;
});
