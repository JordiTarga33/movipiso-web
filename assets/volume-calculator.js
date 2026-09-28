/* Movipiso: inventario de volumen. Los tamaños iniciales son ejemplos orientativos. */
(() => {
  "use strict";

  const PHONE = "34633881774";
  const MAX_QUANTITY = 1000;
  const MAX_DIMENSION_CM = 2000;
  const MAX_CUSTOM_ITEMS = 50;
  const volumeFormat = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
  const dimensionFormat = new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: 1,
  });

  // Largo, ancho y alto aproximados en centímetros; el usuario puede editarlos.
  const categories = [
    {
      id: "salon",
      label: "Salón y comedor",
      items: [
        ["Sofá de dos plazas", 170, 90, 85],
        ["Sillón", 85, 85, 95],
        ["Mesa de comedor", 160, 90, 75],
        ["Silla de comedor", 45, 50, 90],
        ["Estantería", 80, 30, 180],
      ],
    },
    {
      id: "dormitorio",
      label: "Dormitorio",
      items: [
        ["Base de cama doble", 200, 160, 35],
        ["Colchón doble", 200, 160, 25],
        ["Armario", 120, 60, 200],
        ["Mesita de noche", 45, 40, 55],
      ],
    },
    {
      id: "cocina",
      label: "Cocina y electrodomésticos",
      items: [
        ["Frigorífico", 60, 65, 185],
        ["Lavadora", 60, 60, 85],
        ["Microondas", 50, 40, 30],
      ],
    },
    {
      id: "trabajo",
      label: "Trabajo y ocio",
      items: [
        ["Escritorio", 120, 60, 75],
        ["Silla de escritorio", 60, 60, 110],
        ["Bicicleta", 170, 60, 100],
      ],
    },
    {
      id: "cajas",
      label: "Cajas y otros",
      items: [
        ["Caja mediana", 45, 35, 35],
        ["Caja grande", 60, 40, 40],
        ["Maleta", 75, 50, 30],
        ["Planta grande", 50, 50, 100],
      ],
    },
  ];

  function make(tag, className, textValue) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (textValue !== undefined) node.textContent = textValue;
    return node;
  }

  function sanitizeName(value) {
    return value.replace(/\s+/g, " ").trim().slice(0, 80);
  }

  function readNumber(input, kind) {
    const raw = input.value.trim();
    const number = raw === "" ? NaN : Number(raw);
    if (!Number.isFinite(number)) return null;
    if (kind === "quantity") {
      return Number.isInteger(number) && number >= 0 && number <= MAX_QUANTITY
        ? number
        : null;
    }
    return number > 0 && number <= MAX_DIMENSION_CM ? number : null;
  }

  function field(labelText, value, kind, itemName) {
    const label = make("label", "mc-field");
    const text = make("span", "mc-field-label", labelText);
    const input = make("input", "mc-input");
    input.type = "number";
    input.inputMode = kind === "quantity" ? "numeric" : "decimal";
    input.min = kind === "quantity" ? "0" : "0.1";
    input.max = String(kind === "quantity" ? MAX_QUANTITY : MAX_DIMENSION_CM);
    input.step = kind === "quantity" ? "1" : "any";
    input.value = String(value);
    input.setAttribute("aria-label", `${labelText} de ${itemName}`);
    label.append(text, input);
    return { label, input };
  }

  function createItemRow(item, onUpdate, onRemove) {
    const row = make("div", "mc-row");
    const heading = make("div", "mc-row-heading");
    heading.append(
      make("strong", "mc-item-name", item.name),
      make(
        "small",
        "mc-item-note",
        item.custom ? "Medidas introducidas por ti" : "Medidas orientativas: puedes editarlas"
      )
    );
    const controls = make("div", "mc-row-fields");
    const quantity = field("Unidades", item.quantity, "quantity", item.name);
    const length = field("Largo (cm)", item.length, "dimension", item.name);
    const width = field("Ancho (cm)", item.width, "dimension", item.name);
    const height = field("Alto (cm)", item.height, "dimension", item.name);
    controls.append(quantity.label, length.label, width.label, height.label);
    const subtotal = make("output", "mc-subtotal", "0,000 m³");
    subtotal.setAttribute("aria-label", `Volumen de ${item.name}`);
    const error = make("p", "mc-row-error");
    error.setAttribute("aria-live", "polite");

    item.inputs = {
      quantity: quantity.input,
      length: length.input,
      width: width.input,
      height: height.input,
    };
    item.subtotal = subtotal;
    item.error = error;
    item.row = row;
    Object.values(item.inputs).forEach((input) => {
      input.addEventListener("input", onUpdate);
      input.addEventListener("change", onUpdate);
    });

    row.append(heading, controls, subtotal, error);
    if (item.custom) {
      const remove = make("button", "mc-remove", "Quitar objeto");
      remove.type = "button";
      remove.setAttribute("aria-label", `Quitar ${item.name}`);
      remove.addEventListener("click", () => onRemove(item));
      row.append(remove);
    }
    return row;
  }

  function initCalculator(mount, mountIndex) {
    if (mount.dataset.mcReady === "true") return;
    mount.dataset.mcReady = "true";
    const items = [];
    const panels = new Map();
    const tabButtons = new Map();
    const app = make("div", "mc-app");
    const notice = make(
      "p",
      "mc-notice",
      "Las medidas iniciales son ejemplos orientativos en cm. Edítalas con las medidas de tus objetos. El resultado suma su volumen geométrico: no incluye huecos de carga, peso ni precio."
    );
    const categoryNav = make("nav", "mc-categories");
    categoryNav.setAttribute("aria-label", "Categorías del inventario");
    const panelContainer = make("div", "mc-panels");

    function showCategory(categoryId) {
      for (const [id, panel] of panels) panel.hidden = id !== categoryId;
      for (const [id, button] of tabButtons) {
        button.setAttribute("aria-pressed", String(id === categoryId));
      }
    }

    for (const category of categories) {
      const panelId = `mc-${mountIndex}-${category.id}`;
      const button = make("button", "mc-category", category.label);
      button.type = "button";
      button.setAttribute("aria-controls", panelId);
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => showCategory(category.id));
      categoryNav.append(button);
      tabButtons.set(category.id, button);

      const panel = make("section", "mc-panel");
      panel.id = panelId;
      panel.append(make("h3", "mc-panel-title", category.label));
      const list = make("div", "mc-rows");
      panel.append(list);
      panelContainer.append(panel);
      panels.set(category.id, panel);
      category.items.forEach(([name, length, width, height], index) => {
        const item = {
          id: `${category.id}-${index}`,
          categoryId: category.id,
          name,
          length,
          width,
          height,
          quantity: 0,
          custom: false,
        };
        items.push(item);
        list.append(createItemRow(item, update, removeItem));
      });
    }

    const customSection = make("section", "mc-custom");
    customSection.append(make("h3", "mc-custom-title", "Añadir un objeto propio"));
    const customForm = make("form", "mc-custom-form");
    customForm.noValidate = true;
    const customNameLabel = make("label", "mc-field");
    const customName = make("input", "mc-input");
    customName.type = "text";
    customName.maxLength = 80;
    customName.required = true;
    customNameLabel.append(make("span", "mc-field-label", "Nombre del objeto"), customName);
    const customCategoryLabel = make("label", "mc-field");
    const customCategory = make("select", "mc-input");
    categories.forEach((category) => {
      const option = make("option", "", category.label);
      option.value = category.id;
      customCategory.append(option);
    });
    customCategoryLabel.append(
      make("span", "mc-field-label", "Categoría"),
      customCategory
    );
    const customLength = field("Largo (cm)", "", "dimension", "objeto propio");
    const customWidth = field("Ancho (cm)", "", "dimension", "objeto propio");
    const customHeight = field("Alto (cm)", "", "dimension", "objeto propio");
    const customQuantity = field("Unidades", 1, "quantity", "objeto propio");
    const addButton = make("button", "mc-add", "Añadir al inventario");
    addButton.type = "submit";
    const customError = make("p", "mc-custom-error");
    customError.setAttribute("role", "alert");
    customForm.append(
      customNameLabel,
      customCategoryLabel,
      customQuantity.label,
      customLength.label,
      customWidth.label,
      customHeight.label,
      addButton,
      customError
    );
    customSection.append(customForm);

    const results = make("section", "mc-results");
    results.append(make("h3", "mc-results-title", "Tu inventario"));
    const total = make("output", "mc-total", "0,000 m³");
    total.setAttribute("aria-label", "Volumen total estimado");
    total.setAttribute("aria-live", "polite");
    const count = make("p", "mc-count", "0 objetos seleccionados");
    const resultError = make("p", "mc-result-error");
    resultError.setAttribute("role", "status");
    const selectedList = make("ul", "mc-selected-list");
    const actions = make("div", "mc-actions");
    const downloadButton = make("button", "mc-download", "Descargar inventario .txt");
    const whatsappButton = make("button", "mc-whatsapp", "Enviar inventario por WhatsApp");
    const resetButton = make("button", "mc-reset", "Vaciar inventario");
    [downloadButton, whatsappButton, resetButton].forEach((button) => {
      button.type = "button";
      actions.append(button);
    });
    results.append(total, count, resultError, selectedList, actions);
    app.append(notice, categoryNav, panelContainer, customSection, results);
    mount.append(app);
    showCategory(categories[0].id);

    let currentSelection = [];
    let currentTotal = 0;
    let hasInvalidFields = false;

    function inspectItem(item) {
      const quantity = readNumber(item.inputs.quantity, "quantity");
      const quantityInvalid = quantity === null;
      item.inputs.quantity.setAttribute("aria-invalid", String(quantityInvalid));
      item.inputs.quantity.setCustomValidity(
        quantityInvalid ? `Usa un número entero entre 0 y ${MAX_QUANTITY}.` : ""
      );

      // Una fila sin unidades no participa en el cálculo. Sus medidas pueden
      // quedar incompletas mientras se prepara el inventario.
      if (quantity === 0) {
        for (const input of [item.inputs.length, item.inputs.width, item.inputs.height]) {
          input.setAttribute("aria-invalid", "false");
          input.setCustomValidity("");
        }
        item.error.textContent = "";
        item.subtotal.textContent = "0,000 m³";
        return { item, quantity: 0, volume: 0 };
      }

      const values = { quantity };
      let invalid = quantityInvalid;
      for (const [key, input] of Object.entries(item.inputs)) {
        if (key === "quantity") continue;
        const value = readNumber(input, key);
        values[key] = value;
        const fieldInvalid = value === null;
        input.setAttribute("aria-invalid", String(fieldInvalid));
        input.setCustomValidity(
          fieldInvalid
            ? `Usa una medida mayor que 0 y no superior a ${MAX_DIMENSION_CM} cm.`
            : ""
        );
        if (fieldInvalid) invalid = true;
      }
      item.error.textContent = invalid
        ? "Revisa unidades y medidas: deben estar dentro de los límites indicados."
        : "";
      if (invalid) {
        item.subtotal.textContent = "—";
        return null;
      }
      const volume =
        (values.quantity * values.length * values.width * values.height) / 1000000;
      item.subtotal.textContent = `${volumeFormat.format(volume)} m³`;
      return { item, ...values, volume };
    }

    function update() {
      const selected = [];
      let sum = 0;
      const invalidNames = [];
      for (const item of items) {
        const result = inspectItem(item);
        if (!result) {
          const category = categories.find((entry) => entry.id === item.categoryId);
          invalidNames.push(`${item.name} (${category.label})`);
          continue;
        }
        if (result.quantity > 0) {
          selected.push(result);
          sum += result.volume;
        }
      }
      const invalid = invalidNames.length > 0;
      hasInvalidFields = invalid;
      currentSelection = invalid ? [] : selected;
      currentTotal = invalid ? 0 : sum;
      total.textContent = invalid ? "—" : `${volumeFormat.format(sum)} m³`;
      count.textContent = invalid
        ? "Corrige los campos marcados para ver el total."
        : `${selected.length} ${selected.length === 1 ? "tipo de objeto seleccionado" : "tipos de objetos seleccionados"}`;
      resultError.textContent = invalid
        ? `Revisa las medidas o unidades de: ${invalidNames.join(", ")}.`
        : "";
      selectedList.replaceChildren();
      if (!invalid) {
        for (const entry of selected) {
          const line = make("li", "mc-selected-item");
          line.append(
            make("span", "mc-selected-name", `${entry.quantity} × ${entry.item.name}`),
            make("span", "mc-selected-volume", `${volumeFormat.format(entry.volume)} m³`)
          );
          selectedList.append(line);
        }
      }
      downloadButton.disabled = invalid || selected.length === 0;
      whatsappButton.disabled = invalid || selected.length === 0;
      resetButton.disabled = !items.some(
        (item) =>
          item.custom ||
          item.inputs.quantity.value !== "0" ||
          item.inputs.length.value !== String(item.length) ||
          item.inputs.width.value !== String(item.width) ||
          item.inputs.height.value !== String(item.height)
      );
    }

    function removeItem(item) {
      const index = items.indexOf(item);
      if (index < 0) return;
      items.splice(index, 1);
      item.row.remove();
      update();
      customName.focus();
    }

    customForm.addEventListener("submit", (event) => {
      event.preventDefault();
      customError.textContent = "";
      const name = sanitizeName(customName.value);
      const quantity = readNumber(customQuantity.input, "quantity");
      const length = readNumber(customLength.input, "dimension");
      const width = readNumber(customWidth.input, "dimension");
      const height = readNumber(customHeight.input, "dimension");
      const customCount = items.filter((item) => item.custom).length;
      if (customCount >= MAX_CUSTOM_ITEMS) {
        customError.textContent = `Puedes añadir hasta ${MAX_CUSTOM_ITEMS} objetos propios.`;
        return;
      }
      if (!name) {
        customError.textContent = "Escribe el nombre del objeto.";
        customName.focus();
        return;
      }
      const invalidInput = [
        [customQuantity.input, quantity],
        [customLength.input, length],
        [customWidth.input, width],
        [customHeight.input, height],
      ].find(([, value]) => value === null);
      if (invalidInput) {
        customError.textContent = `Usa unidades enteras de 0 a ${MAX_QUANTITY} y medidas mayores que 0 hasta ${MAX_DIMENSION_CM} cm.`;
        invalidInput[0].focus();
        return;
      }
      const categoryId = categories.some((category) => category.id === customCategory.value)
        ? customCategory.value
        : categories[0].id;
      const item = {
        id: `custom-${Date.now()}-${customCount}`,
        categoryId,
        name,
        quantity,
        length,
        width,
        height,
        custom: true,
      };
      items.push(item);
      panels.get(categoryId).querySelector(".mc-rows").append(
        createItemRow(item, update, removeItem)
      );
      showCategory(categoryId);
      customForm.reset();
      customQuantity.input.value = "1";
      update();
      item.inputs.quantity.focus();
    });

    function inventoryText() {
      const lines = [
        "MOVIPISO · INVENTARIO DE VOLUMEN",
        `Volumen geométrico estimado: ${volumeFormat.format(currentTotal)} m³`,
        "Medidas orientativas o introducidas por el usuario; confirmar con fotos o vídeo.",
        "",
        "Objetos:",
      ];
      for (const entry of currentSelection) {
        lines.push(
          `${entry.quantity} × ${entry.item.name} — ${dimensionFormat.format(entry.length)} × ${dimensionFormat.format(entry.width)} × ${dimensionFormat.format(entry.height)} cm — ${volumeFormat.format(entry.volume)} m³`
        );
      }
      lines.push("", "Este cálculo no es un presupuesto ni garantiza capacidad de carga.");
      return lines.join("\n");
    }

    downloadButton.addEventListener("click", () => {
      if (hasInvalidFields || currentSelection.length === 0) return;
      const blob = new Blob(["\uFEFF", inventoryText()], {
        type: "text/plain;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = make("a");
      link.href = url;
      link.download = "inventario-volumen-movipiso.txt";
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    });

    whatsappButton.addEventListener("click", () => {
      if (hasInvalidFields || currentSelection.length === 0) return;
      const message = `Hola, Movipiso. Quiero valorar una mudanza.\n\n${inventoryText()}`;
      window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    });

    resetButton.addEventListener("click", () => {
      if (!window.confirm("¿Vaciar el inventario y recuperar las medidas iniciales?")) return;
      for (const item of [...items]) {
        if (item.custom) {
          items.splice(items.indexOf(item), 1);
          item.row.remove();
        } else {
          item.inputs.quantity.value = "0";
          item.inputs.length.value = String(item.length);
          item.inputs.width.value = String(item.width);
          item.inputs.height.value = String(item.height);
        }
      }
      customForm.reset();
      customQuantity.input.value = "1";
      customError.textContent = "";
      update();
    });

    update();
  }

  function initAll() {
    document.querySelectorAll("[data-volume-calculator]").forEach((mount, index) => {
      initCalculator(mount, index + 1);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll, { once: true });
  } else {
    initAll();
  }
})();
