document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll(".wp-block-ai-zippy-child-site-header-v2").forEach((header) => {
		const toggle = header.querySelector(".nthv2__toggle");
		const close = header.querySelector(".nthv2__close");
		const drawer = header.querySelector(".nthv2__offcanvas");
		const overlay = header.querySelector(".nthv2__overlay");
		const cartDrawer = header.querySelector(".nthv2__cart-drawer");
		const cartOverlay = header.querySelector("[data-nth-cart-overlay]");
		const cartClose = header.querySelector("[data-nth-cart-close]");
		const cartToggles = header.querySelectorAll("[data-nth-cart-toggle]");
		const desktopCartWrap = header.querySelector(".nthv2__cart-wrap");
		const cartPopover = header.querySelector("[data-nth-cart-popover]");
		const mobileActions = header.querySelector("[data-nth-mobile-actions]");
		const mobileQuery = window.matchMedia("(max-width: 1024px)");
		let noticeTimeout = null;

		if (!toggle || !close || !drawer || !overlay) {
			return;
		}

		const openMenu = () => {
			drawer.classList.add("is-open");
			drawer.setAttribute("aria-hidden", "false");
			overlay.hidden = false;
			toggle.setAttribute("aria-expanded", "true");
			document.body.style.overflow = "hidden";
		};

		const closeMenu = () => {
			drawer.classList.remove("is-open");
			drawer.setAttribute("aria-hidden", "true");
			overlay.hidden = true;
			toggle.setAttribute("aria-expanded", "false");
			document.body.style.overflow = "";
		};

		toggle.addEventListener("click", openMenu);
		close.addEventListener("click", closeMenu);
		overlay.addEventListener("click", closeMenu);

		drawer.querySelectorAll("a").forEach((link) => {
			link.addEventListener("click", closeMenu);
		});

		document.addEventListener("keydown", (event) => {
			if (event.key === "Escape" && drawer.classList.contains("is-open")) {
				closeMenu();
			}
		});

		const syncMobileActions = () => {
			if (mobileActions) {
				mobileActions.hidden = !mobileQuery.matches;
				mobileActions.style.display = mobileQuery.matches ? "" : "none";
			}
		};

		syncMobileActions();
		mobileQuery.addEventListener("change", syncMobileActions);

		const refreshCart = () => {
			if (!cartToggles.length) {
				return;
			}

			fetch("/wp-json/wc/store/v1/cart", {
				headers: {
					"Content-Type": "application/json",
					Nonce: window.wcBlocksMiddlewareConfig?.storeApiNonce || "",
				},
			})
				.then((response) => {
					refreshStoreApiNonce(response);
					return response.ok ? response.json() : null;
				})
				.then((cart) => {
					if (cart) {
						renderCart(header, cart);
					}
				})
				.catch(() => {});
		};

		const removeCartItem = (button) => {
			const key = button.dataset.nthCartRemove;
			const name = button.dataset.nthCartName || "Item";

			if (!key || button.disabled) {
				return;
			}

			button.disabled = true;
			button.classList.add("is-removing");

			fetch("/wp-json/wc/store/v1/cart/remove-item", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Nonce: window.wcBlocksMiddlewareConfig?.storeApiNonce || "",
				},
				body: JSON.stringify({ key }),
			})
				.then((response) => {
					refreshStoreApiNonce(response);
					return response.ok ? response.json() : null;
				})
				.then((cart) => {
					if (cart) {
						renderCart(header, cart);
						showCartNotice(header, `${name} removed from cart.`);
						document.body.dispatchEvent(new CustomEvent("wc-blocks_removed_from_cart"));
					} else {
						showCartNotice(header, "Could not remove item. Please try again.", "error");
						refreshCart();
					}
				})
				.catch(() => {
					button.disabled = false;
					button.classList.remove("is-removing");
					showCartNotice(header, "Could not remove item. Please try again.", "error");
				});
		};

		const showCartNotice = (target, message, type = "success") => {
			let notice = target.querySelector("[data-nth-cart-notice]");

			if (!notice) {
				notice = document.createElement("div");
				notice.className = "nthv2__cart-notice";
				notice.setAttribute("data-nth-cart-notice", "");
				notice.setAttribute("role", "status");
				notice.setAttribute("aria-live", "polite");
				target.appendChild(notice);
			}

			window.clearTimeout(noticeTimeout);
			notice.textContent = message;
			notice.classList.toggle("is-error", type === "error");
			notice.classList.add("is-visible");

			noticeTimeout = window.setTimeout(() => {
				notice.classList.remove("is-visible");
			}, 3200);
		};

		const openCart = () => {
			if (!cartDrawer || !cartOverlay) {
				return;
			}

			closeMenu();
			cartDrawer.hidden = false;
			cartDrawer.style.display = "";
			cartDrawer.classList.add("is-open");
			cartDrawer.setAttribute("aria-hidden", "false");
			cartOverlay.hidden = false;
			cartToggles.forEach((button) => button.setAttribute("aria-expanded", "true"));
			document.body.style.overflow = "hidden";
			refreshCart();
		};

		const closeCart = () => {
			if (!cartDrawer || !cartOverlay) {
				return;
			}

			cartDrawer.classList.remove("is-open");
			cartDrawer.setAttribute("aria-hidden", "true");
			cartDrawer.hidden = true;
			cartDrawer.style.display = "none";
			cartOverlay.hidden = true;
			cartToggles.forEach((button) => button.setAttribute("aria-expanded", "false"));
			desktopCartWrap?.classList.remove("is-open");
			if (cartPopover) {
				cartPopover.hidden = true;
				cartPopover.style.display = "none";
			}
			document.body.style.overflow = "";
		};

		cartToggles.forEach((button) => {
			button.addEventListener("click", () => {
				if (mobileQuery.matches) {
					openCart();
					return;
				}

				desktopCartWrap?.classList.toggle("is-open");
				if (cartPopover) {
					cartPopover.hidden = !desktopCartWrap?.classList.contains("is-open");
					cartPopover.style.display = desktopCartWrap?.classList.contains("is-open") ? "" : "none";
				}
				button.setAttribute(
					"aria-expanded",
					desktopCartWrap?.classList.contains("is-open") ? "true" : "false"
				);
				refreshCart();
			});
		});

		cartClose?.addEventListener("click", closeCart);
		cartOverlay?.addEventListener("click", closeCart);
		desktopCartWrap?.addEventListener("mouseenter", () => {
			if (cartPopover) {
				cartPopover.hidden = false;
				cartPopover.style.display = "";
				refreshCart();
			}
		});
		desktopCartWrap?.addEventListener("mouseleave", () => {
			if (cartPopover && !desktopCartWrap.classList.contains("is-open")) {
				cartPopover.hidden = true;
				cartPopover.style.display = "none";
			}
		});
		desktopCartWrap?.addEventListener("focusin", () => {
			if (cartPopover) {
				cartPopover.hidden = false;
				cartPopover.style.display = "";
				refreshCart();
			}
		});
		desktopCartWrap?.addEventListener("focusout", (event) => {
			if (
				cartPopover &&
				!desktopCartWrap.classList.contains("is-open") &&
				!desktopCartWrap.contains(event.relatedTarget)
			) {
				cartPopover.hidden = true;
				cartPopover.style.display = "none";
			}
		});

		document.addEventListener("keydown", (event) => {
			if (event.key === "Escape" && cartDrawer?.classList.contains("is-open")) {
				closeCart();
			}
		});

		document.body.addEventListener("wc-blocks_added_to_cart", () => {
			window.setTimeout(refreshCart, 80);
		});

		header.addEventListener("click", (event) => {
			const removeButton = event.target.closest("[data-nth-cart-remove]");

			if (!removeButton || !header.contains(removeButton)) {
				return;
			}

			event.preventDefault();
			removeCartItem(removeButton);
		});

		if (cartToggles.length) {
			refreshCart();
		}
	});
});

function renderCart(header, cart) {
	const count = Number(cart.items_count || 0);
	const totals = cart.totals || {};

	header.querySelectorAll("[data-nth-cart-count]").forEach((badge) => {
		badge.textContent = String(count);
	});

	header.querySelectorAll("[data-nth-cart-count-label]").forEach((label) => {
		label.textContent = count === 1 ? "1 item" : `${count} items`;
	});

	header.querySelectorAll("[data-nth-cart-total]").forEach((total) => {
		total.textContent = formatPrice(getCartSubtotal(cart), totals);
	});

	header.querySelectorAll("[data-nth-cart-panel]").forEach((panel) => {
		const content = panel.querySelector("[data-nth-cart-content]");

		if (content) {
			content.innerHTML = renderCartPanel(cart, panel.dataset);
		}
	});
}

function renderCartPanel(cart, panelData) {
	const count = Number(cart.items_count || 0);
	const totals = cart.totals || {};
	const items = Array.isArray(cart.items) ? cart.items : [];
	const cartUrl = panelData.cartUrl || "/cart";
	const checkoutUrl = panelData.checkoutUrl || "/checkout";
	const title = panelData.title || "Cart";
	const subtotal = getCartSubtotal(cart);

	const itemMarkup = items.length
		? items.map((item) => renderCartItem(item)).join("")
		: '<p class="nthv2__cart-empty">Your cart is empty.</p>';

	return `
		<div class="nthv2__cart-panel-head">
			<span>${escapeHtml(title)}</span>
			<span class="nthv2__cart-panel-count">${count === 1 ? "1 item" : `${count} items`}</span>
		</div>
		<div class="nthv2__cart-items">
			${itemMarkup}
		</div>
		<div class="nthv2__cart-footer">
			<div class="nthv2__cart-total">
				<span>Subtotal:</span>
				<strong>${escapeHtml(formatPrice(subtotal, totals))}</strong>
			</div>
			<div class="nthv2__cart-actions">
				<a class="nthv2__cart-link" href="${escapeAttribute(cartUrl)}">View cart</a>
				<a class="nthv2__cart-checkout" href="${escapeAttribute(checkoutUrl)}">Checkout</a>
			</div>
		</div>
	`;
}

function renderCartItem(item) {
	const quantity = Number(item.quantity || 1);
	const image = item.images?.[0]?.thumbnail || item.images?.[0]?.src || "";
	const itemPriceValue = getItemUnitPrice(item);
	const itemPrice = itemPriceValue ? formatPrice(itemPriceValue, item.prices || {}) : "";
	const meta = itemPrice ? `${quantity} x ${itemPrice}` : `x${quantity}`;
	const name = decodeHtml(item.name || "Product");
	const key = item.key || "";

	return `
		<div class="nthv2__cart-item">
			${image ? `<img class="nthv2__cart-item-image" src="${escapeAttribute(image)}" alt="">` : '<span class="nthv2__cart-item-image nthv2__cart-item-image--empty"></span>'}
			<div class="nthv2__cart-item-body">
				<span class="nthv2__cart-item-name">${escapeHtml(name)}</span>
				<span class="nthv2__cart-item-meta">${escapeHtml(meta)}</span>
			</div>
			<button type="button" class="nthv2__cart-item-remove" data-nth-cart-remove="${escapeAttribute(key)}" data-nth-cart-name="${escapeAttribute(name)}" aria-label="Remove ${escapeAttribute(name)}">x</button>
		</div>
	`;
}

function formatPrice(value, totals) {
	const minorUnit = Number(totals.currency_minor_unit ?? 2);
	const amount = Number(value || 0) / 10 ** minorUnit;
	const formatted = amount.toLocaleString(undefined, {
		minimumFractionDigits: minorUnit,
		maximumFractionDigits: minorUnit,
	});

	return `${totals.currency_prefix || totals.currency_symbol || ""}${formatted}${totals.currency_suffix || ""}`;
}

function getCartSubtotal(cart) {
	const totals = cart.totals || {};
	const subtotal = firstPositiveValue(totals.total_items, totals.total_price);

	if (subtotal) {
		return subtotal;
	}

	const items = Array.isArray(cart.items) ? cart.items : [];
	const itemSubtotal = items.reduce((sum, item) => {
		const quantity = Number(item.quantity || 1);
		const lineTotal = firstPositiveValue(
			item.totals?.line_subtotal,
			item.totals?.line_total,
			item.totals?.line_subtotal_tax,
			item.totals?.line_total_tax
		);

		if (lineTotal) {
			return sum + Number(lineTotal);
		}

		return sum + Number(getItemUnitPrice(item) || 0) * quantity;
	}, 0);

	return itemSubtotal > 0 ? String(itemSubtotal) : "0";
}

function getItemUnitPrice(item) {
	const unitPrice = firstPositiveValue(
		item.prices?.price,
		item.prices?.sale_price,
		item.prices?.regular_price
	);

	if (unitPrice) {
		return unitPrice;
	}

	const quantity = Math.max(Number(item.quantity || 1), 1);
	const lineTotal = firstPositiveValue(item.totals?.line_subtotal, item.totals?.line_total);

	return lineTotal ? String(Math.round(Number(lineTotal) / quantity)) : "";
}

function firstPositiveValue(...values) {
	for (const value of values) {
		const number = Number(value || 0);

		if (number > 0) {
			return String(value);
		}
	}

	return "";
}

function refreshStoreApiNonce(response) {
	const nonce = response.headers.get("Nonce");

	if (nonce && window.wcBlocksMiddlewareConfig) {
		window.wcBlocksMiddlewareConfig.storeApiNonce = nonce;
	}
}

function escapeHtml(value) {
	const div = document.createElement("div");
	div.textContent = value;
	return div.innerHTML;
}

function decodeHtml(value) {
	const textarea = document.createElement("textarea");
	textarea.innerHTML = String(value || "");
	return textarea.value;
}

function escapeAttribute(value) {
	return escapeHtml(String(value || "")).replace(/"/g, "&quot;");
}
