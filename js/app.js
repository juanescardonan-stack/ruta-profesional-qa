(() => {
  "use strict";

  const portfolio = window.ISTQB_PORTFOLIO;
  if (!portfolio) {
    document.body.classList.add("data-error");
    return;
  }

  const SVG_NS = "http://www.w3.org/2000/svg";
  const STORAGE_KEY = "ruta-profesional-qa-istqb-v1";
  const DONE_COLOR = "#2E8B57";
  const geometry = {
    cx: 724,
    cy: 609,
    foundation: 172,
    advancedOuter: 363,
    advancedBandOuter: 260,
    expertBandOuter: 480,
    expertOuter: 611,
    specialistBandOuter: 263,
    specialistOuter: 613,
    topStart: 210,
    topEnd: 330,
    specialistStart: 22.5,
    specialistEnd: 157.5
  };

  const allCertifications = portfolio.groups.flatMap((group) =>
    group.certifications.map((certification) => ({ ...certification, groupId: group.id }))
  );
  const certificationById = new Map(allCertifications.map((certification) => [certification.id, certification]));
  const groupById = new Map(portfolio.groups.map((group) => [group.id, group]));

  let storageAvailable = true;
  let progress = loadProgress();

  const svg = document.querySelector("#career-wheel");
  const wheelLayer = document.querySelector("#wheel-content");
  const checklistRoot = document.querySelector("#certification-groups");
  const tooltip = document.querySelector("#wheel-tooltip");
  const wheelStage = document.querySelector(".wheel-stage");

  renderWheel();
  renderChecklist();
  bindGlobalControls();
  updateInterface();

  function svgElement(name, attributes = {}) {
    const element = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
    return element;
  }

  function polar(radius, angle) {
    const radians = (angle * Math.PI) / 180;
    return {
      x: geometry.cx + radius * Math.cos(radians),
      y: geometry.cy + radius * Math.sin(radians)
    };
  }

  function annularSector(innerRadius, outerRadius, startAngle, endAngle) {
    const outerStart = polar(outerRadius, startAngle);
    const outerEnd = polar(outerRadius, endAngle);
    const innerEnd = polar(innerRadius, endAngle);
    const innerStart = polar(innerRadius, startAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return [
      `M ${outerStart.x.toFixed(2)} ${outerStart.y.toFixed(2)}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x.toFixed(2)} ${outerEnd.y.toFixed(2)}`,
      `L ${innerEnd.x.toFixed(2)} ${innerEnd.y.toFixed(2)}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x.toFixed(2)} ${innerStart.y.toFixed(2)}`,
      "Z"
    ].join(" ");
  }

  function arcPath(radius, startAngle, endAngle, sweep = 1) {
    const start = polar(radius, startAngle);
    const end = polar(radius, endAngle);
    const delta = Math.abs(endAngle - startAngle);
    return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${radius} ${radius} 0 ${delta > 180 ? 1 : 0} ${sweep} ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
  }

  function renderWheel() {
    wheelLayer.replaceChildren();

    drawSideWings();
    drawCertificationFan("core-expert", geometry.expertBandOuter, geometry.expertOuter, geometry.topStart, geometry.topEnd, {
      fills: ["#CCD5D9", "#CCD5D9", "#CCD5D9", "#E2EBED", "#E2EBED"],
      textColor: "#15747E",
      textRadius: 548,
      textMode: "tangential",
      fontSize: 15.5,
      lineHeight: 18
    });
    drawBand("core-expert", geometry.advancedOuter, geometry.expertBandOuter, geometry.topStart, geometry.topEnd, "#3F7A86");

    drawCertificationFan("core-advanced", geometry.advancedBandOuter, geometry.advancedOuter, geometry.topStart, geometry.topEnd, {
      fills: ["#E5EBF2"],
      textColor: "#328EC1",
      textRadius: 314,
      textMode: "tangential",
      fontSize: 16,
      lineHeight: 19
    });
    drawBand("core-advanced", geometry.foundation, geometry.advancedBandOuter, geometry.topStart, geometry.topEnd, "#328EC1");

    drawCertificationFan(
      "testing-specialist",
      geometry.specialistBandOuter,
      geometry.specialistOuter,
      geometry.specialistStart,
      geometry.specialistEnd,
      {
        fills: ["#C2CDDF", "#C2CDDF", "#C2CDDF", "#C2CDDF", "#C2CDDF", "#C2CDDF", "#C2CDDF", "#A8B6CF", "#A8B6CF", "#A8B6CF", "#A8B6CF", "#A8B6CF", "#A8B6CF", "#C2CDDF", "#C2CDDF", "#C2CDDF", "#C2CDDF"],
        textColor: "#2A478E",
        textRadius: 435,
        textMode: "radial",
        fontSize: 14.5,
        lineHeight: 17,
        separator: "#2E4B93",
        reverse: true
      }
    );
    drawBand(
      "testing-specialist",
      geometry.foundation,
      geometry.specialistBandOuter,
      geometry.specialistStart,
      geometry.specialistEnd,
      "#2E4B93"
    );

    drawBandLabels();
    drawFoundation();
  }

  function drawSideWings() {
    const wings = [
      { id: "supporting", start: 330, end: 382.5, label: ["Supporting Skills"], x: 1080, y: 602 },
      { id: "alliances", start: 157.5, end: 180, label: ["Alliances", "IREB® · TMMi®", "IQBBA® · iSAQB®"], x: 330, y: 690 },
      { id: "addon", start: 180, end: 210, label: ["ISTQB® Add-On", "Certification", "Practical Tester by A4Q"], x: 335, y: 520 }
    ];

    wings.forEach((wing) => {
      const group = svgElement("g", { class: "info-segment", "data-info-id": wing.id, tabindex: "0" });
      const path = svgElement("path", {
        d: annularSector(geometry.foundation, geometry.specialistOuter, wing.start, wing.end),
        fill: "#C7CCD5",
        stroke: "#FFFFFF",
        "stroke-width": 2,
        class: "info-segment__shape"
      });
      group.append(path);
      const title = svgElement("title");
      title.textContent = wing.label.join(" — ");
      group.append(title);

      const text = addText(group, wing.x, wing.y, wing.label, {
        className: "wing-label",
        fill: "#143A61",
        fontSize: wing.id === "supporting" ? 23 : 19,
        lineHeight: 26,
        anchor: "middle"
      });
      if (wing.id !== "supporting") {
        const tspans = text.querySelectorAll("tspan");
        tspans.forEach((tspan, index) => {
          if (index < 2 && wing.id === "addon") tspan.classList.add("wing-label--strong");
          if (index === 0 && wing.id === "alliances") tspan.classList.add("wing-label--strong");
          if (index === 2 && wing.id === "addon") tspan.classList.add("wing-label--detail");
        });
      }
      wheelLayer.append(group);
    });
  }

  function drawBand(groupId, innerRadius, outerRadius, startAngle, endAngle, fill) {
    const group = svgElement("g", { class: `wheel-band wheel-band--${groupId}` });
    const path = svgElement("path", {
      d: annularSector(innerRadius, outerRadius, startAngle, endAngle),
      fill,
      stroke: fill,
      "stroke-width": 1
    });
    group.append(path);

    const topOrBottom = groupId === "testing-specialist" ? 90 : 270;
    const left = polar(outerRadius - 2, topOrBottom - 3.5);
    const right = polar(outerRadius - 2, topOrBottom + 3.5);
    const point = polar(outerRadius + 18, topOrBottom);
    group.append(svgElement("polygon", {
      points: `${left.x},${left.y} ${point.x},${point.y} ${right.x},${right.y}`,
      fill
    }));
    wheelLayer.append(group);
  }

  function drawCertificationFan(groupId, innerRadius, outerRadius, startAngle, endAngle, options) {
    const group = groupById.get(groupId);
    const step = (endAngle - startAngle) / group.certifications.length;

    group.certifications.forEach((certification, index) => {
      const segmentStart = options.reverse ? endAngle - step * (index + 1) : startAngle + step * index;
      const segmentEnd = options.reverse ? endAngle - step * index : segmentStart + step;
      const middleAngle = (segmentStart + segmentEnd) / 2;
      const fill = options.fills[index % options.fills.length];
      const separator = options.separator || "#FFFFFF";
      const link = interactiveSegment(
        certification,
        annularSector(innerRadius, outerRadius, segmentStart, segmentEnd),
        fill,
        separator
      );

      const point = polar(options.textRadius, middleAngle);
      const lines = certification.wheelLines || [certification.wheelLabel];
      let rotation = 0;
      if (options.textMode === "tangential") {
        rotation = middleAngle + 90;
        if (rotation > 180) rotation -= 360;
      } else {
        rotation = middleAngle;
        if (rotation > 90 && rotation < 270) rotation -= 180;
      }

      addText(link, point.x, point.y, lines, {
        className: "segment-label",
        fill: options.textColor,
        fontSize: options.fontSize,
        lineHeight: options.lineHeight,
        rotation,
        anchor: "middle"
      });
      wheelLayer.append(link);
    });
  }

  function interactiveSegment(certification, pathData, fill, stroke) {
    const href = certification.localPdf || certification.pdfUrl;
    const link = svgElement("a", {
      class: "cert-segment",
      "data-cert-id": certification.id,
      href,
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": `${certification.name}, ${certification.code} ${certification.version}. Syllabus publicado en ${certification.publishedYear}. Abrir PDF.`
    });
    const shape = svgElement("path", {
      d: pathData,
      fill,
      stroke,
      "stroke-width": 1.8,
      "vector-effect": "non-scaling-stroke",
      class: "segment-shape",
      "data-original-fill": fill
    });
    const title = svgElement("title");
    title.textContent = `${certification.code} · ${certification.name} · ${certification.status}`;
    link.append(shape, title);
    bindSegmentEvents(link, certification);
    return link;
  }

  function drawFoundation() {
    const certification = certificationById.get("ctfl");
    const link = svgElement("a", {
      class: "cert-segment cert-segment--foundation",
      "data-cert-id": certification.id,
      href: certification.localPdf || certification.pdfUrl,
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": `${certification.name}, ${certification.version}. Syllabus publicado en ${certification.publishedYear}. Abrir PDF.`
    });

    const topLeft = polar(geometry.foundation - 2, 266);
    const topRight = polar(geometry.foundation - 2, 274);
    const topPoint = polar(geometry.foundation + 19, 270);
    const bottomLeft = polar(geometry.foundation - 2, 86);
    const bottomRight = polar(geometry.foundation - 2, 94);
    const bottomPoint = polar(geometry.foundation + 19, 90);
    link.append(
      svgElement("polygon", {
        points: `${topLeft.x},${topLeft.y} ${topPoint.x},${topPoint.y} ${topRight.x},${topRight.y}`,
        fill: "#143A61",
        class: "segment-shape foundation-peak",
        "data-original-fill": "#143A61"
      }),
      svgElement("polygon", {
        points: `${bottomLeft.x},${bottomLeft.y} ${bottomPoint.x},${bottomPoint.y} ${bottomRight.x},${bottomRight.y}`,
        fill: "#143A61",
        class: "segment-shape foundation-peak",
        "data-original-fill": "#143A61"
      }),
      svgElement("circle", {
        cx: geometry.cx,
        cy: geometry.cy,
        r: geometry.foundation,
        fill: "#143A61",
        class: "segment-shape",
        "data-original-fill": "#143A61"
      })
    );
    const title = svgElement("title");
    title.textContent = `${certification.code} · ${certification.name} · ${certification.status}`;
    link.append(title);
    addText(link, geometry.cx, geometry.cy + 13, ["Foundation"], {
      className: "foundation-label segment-label",
      fill: "#FFFFFF",
      fontSize: 42,
      lineHeight: 44,
      anchor: "middle"
    });
    bindSegmentEvents(link, certification);
    wheelLayer.append(link);
  }

  function drawBandLabels() {
    const defs = svg.querySelector("defs");
    const paths = [
      { id: "advanced-label-path", d: arcPath(217, 218, 322, 1) },
      { id: "specialist-label-path", d: arcPath(220, 145, 35, 0) },
      { id: "expert-left-path", d: arcPath(419, 214, 274, 1) },
      { id: "expert-right-path", d: arcPath(419, 278, 326, 1) }
    ];
    paths.forEach(({ id, d }) => defs.append(svgElement("path", { id, d, fill: "none" })));

    const advanced = svgElement("text", { class: "band-title band-title--advanced" });
    const advancedPath = svgElement("textPath", { href: "#advanced-label-path", startOffset: "50%", "text-anchor": "middle" });
    const advancedCore = svgElement("tspan", { fill: "#255A78" });
    advancedCore.textContent = "CORE ";
    const advancedName = svgElement("tspan", { fill: "#FFFFFF" });
    advancedName.textContent = "ADVANCED";
    advancedPath.append(advancedCore, advancedName);
    advanced.append(advancedPath);

    const specialist = svgElement("text", { class: "band-title band-title--specialist", fill: "#FFFFFF" });
    const specialistPath = svgElement("textPath", { href: "#specialist-label-path", startOffset: "50%", "text-anchor": "middle" });
    specialistPath.textContent = "TESTING SPECIALIST";
    specialist.append(specialistPath);

    const expertLeft = svgElement("text", { class: "expert-family-label", fill: "#FFFFFF" });
    const expertLeftPath = svgElement("textPath", { href: "#expert-left-path", startOffset: "50%", "text-anchor": "middle" });
    expertLeftPath.textContent = "Test Management";
    expertLeft.append(expertLeftPath);

    const expertRight = svgElement("text", { class: "expert-family-label", fill: "#FFFFFF" });
    const expertRightPath = svgElement("textPath", { href: "#expert-right-path", startOffset: "50%", "text-anchor": "middle" });
    expertRightPath.textContent = "Improving the Test Process";
    expertRight.append(expertRightPath);

    const expertTitle = svgElement("text", {
      x: geometry.cx,
      y: geometry.cy - 398,
      class: "band-title band-title--expert",
      "text-anchor": "middle"
    });
    const expertCore = svgElement("tspan", { fill: "#174F59" });
    expertCore.textContent = "CORE ";
    const expertName = svgElement("tspan", { fill: "#FFFFFF" });
    expertName.textContent = "EXPERT";
    expertTitle.append(expertCore, expertName);

    wheelLayer.append(advanced, specialist, expertLeft, expertRight, expertTitle);
  }

  function addText(parent, x, y, lines, options = {}) {
    const text = svgElement("text", {
      x: 0,
      y: 0,
      class: options.className || "",
      fill: options.fill || "currentColor",
      "font-size": options.fontSize || 16,
      "text-anchor": options.anchor || "middle",
      transform: `translate(${x} ${y}) rotate(${options.rotation || 0})`
    });
    const lineHeight = options.lineHeight || options.fontSize || 16;
    const firstDy = -((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, index) => {
      const tspan = svgElement("tspan", { x: 0, dy: index === 0 ? firstDy : lineHeight });
      tspan.textContent = line;
      text.append(tspan);
    });
    parent.append(text);
    return text;
  }

  function bindSegmentEvents(link, certification) {
    link.addEventListener("pointerenter", (event) => {
      showTooltip(certification, event);
      highlightCard(certification.id, true);
    });
    link.addEventListener("pointermove", (event) => positionTooltip(event));
    link.addEventListener("pointerleave", () => {
      hideTooltip();
      highlightCard(certification.id, false);
    });
    link.addEventListener("focus", () => {
      showTooltip(certification);
      highlightCard(certification.id, true);
    });
    link.addEventListener("blur", () => {
      hideTooltip();
      highlightCard(certification.id, false);
    });
    link.addEventListener("click", () => pulseCard(certification.id));
  }

  function renderChecklist() {
    const fragment = document.createDocumentFragment();

    portfolio.groups.forEach((group) => {
      const section = document.createElement("section");
      section.className = `certification-group certification-group--${group.id}`;
      section.dataset.groupId = group.id;
      section.style.setProperty("--group-color", group.color);
      if (group.darkColor) {
        section.style.setProperty("--group-ink-dark", group.darkColor);
      }
      section.id = `grupo-${group.id}`;

      const heading = document.createElement("div");
      heading.className = "group-heading";

      const titleBlock = document.createElement("div");
      const eyebrow = document.createElement("p");
      eyebrow.className = "group-eyebrow";
      eyebrow.textContent = group.subtitle;
      const title = document.createElement("h3");
      title.textContent = group.title;
      titleBlock.append(eyebrow, title);

      const count = document.createElement("span");
      count.className = "group-progress";
      count.dataset.groupProgress = group.id;
      heading.append(titleBlock, count);

      const list = document.createElement("div");
      list.className = "certification-list";

      group.certifications.forEach((certification) => {
        const card = document.createElement("article");
        card.className = "certification-card";
        card.dataset.certId = certification.id;
        card.id = `cert-${certification.id}`;
        const isNewCertification = certification.publishedYear > 2025 || certification.status.includes("nuevo");
        card.classList.toggle("is-new-certification", isNewCertification);

        const checkLabel = document.createElement("label");
        checkLabel.className = "certification-check";
        checkLabel.setAttribute("for", `check-${certification.id}`);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `check-${certification.id}`;
        checkbox.dataset.certCheckbox = certification.id;
        checkbox.checked = Boolean(progress[certification.id]);
        checkbox.setAttribute("aria-describedby", `meta-${certification.id}`);
        checkbox.addEventListener("change", () => setCompleted(certification.id, checkbox.checked));

        const customCheck = document.createElement("span");
        customCheck.className = "custom-checkbox";
        customCheck.setAttribute("aria-hidden", "true");

        const copy = document.createElement("span");
        copy.className = "certification-copy";
        const name = document.createElement("strong");
        name.textContent = certification.name;
        const meta = document.createElement("span");
        meta.className = "certification-meta";
        meta.id = `meta-${certification.id}`;
        meta.textContent = `${certification.code} · ${certification.version}`;
        copy.append(name, meta);
        checkLabel.append(checkbox, customCheck, copy);

        const actions = document.createElement("div");
        actions.className = "certification-actions";
        const status = document.createElement("span");
        status.className = isNewCertification
          ? "status-badge status-badge--new"
          : certification.status.startsWith("En retiro")
            ? "status-badge status-badge--sunset"
            : "status-badge";
        status.textContent = isNewCertification ? `Novedad ${certification.publishedYear}` : certification.status;

        const pdfLink = document.createElement("a");
        pdfLink.className = "pdf-link";
        pdfLink.href = certification.localPdf || certification.pdfUrl;
        pdfLink.target = "_blank";
        pdfLink.rel = "noopener noreferrer";
        pdfLink.textContent = certification.localPdf ? "Abrir PDF incluido" : "Abrir PDF oficial";
        pdfLink.setAttribute("aria-label", `${pdfLink.textContent}: ${certification.name}`);

        const sourceLink = document.createElement("a");
        sourceLink.className = "source-link";
        sourceLink.href = certification.pageUrl;
        sourceLink.target = "_blank";
        sourceLink.rel = "noopener noreferrer";
        sourceLink.textContent = "Ficha ISTQB";

        actions.append(status, pdfLink, sourceLink);
        card.append(checkLabel, actions);
        card.addEventListener("pointerenter", () => highlightSegment(certification.id, true));
        card.addEventListener("pointerleave", () => highlightSegment(certification.id, false));
        list.append(card);
      });

      section.append(heading, list);
      fragment.append(section);
    });

    checklistRoot.replaceChildren(fragment);
  }

  function loadProgress() {
    try {
      const testKey = `${STORAGE_KEY}-test`;
      localStorage.setItem(testKey, "1");
      localStorage.removeItem(testKey);
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return Object.fromEntries(
        allCertifications.map((certification) => [certification.id, saved[certification.id] === true])
      );
    } catch (error) {
      storageAvailable = false;
      return Object.fromEntries(allCertifications.map((certification) => [certification.id, false]));
    }
  }

  function saveProgress() {
    if (!storageAvailable) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      storageAvailable = false;
      showStorageWarning();
    }
  }

  function setCompleted(certificationId, completed) {
    progress[certificationId] = completed;
    saveProgress();
    updateInterface();
  }

  function updateInterface() {
    allCertifications.forEach((certification) => {
      const completed = Boolean(progress[certification.id]);
      const segment = document.querySelector(`.cert-segment[data-cert-id="${certification.id}"]`);
      const card = document.querySelector(`.certification-card[data-cert-id="${certification.id}"]`);
      const checkbox = document.querySelector(`[data-cert-checkbox="${certification.id}"]`);
      if (segment) {
        segment.classList.toggle("is-complete", completed);
        segment.setAttribute("aria-label", `${certification.name}, ${certification.code} ${certification.version}. Syllabus publicado en ${certification.publishedYear}. ${completed ? "Completada" : "Pendiente"}. Abrir PDF.`);
      }
      if (card) card.classList.toggle("is-complete", completed);
      if (checkbox && checkbox.checked !== completed) checkbox.checked = completed;
    });

    const completedCount = allCertifications.filter((certification) => progress[certification.id]).length;
    const totalCount = allCertifications.length;
    const percentage = Math.round((completedCount / totalCount) * 100);
    document.querySelector("#completed-count").textContent = completedCount;
    document.querySelector("#total-count").textContent = totalCount;
    document.querySelector("#progress-percent").textContent = `${percentage}%`;
    const progressBar = document.querySelector("#overall-progress");
    progressBar.style.setProperty("--progress", `${percentage}%`);
    progressBar.setAttribute("aria-valuenow", String(percentage));
    document.querySelector("#progress-live").textContent = `${completedCount} de ${totalCount} certificaciones completadas.`;

    portfolio.groups.forEach((group) => {
      const completedInGroup = group.certifications.filter((certification) => progress[certification.id]).length;
      const target = document.querySelector(`[data-group-progress="${group.id}"]`);
      if (target) target.textContent = `${completedInGroup} / ${group.certifications.length}`;
    });

    const resetButton = document.querySelector("#reset-progress");
    resetButton.disabled = completedCount === 0;
    if (!storageAvailable) showStorageWarning();
  }

  function bindGlobalControls() {
    document.querySelector("#reset-progress").addEventListener("click", () => {
      const confirmed = window.confirm("¿Borrar todas las certificaciones marcadas? Esta acción reinicia el progreso guardado en este navegador.");
      if (!confirmed) return;
      progress = Object.fromEntries(allCertifications.map((certification) => [certification.id, false]));
      saveProgress();
      updateInterface();
    });
  }

  function showTooltip(certification, pointerEvent) {
    tooltip.replaceChildren();
    const code = document.createElement("span");
    code.className = "wheel-tooltip__code";
    code.textContent = `${certification.code} · ${certification.version}`;
    const name = document.createElement("strong");
    name.textContent = certification.name;
    const published = document.createElement("span");
    published.className = "wheel-tooltip__published";
    published.textContent = `Syllabus publicado: ${certification.publishedYear}`;
    const state = document.createElement("span");
    state.className = "wheel-tooltip__state";
    state.textContent = progress[certification.id] ? "✓ Completada" : "Pendiente";
    const action = document.createElement("span");
    action.className = "wheel-tooltip__action";
    action.textContent = certification.localPdf ? "Clic para abrir el PDF incluido" : "Clic para abrir el PDF oficial";
    tooltip.append(code, name, published, state, action);
    tooltip.hidden = false;
    if (pointerEvent) {
      positionTooltip(pointerEvent);
    } else {
      tooltip.style.left = "50%";
      tooltip.style.top = "8%";
      tooltip.style.transform = "translateX(-50%)";
    }
  }

  function positionTooltip(event) {
    if (tooltip.hidden) return;
    const bounds = wheelStage.getBoundingClientRect();
    const tooltipWidth = tooltip.offsetWidth || 230;
    let left = event.clientX - bounds.left + 18;
    let top = event.clientY - bounds.top + 18;
    if (left + tooltipWidth > bounds.width - 10) left = event.clientX - bounds.left - tooltipWidth - 18;
    if (top + tooltip.offsetHeight > bounds.height - 10) top = event.clientY - bounds.top - tooltip.offsetHeight - 18;
    tooltip.style.left = `${Math.max(10, left)}px`;
    tooltip.style.top = `${Math.max(10, top)}px`;
    tooltip.style.transform = "none";
  }

  function hideTooltip() {
    tooltip.hidden = true;
  }

  function highlightCard(certificationId, active) {
    document.querySelector(`.certification-card[data-cert-id="${certificationId}"]`)?.classList.toggle("is-linked", active);
  }

  function highlightSegment(certificationId, active) {
    document.querySelector(`.cert-segment[data-cert-id="${certificationId}"]`)?.classList.toggle("is-linked", active);
  }

  function pulseCard(certificationId) {
    const card = document.querySelector(`.certification-card[data-cert-id="${certificationId}"]`);
    if (!card) return;
    card.classList.remove("is-pulsing");
    window.requestAnimationFrame(() => card.classList.add("is-pulsing"));
    window.setTimeout(() => card.classList.remove("is-pulsing"), 900);
  }

  function showStorageWarning() {
    const warning = document.querySelector("#storage-notice");
    warning.hidden = false;
  }

  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    progress = loadProgress();
    updateInterface();
  });

  window.ISTQB_ROUTE_DEBUG = {
    portfolio,
    getProgress: () => ({ ...progress }),
    doneColor: DONE_COLOR
  };
})();
