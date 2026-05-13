/**
 * Frontend script for Shop Products block.
 * Handles: category tab switching, gallery thumbnail hover, wishlist toggle.
 */

document.addEventListener("DOMContentLoaded", () => {
	document
		.querySelectorAll(".wp-block-ai-zippy-shop-products")
		.forEach(initShopProducts);
});

function initShopProducts(block) {
	initTabs(block);
	initThumbnails(block);
	initWishlist(block);
}

// ---- Category tabs ----
function initTabs(block) {
	const tabs   = block.querySelectorAll(".sp__tab");
	const panels = block.querySelectorAll(".sp__panel");

	if (tabs.length === 0) return;

	tabs.forEach((tab) => {
		tab.addEventListener("click", () => {
			const target = tab.dataset.tab;

			// Update active tab
			tabs.forEach((t) => {
				t.classList.remove("is-active");
				t.setAttribute("aria-selected", "false");
			});
			tab.classList.add("is-active");
			tab.setAttribute("aria-selected", "true");

			// Show matching panel
			panels.forEach((panel) => {
				const match = panel.dataset.panel === target;
				panel.classList.toggle("is-active", match);
			});
		});
	});
}

// ---- Gallery thumbnail hover ----
function initThumbnails(block) {
	block.querySelectorAll(".sp__card").forEach((card) => {
		const images  = JSON.parse(card.dataset.images || "[]");
		const mainImg = card.querySelector(".sp__card-img");
		const thumbs  = card.querySelectorAll(".sp__thumb[data-index]");

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
}

// ---- Wishlist toggle ----
function initWishlist(block) {
	block.querySelectorAll(".sp__wish, .sp__card-wish-sm").forEach((btn) => {
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
