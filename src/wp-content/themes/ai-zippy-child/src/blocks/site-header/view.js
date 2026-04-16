document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll(".wp-block-ai-zippy-child-site-header").forEach((header) => {
		const toggle = header.querySelector(".nth__toggle");
		const close = header.querySelector(".nth__close");
		const drawer = header.querySelector(".nth__offcanvas");
		const overlay = header.querySelector(".nth__overlay");

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
	});
});
