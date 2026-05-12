document.addEventListener("click", (event) => {
	const action = event.target.closest(".scs__action--cart");

	if (!action) {
		return;
	}

	const card = action.closest(".scs__card");

	if (!card) {
		return;
	}

	card.classList.remove("is-cart-added");

	const observer = new MutationObserver(() => {
		if (!action.classList.contains("is-added")) {
			return;
		}

		card.classList.add("is-cart-added");
		observer.disconnect();
	});

	observer.observe(action, {
		attributes: true,
		attributeFilter: ["class"],
	});

	window.setTimeout(() => observer.disconnect(), 5000);
});
