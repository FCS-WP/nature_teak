/**
 * Frontend script for Shop Product Filter block.
 * Fetches filter options, renders filter controls, and broadcasts filter changes.
 */

const BASE = "/wp-json/ai-zippy/v1";

const DEFAULTS = {
	search: "",
	category: "",
	brands: "",
	tags: "",
	min_price: 0,
	max_price: 0,
	attributes: "",
	stock_status: "",
};

const FILTER_KEYS = Object.keys(DEFAULTS);

document.addEventListener("DOMContentLoaded", () => {
	document
		.querySelectorAll(".wp-block-ai-zippy-shop-product-filter")
		.forEach(initFilter);
});

function initFilter(block) {
	const config = JSON.parse(block.dataset.config || "{}");
	const state = { ...DEFAULTS };

	// Read initial state from URL
	const params = new URLSearchParams(window.location.search);
	for (const key of FILTER_KEYS) {
		const val = params.get(key);
		if (val !== null) {
			state[key] = typeof DEFAULTS[key] === "number" ? Number(val) : val;
		}
	}

	// Set up accordion toggles immediately (before fetch)
	setupAccordions(block);

	// Fetch filter options and build UI
	fetch(`${BASE}/filter-options`)
		.then((r) => r.json())
		.then((options) => buildUI(block, options, config, state))
		.catch((err) => {
			console.error("Filter options error:", err);
			buildUI(block, {}, config, state);
		});
}

function setupAccordions(block) {
	block.querySelectorAll(".spf__section-toggle").forEach((btn) => {
		btn.addEventListener("click", () => {
			const section = btn.closest(".spf__section");
			if (!section) return;
			const isOpen = section.classList.toggle("is-open");
			const arrow = btn.querySelector("svg");
			if (arrow) arrow.style.transform = isOpen ? "rotate(180deg)" : "rotate(0deg)";
		});
		// Open by default for search section
		const section = btn.closest(".spf__section");
		if (section?.classList.contains("spf__section--search")) {
			section.classList.add("is-open");
		}
	});
}

/* ── Build UI ──────────────────────────────────────────────── */

function buildUI(block, options, config, state) {
	const resetBtn = block.querySelector(".spf__reset");
	const sections = {};

	// Search
	if (config.showSearch) {
		const input = block.querySelector('[data-filter="search"]');
		const clearBtn = block.querySelector(".spf__search-clear");
		if (input) {
			input.value = state.search || "";
			clearBtn.style.display = state.search ? "flex" : "none";

			let timeout;
			input.addEventListener("input", () => {
				clearTimeout(timeout);
				clearBtn.style.display = input.value ? "flex" : "none";
				timeout = setTimeout(() => {
					state.search = input.value.trim();
					broadcastWithReset(block, state);
				}, 300);
			});

			clearBtn.addEventListener("click", () => {
				input.value = "";
				clearBtn.style.display = "none";
				state.search = "";
				broadcastWithReset(block, state);
			});
		}
	}

	// Categories
	if (config.showCategories) {
		const container = block.querySelector('[data-filter="category"]');
		if (container && options.categories) {
			renderTreeList(container, options.categories, state.category?.split(",") || [], (slug, checked) => {
				const current = state.category ? state.category.split(",") : [];
				const idx = current.indexOf(slug);
				if (checked && idx === -1) current.push(slug);
				else if (!checked && idx !== -1) current.splice(idx, 1);
				state.category = current.join(",");
				broadcastWithReset(block, state);
			});
		}
	}

	// Price
	if (config.showPrice) {
		const container = block.querySelector('[data-filter="price"]');
		if (container) {
			const minInput = container.querySelector(".spf__price-min");
			const maxInput = container.querySelector(".spf__price-max");
			const slider = container.querySelector(".spf__price-slider");
			const { min = 0, max = 1000 } = options.price_range || {};

			if (slider) {
				slider.min = Math.floor(min);
				slider.max = Math.ceil(max);
			}
			if (minInput) minInput.min = Math.floor(min);
			if (maxInput) {
				maxInput.min = Math.floor(min);
				maxInput.max = Math.ceil(max);
			}

			if (minInput) minInput.value = state.min_price || "";
			if (maxInput) maxInput.value = state.max_price || "";
			if (slider) slider.value = state.max_price || Math.ceil(max);

			let priceTimeout;
			const updatePrice = () => {
				clearTimeout(priceTimeout);
				priceTimeout = setTimeout(() => {
					state.min_price = minInput ? Number(minInput.value) || 0 : 0;
					state.max_price = maxInput ? Number(maxInput.value) || 0 : 0;
					broadcastWithReset(block, state);
				}, 400);
			};

			if (minInput) minInput.addEventListener("change", updatePrice);
			if (maxInput) maxInput.addEventListener("change", updatePrice);
			if (slider) slider.addEventListener("input", () => {
				if (maxInput) maxInput.value = slider.value;
				updatePrice();
			});
		}
	}

	// Brands
	if (config.showBrands) {
		const container = block.querySelector('[data-filter="brands"]');
		if (container && options.brands?.length) {
			renderCheckList(container, options.brands, state.brands?.split(",") || [], (slug, checked) => {
				const current = state.brands ? state.brands.split(",") : [];
				const idx = current.indexOf(slug);
				if (checked && idx === -1) current.push(slug);
				else if (!checked && idx !== -1) current.splice(idx, 1);
				state.brands = current.join(",");
				broadcastWithReset(block, state);
			});
		}
	}

	// Tags
	if (config.showTags) {
		const container = block.querySelector('[data-filter="tags"]');
		if (container && options.tags?.length) {
			renderCheckList(container, options.tags, state.tags?.split(",") || [], (slug, checked) => {
				const current = state.tags ? state.tags.split(",") : [];
				const idx = current.indexOf(slug);
				if (checked && idx === -1) current.push(slug);
				else if (!checked && idx !== -1) current.splice(idx, 1);
				state.tags = current.join(",");
				broadcastWithReset(block, state);
			});
		}
	}

	// Attributes
	if (config.showAttributes) {
		const container = block.querySelector('[data-filter="attributes"]');
		if (container && options.attributes?.length) {
			const selected = parseAttributes(state.attributes);
			options.attributes.forEach((attr) => {
				const section = document.createElement("div");
				section.className = "spf__section spf__section--attr";
				section.innerHTML = `
					<button class="spf__section-toggle" type="button">
						<span>${escapeHtml(attr.name)}</span>
						<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
							<polyline points="2 4 6 8 10 4"/>
						</svg>
					</button>
					<div class="spf__section-content"></div>
				`;
				const content = section.querySelector(".spf__section-content");
				renderCheckList(content, attr.options, selected[attr.slug] || [], (termSlug, checked) => {
					if (!selected[attr.slug]) selected[attr.slug] = [];
					const idx = selected[attr.slug].indexOf(termSlug);
					if (checked && idx === -1) selected[attr.slug].push(termSlug);
					else if (!checked && idx !== -1) selected[attr.slug].splice(idx, 1);
					if (selected[attr.slug].length === 0) delete selected[attr.slug];
					state.attributes = serializeAttributes(selected);
					broadcastWithReset(block, state);
				});
				container.appendChild(section);
			});
		}
	}

	// Stock status
	if (config.showStock) {
		const container = block.querySelector('[data-filter="stock_status"]');
		if (container) {
			const radios = container.querySelectorAll('input[type="radio"]');
			radios.forEach((radio) => {
				radio.checked = radio.value === state.stock_status;
				radio.addEventListener("change", () => {
					if (radio.checked) {
						state.stock_status = radio.value;
						broadcastWithReset(block, state);
					}
				});
			});
		}
	}

	// Reset button
	if (resetBtn) {
		resetBtn.addEventListener("click", () => {
			// Reset state
			for (const key of FILTER_KEYS) state[key] = DEFAULTS[key];

			// Clear inputs
			block.querySelectorAll('input[type="text"]').forEach((i) => (i.value = ""));
			block.querySelectorAll('input[type="number"]').forEach((i) => (i.value = ""));
			block.querySelectorAll('input[type="checkbox"]').forEach((i) => (i.checked = false));
			block.querySelectorAll('input[type="radio"]').forEach((i) => {
				if (i.value === "") i.checked = true;
				else i.checked = false;
			});

			broadcastWithReset(block, state);
		});
	}

	// Show/hide reset button based on active filters
	function updateResetVisibility() {
		if (!resetBtn) return;
		const hasActive =
			state.search ||
			state.category ||
			state.brands ||
			state.tags ||
			state.attributes ||
			state.min_price > 0 ||
			state.max_price > 0 ||
			state.stock_status;
		resetBtn.style.display = hasActive ? "block" : "none";
	}

	// Local broadcast wrapper that also updates reset visibility
	function broadcastWithReset(blk, st) {
		updateResetVisibility();
		broadcast(blk, st);
	}
	updateResetVisibility();
}

/* ── Render helpers ─────────────────────────────────────────── */

function renderTreeList(container, items, selected, onChange) {
	const roots = items.filter((i) => !i.parent || i.parent === 0);
	const children = (parentId) => items.filter((i) => i.parent === parentId);

	function buildList(nodes, parent = null) {
		const ul = document.createElement("ul");
		ul.className = "spf__tree" + (parent ? " spf__tree--child" : "");
		nodes.forEach((node) => {
			const li = document.createElement("li");
			li.innerHTML = `
				<label class="spf__checkbox">
					<input type="checkbox" value="${escapeHtml(node.slug)}" ${selected.includes(node.slug) ? "checked" : ""} />
					<span class="spf__checkbox-label">${escapeHtml(node.name)}</span>
					<span class="spf__checkbox-count">${node.count || 0}</span>
				</label>
			`;
			const checkbox = li.querySelector('input[type="checkbox"]');
			checkbox.addEventListener("change", () => onChange(node.slug, checkbox.checked));

			const childNodes = children(node.id);
			if (childNodes.length > 0) {
				li.appendChild(buildList(childNodes, node));
			}
			ul.appendChild(li);
		});
		return ul;
	}

	container.innerHTML = "";
	if (roots.length > 0) {
		container.appendChild(buildList(roots));
	}
}

function renderCheckList(container, items, selected, onChange) {
	container.innerHTML = "";
	items.forEach((item) => {
		const label = document.createElement("label");
		label.className = "spf__checkbox";
		label.innerHTML = `
			<input type="checkbox" value="${escapeHtml(item.slug)}" ${selected.includes(item.slug) ? "checked" : ""} />
			<span class="spf__checkbox-label">${escapeHtml(item.name)}</span>
			<span class="spf__checkbox-count">${item.count || 0}</span>
		`;
		const checkbox = label.querySelector('input[type="checkbox"]');
		checkbox.addEventListener("change", () => onChange(item.slug, checkbox.checked));
		container.appendChild(label);
	});
}

/* ── State helpers ─────────────────────────────────────────── */

function broadcast(block, state) {
	// Update URL (only filter keys, never orderby/order)
	const params = new URLSearchParams();
	for (const key of FILTER_KEYS) {
		const value = state[key];
		if (value !== DEFAULTS[key] && value !== "" && value !== 0) {
			params.set(key, value);
		}
	}
	const qs = params.toString();
	const url = window.location.pathname + (qs ? `?${qs}` : "");
	window.history.replaceState(null, "", url);

	// Dispatch custom event (only filter keys)
	const filterState = {};
	for (const key of FILTER_KEYS) {
		filterState[key] = state[key];
	}
	window.dispatchEvent(
		new CustomEvent("ai-zippy-filters-changed", {
			detail: { state: filterState },
		})
	);
}

function parseAttributes(str) {
	const result = {};
	if (!str) return result;
	str.split("|").forEach((group) => {
		const [tax, terms] = group.split(":");
		if (tax && terms) result[tax] = terms.split(",");
	});
	return result;
}

function serializeAttributes(obj) {
	return Object.entries(obj)
		.filter(([, terms]) => terms.length > 0)
		.map(([tax, terms]) => `${tax}:${terms.join(",")}`)
		.join("|");
}

function escapeHtml(text) {
	const div = document.createElement("div");
	div.textContent = text;
	return div.innerHTML;
}
