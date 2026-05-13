/**
 * Frontend script for Shop Product Grid block.
 * Handles: filter sync, pagination, sorting, view toggle, gallery thumbnails, wishlist.
 */

const BASE = "/wp-json/ai-zippy/v1";

document.addEventListener("DOMContentLoaded", () => {
	document
		.querySelectorAll(".wp-block-ai-zippy-shop-product-grid")
		.forEach(initGrid);
});

function initGrid(block) {
	const config = JSON.parse(block.dataset.config || "{}");
	const gridEl = block.querySelector('[data-grid]');
	const emptyEl = block.querySelector(".spg__empty");
	const paginationEl = block.querySelector('[data-pagination]');
	const sortEl = block.querySelector('[data-sort]');
	const viewBtns = block.querySelectorAll('[data-view]');

	const state = {
		page: 1,
		per_page: config.per_page || 12,
		orderby: config.orderby || "menu_order",
		order: config.order || "ASC",
		search: "",
		category: "",
		brands: "",
		tags: "",
		min_price: 0,
		max_price: 0,
		attributes: "",
		stock_status: "",
		total_pages: config.pages || 1,
	};

	// Keys that the filter block controls (exclude sort/order/page/per_page)
	const FILTER_KEYS = ['search', 'category', 'brands', 'tags', 'min_price', 'max_price', 'attributes', 'stock_status'];

	// Read URL params for initial state
	const params = new URLSearchParams(window.location.search);
	for (const key of Object.keys(state)) {
		const val = params.get(key);
		if (val !== null) {
			state[key] = typeof state[key] === "number" ? Number(val) : val;
		}
	}
	if (params.get("page")) state.page = Number(params.get("page"));
	if (params.get("orderby")) state.orderby = params.get("orderby");
	if (params.get("order")) state.order = params.get("order");

	// Update sort dropdown
	if (sortEl) {
		sortEl.value = `${state.orderby}-${state.order}`;
		sortEl.addEventListener("change", () => {
			const [ob, od] = sortEl.value.split("-");
			state.orderby = ob;
			state.order = od;
			state.page = 1;
			loadProducts();
		});
	}

	// View toggle
	viewBtns.forEach((btn) => {
		btn.addEventListener("click", () => {
			const view = btn.dataset.view;
			viewBtns.forEach((b) => b.classList.remove("is-active"));
			btn.classList.add("is-active");
			if (gridEl) {
				gridEl.classList.remove("spg__grid--grid", "spg__grid--list");
				gridEl.classList.add(`spg__grid--${view}`);
			}
			localStorage.setItem("spg-view", view);
		});
	});

	// Restore view preference
	const savedView = localStorage.getItem("spg-view") || "grid";
	const savedBtn = block.querySelector(`[data-view="${savedView}"]`);
	if (savedBtn && gridEl) {
		viewBtns.forEach((b) => b.classList.remove("is-active"));
		savedBtn.classList.add("is-active");
		gridEl.classList.remove("spg__grid--grid", "spg__grid--list");
		gridEl.classList.add(`spg__grid--${savedView}`);
	}

	// Pagination
	if (paginationEl) {
		paginationEl.addEventListener("click", (e) => {
			const btn = e.target.closest("[data-page]");
			if (!btn) return;

			const pageAction = btn.dataset.page;
			const current = state.page;
			const maxPages = state.total_pages || 1;

			let newPage = current;
			if (pageAction === "prev") newPage = Math.max(1, current - 1);
			else if (pageAction === "next") newPage = Math.min(maxPages, current + 1);
			else newPage = Number(pageAction);

			if (newPage !== current && newPage >= 1 && newPage <= maxPages) {
				state.page = newPage;
				loadProducts();
				gridEl?.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		});
	}

	// Listen for filter changes from the filter block
	window.addEventListener("ai-zippy-filters-changed", (e) => {
		const filterState = e.detail?.state || {};
		for (const key of FILTER_KEYS) {
			if (filterState[key] !== undefined) {
				state[key] = filterState[key];
			}
		}
		state.page = 1;
		loadProducts();
	});

	// Gallery thumbnails + wishlist on initial render
	initCardInteractions(block);

	// Load products from API
	async function loadProducts() {
		if (!gridEl) return;

		// Show loading
		gridEl.classList.add("spg__grid--loading");

		try {
			const query = new URLSearchParams();
			for (const [key, value] of Object.entries(state)) {
				if (value !== "" && value !== null && value !== undefined && value !== 0) {
					query.set(key, String(value));
				}
			}

			const res = await fetch(`${BASE}/products?${query.toString()}`);
			if (!res.ok) throw new Error("Failed to fetch");
			const data = await res.json();

			state.total_pages = data.pages || 1;
			renderProducts(data.products || []);
			updatePagination(data.page || 1, state.total_pages, data.total || 0);

			if (emptyEl) {
				emptyEl.style.display = data.products?.length ? "none" : "block";
			}
		} catch (err) {
			console.error("Shop grid error:", err);
		} finally {
			gridEl.classList.remove("spg__grid--loading");
		}
	}

	function renderProducts(products) {
		if (!gridEl) return;

		const currentView = gridEl.classList.contains("spg__grid--list") ? "list" : "grid";
		const currentCols = gridEl.style.gridTemplateColumns;

		gridEl.innerHTML = products.map((p) => renderProductCard(p, config)).join("");
		gridEl.className = `spg__grid spg__grid--${currentView}`;
		if (currentView === "grid") gridEl.style.gridTemplateColumns = currentCols;

		// Re-init interactions on new cards
		initCardInteractions(block);
	}

	function renderProductCard(p, cfg) {
		const allImages = [p.image, ...(p.gallery || [])].filter(Boolean);
		const img = allImages[0] || "";
		const extra = allImages.length > 3 ? allImages.length - 3 : 0;
		const salePct = p.on_sale && p.regular_price && p.sale_price
			? Math.round(((p.regular_price - p.sale_price) / p.regular_price) * 100)
			: 0;
		const catName = p.categories?.[0]?.name || "";
		const isOos = p.stock_status === "outofstock";

		let thumbsHtml = "";
		if (allImages.length > 1) {
			thumbsHtml = `<div class="spg__thumbs">` +
				allImages.slice(0, 3).map((thumb, i) =>
					`<button class="spg__thumb ${i === 0 ? "is-active" : ""}" data-index="${i}" type="button">
						<img src="${escapeHtml(thumb)}" alt="" />
					</button>`
				).join("") +
				(extra > 0 ? `<a href="${escapeHtml(p.permalink)}" class="spg__thumb spg__thumb--more">+${extra}</a>` : "") +
				`</div>`;
		}

		let badgesHtml = "";
		if (cfg.show_sale && p.on_sale) {
			badgesHtml += `<span class="spg__badge spg__badge--sale">${salePct > 0 ? salePct + "% OFF" : "Sale"}</span>`;
		}
		if (isOos) {
			badgesHtml += `<span class="spg__badge spg__badge--oos">Sold Out</span>`;
		}

		const ratingHtml = cfg.show_rating && p.average_rating > 0
			? `<div class="spg__card-rating">${renderStars(p.average_rating)}</div>`
			: "";

		const cartHtml = cfg.show_cart && !isOos
			? `<div class="spg__card-actions">
				<a href="${escapeHtml(p.add_to_cart_url)}" class="spg__card-btn" data-product-id="${p.id}">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
						<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
					</svg>
					ADD TO CART
				</a>
				<button class="spg__card-wish-sm" aria-label="Wishlist" type="button">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
					</svg>
				</button>
			</div>`
			: "";

		return `
			<div class="spg__card" data-images="${escapeHtml(JSON.stringify(allImages))}">
				<div class="spg__card-image">
					<a href="${escapeHtml(p.permalink)}">
						<img src="${escapeHtml(img)}" alt="${escapeHtml(p.name)}" loading="lazy" />
					</a>
					${badgesHtml}
					<button class="spg__wish" aria-label="Add to wishlist" type="button">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
						</svg>
					</button>
					${thumbsHtml}
				</div>
				<div class="spg__card-body">
					${catName ? `<span class="spg__card-cat">${escapeHtml(catName)}</span>` : ""}
					<a href="${escapeHtml(p.permalink)}" class="spg__card-title">${escapeHtml(p.name)}</a>
					${ratingHtml}
					<div class="spg__card-price">${p.price_html || ""}</div>
					${cartHtml}
				</div>
			</div>
		`;
	}

	function renderStars(rating) {
		const full = Math.floor(rating);
		const half = rating % 1 >= 0.5 ? 1 : 0;
		const empty = 5 - full - half;
		return `<span class="spg__stars">${"★".repeat(full)}${half ? "½" : ""}${"☆".repeat(empty)}</span>`;
	}

	function updatePagination(current, total, totalCount) {
		// Update count
		const countEl = block.querySelector(".spg__count");
		if (countEl) {
			countEl.textContent = `${totalCount} product${totalCount !== 1 ? "s" : ""}`;
		}

		if (!paginationEl) return;

		// Rebuild pagination buttons
		let html = `<button class="spg__page-btn spg__page-prev" data-page="prev" type="button" ${current <= 1 ? "disabled" : ""}>&lsaquo; Prev</button>`;

		const maxVisible = 5;
		let start = Math.max(1, current - Math.floor(maxVisible / 2));
		let end = Math.min(total, start + maxVisible - 1);
		start = Math.max(1, end - maxVisible + 1);

		if (start > 1) {
			html += `<button class="spg__page-btn" data-page="1" type="button">1</button>`;
			if (start > 2) html += `<span class="spg__page-dots">&hellip;</span>`;
		}

		for (let p = start; p <= end; p++) {
			html += `<button class="spg__page-btn ${p === current ? "is-active" : ""}" data-page="${p}" type="button">${p}</button>`;
		}

		if (end < total) {
			if (end < total - 1) html += `<span class="spg__page-dots">&hellip;</span>`;
			html += `<button class="spg__page-btn" data-page="${total}" type="button">${total}</button>`;
		}

		html += `<button class="spg__page-btn spg__page-next" data-page="next" type="button" ${current >= total ? "disabled" : ""}>Next &rsaquo;</button>`;

		paginationEl.innerHTML = html;
	}
}

// ---- Card interactions (thumbnails + wishlist) ----

function initCardInteractions(block) {
	// Thumbnail hover
	block.querySelectorAll(".spg__card").forEach((card) => {
		const images = JSON.parse(card.dataset.images || "[]");
		const mainImg = card.querySelector(".spg__card-image > a > img");
		const thumbs = card.querySelectorAll(".spg__thumb[data-index]");

		if (!mainImg || images.length <= 1) return;

		thumbs.forEach((thumb) => {
			thumb.addEventListener("mouseenter", () => {
				const idx = parseInt(thumb.dataset.index, 10);
				if (images[idx]) {
					mainImg.src = images[idx];
					thumbs.forEach((t) => t.classList.remove("is-active"));
					thumb.classList.add("is-active");
				}
			});
		});
	});

	// Wishlist toggle
	block.querySelectorAll(".spg__wish, .spg__card-wish-sm").forEach((btn) => {
		btn.addEventListener("click", (e) => {
			e.preventDefault();
			btn.classList.toggle("is-active");
			const svg = btn.querySelector("svg");
			if (svg) {
				svg.setAttribute(
					"fill",
					btn.classList.contains("is-active") ? "currentColor" : "none",
				);
			}
		});
	});
}

function escapeHtml(text) {
	if (!text) return "";
	const div = document.createElement("div");
	div.textContent = text;
	return div.innerHTML;
}
