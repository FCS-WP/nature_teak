import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	URLInputButton,
	useBlockProps,
	useSettings,
} from "@wordpress/block-editor";
import {
	BaseControl,
	Button,
	ColorPalette,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from "@wordpress/components";
import { useEffect, useMemo, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

const FALLBACK_ITEMS = [
	["shop", "Shop"],
	["gift", "Gift"],
	["bestsellers", "Bestsellers"],
	["sale", "Sale"],
	["corporate", "Corporate/Wholesale"],
	["story", "Our Story"],
];

function SearchIcon({ iconUrl = "", iconAlt = "Search" }) {
	if (iconUrl) {
		return <img className="nthv2__icon-img" src={iconUrl} alt={iconAlt} />;
	}

	return (
		<svg className="nthv2__icon-svg" width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
			<path d="m20 20-4.35-4.35" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
			<circle cx="10.8" cy="10.8" r="6.4" fill="none" stroke="currentColor" strokeWidth="2.2" />
		</svg>
	);
}

function HeartIcon({ iconUrl = "", iconAlt = "Wishlist" }) {
	if (iconUrl) {
		return <img className="nthv2__icon-img" src={iconUrl} alt={iconAlt} />;
	}

	return (
		<svg className="nthv2__icon-svg" width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
			<path d="M12 20.3s-7.2-4.35-8.85-9.05C1.92 7.78 4.1 4.8 7.45 4.8c1.85 0 3.25 1.02 4.05 2.2.8-1.18 2.2-2.2 4.05-2.2 3.35 0 5.53 2.98 4.3 6.45C18.2 15.95 12 20.3 12 20.3Z" fill="none" stroke="currentColor" strokeWidth="2.05" strokeLinejoin="round" />
		</svg>
	);
}

function CartIcon({ iconUrl = "", iconAlt = "Cart" }) {
	return (
		<span className="nthv2__cart-button">
			{iconUrl ? (
				<img className="nthv2__icon-img" src={iconUrl} alt={iconAlt} />
			) : (
				<svg className="nthv2__icon-svg nthv2__cart-svg" width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
					<path d="M6 6h2.1l1.3 8.2h7.2l1.55-5.55H9.05" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
					<circle cx="10.35" cy="19" r="1.35" fill="currentColor" />
					<circle cx="17" cy="19" r="1.35" fill="currentColor" />
				</svg>
			)}
			<span className="nthv2__cart-count">2</span>
		</span>
	);
}

function BrandText({ value, onChange }) {
	return (
		<RichText
			tagName="span"
			className="nthv2__brand-text"
			value={value}
			onChange={onChange}
			placeholder="Tom & Stefanie"
		/>
	);
}

function ActionIconUpload({ label, idAttribute, urlAttribute, altAttribute, attributes, setAttributes }) {
	const iconUrl = attributes[urlAttribute];

	return (
		<div className="nthv2-editor__icon-control">
			<p className="nthv2-editor__control-label">{label}</p>
			<MediaUploadCheck>
				<MediaUpload
					onSelect={(media) =>
						setAttributes({
							[idAttribute]: media.id,
							[urlAttribute]: media.url,
							[altAttribute]: media.alt || label,
						})
					}
					allowedTypes={["image"]}
					value={attributes[idAttribute]}
					render={({ open }) => (
						<div className="nthv2-editor__icon-picker">
							{iconUrl ? (
								<img src={iconUrl} alt="" className="nthv2-editor__icon-thumb" />
							) : (
								<div className="nthv2-editor__icon-thumb nthv2-editor__icon-thumb--empty">Default</div>
							)}
							<Button variant="secondary" onClick={open}>
								{iconUrl ? "Replace icon" : "Select icon"}
							</Button>
							{iconUrl ? (
								<Button
									variant="link"
									isDestructive
									onClick={() =>
										setAttributes({
											[idAttribute]: 0,
											[urlAttribute]: "",
											[altAttribute]: label,
										})
									}
								>
									Remove
								</Button>
							) : null}
						</div>
					)}
				/>
			</MediaUploadCheck>
			<TextControl
				label={`${label} Alt Text`}
				value={attributes[altAttribute]}
				onChange={(value) => setAttributes({ [altAttribute]: value })}
			/>
		</div>
	);
}

export default function Edit({ attributes, setAttributes }) {
	const [themePalette] = useSettings("color.palette");
	const [menus, setMenus] = useState([]);
	const [menuItems, setMenuItems] = useState([]);
	const blockStyle = {};

	if (attributes.backgroundColor) {
		blockStyle.backgroundColor = attributes.backgroundColor;
	}

	if (attributes.buttonColor) {
		blockStyle["--nthv2-button-color"] = attributes.buttonColor;
	}

	if (attributes.buttonHoverColor) {
		blockStyle["--nthv2-button-hover-color"] = attributes.buttonHoverColor;
	}

	if (attributes.badgeColor) {
		blockStyle["--nthv2-badge-color"] = attributes.badgeColor;
	}

	if (attributes.actionIconColor) {
		blockStyle["--nthv2-action-icon-color"] = attributes.actionIconColor;
	}

	if (attributes.actionIconHoverColor) {
		blockStyle["--nthv2-action-icon-hover-color"] = attributes.actionIconHoverColor;
	}

	const blockProps = useBlockProps({
		className: "nthv2",
		style: Object.keys(blockStyle).length ? blockStyle : undefined,
	});

	useEffect(() => {
		apiFetch({ path: "/ai-zippy-child/v1/menus" })
			.then((data) => setMenus(Array.isArray(data) ? data : []))
			.catch(() => setMenus([]));
	}, []);

	useEffect(() => {
		if (!attributes.menuId) {
			setMenuItems([]);
			return;
		}

		apiFetch({ path: `/ai-zippy-child/v1/menus/${attributes.menuId}/items` })
			.then((data) => setMenuItems(Array.isArray(data) ? data : []))
			.catch(() => setMenuItems([]));
	}, [attributes.menuId]);

	const navPreviewItems = useMemo(() => {
		if (attributes.menuId && menuItems.length > 0) {
			return menuItems
				.filter((item) => !Number(item.parent))
				.map((item) => ({
					id: item.id,
					label: item.label || "Menu Item",
				}));
		}

		return FALLBACK_ITEMS.map(([key, placeholder]) => ({
			id: key,
			key,
			label: attributes[`${key}Label`] || placeholder,
		}));
	}, [attributes, menuItems]);

	return (
		<>
			<InspectorControls>
				<PanelBody title="Brand" initialOpen={true}>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) =>
								setAttributes({
									logoId: media.id,
									logoUrl: media.url,
									logoAlt: media.alt || attributes.logoAlt,
								})
							}
							allowedTypes={["image"]}
							value={attributes.logoId}
							render={({ open }) => (
								<div className="nthv2-editor__picker">
									{attributes.logoUrl ? (
										<img src={attributes.logoUrl} alt="" className="nthv2-editor__thumb" />
									) : (
										<div className="nthv2-editor__thumb nthv2-editor__thumb--empty">Text logo active</div>
									)}
									<Button variant="secondary" onClick={open}>
										{attributes.logoUrl ? "Replace logo" : "Select image logo"}
									</Button>
									{attributes.logoUrl ? (
										<Button
											variant="link"
											isDestructive
											onClick={() => setAttributes({ logoId: 0, logoUrl: "" })}
										>
											Remove
										</Button>
									) : null}
								</div>
							)}
						/>
					</MediaUploadCheck>
					<TextControl
						label="Text Logo"
						value={attributes.brandText}
						onChange={(value) => setAttributes({ brandText: value })}
					/>
					<TextControl
						label="Logo Alt Text"
						value={attributes.logoAlt}
						onChange={(value) => setAttributes({ logoAlt: value })}
					/>
				</PanelBody>

				<PanelBody title="Menu" initialOpen={true}>
					<SelectControl
						label="WordPress Menu"
						value={String(attributes.menuId || 0)}
						options={[
							{ label: "Use fallback links", value: "0" },
							...menus.map((menu) => ({
								label: menu.name,
								value: String(menu.id),
							})),
						]}
						onChange={(value) => setAttributes({ menuId: Number(value) })}
						help="Select a WordPress menu. If none is selected, the fallback links below are used."
					/>
				</PanelBody>

				<PanelBody title="Fallback Links" initialOpen={false}>
					{FALLBACK_ITEMS.map(([key, placeholder]) => (
						<div key={key} className="nthv2-editor__link-group">
							<TextControl
								label={`${placeholder} Label`}
								value={attributes[`${key}Label`]}
								onChange={(value) => setAttributes({ [`${key}Label`]: value })}
							/>
							<URLInputButton
								url={attributes[`${key}Url`]}
								onChange={(value) => setAttributes({ [`${key}Url`]: value })}
							/>
						</div>
					))}
				</PanelBody>

				<PanelBody title="Colors" initialOpen={false}>
					<BaseControl label="Header Background">
						<ColorPalette
							colors={themePalette || []}
							value={attributes.backgroundColor}
							onChange={(value) => setAttributes({ backgroundColor: value || "" })}
							clearable={true}
						/>
					</BaseControl>
					<BaseControl label="Button Color">
						<ColorPalette
							colors={themePalette || []}
							value={attributes.buttonColor}
							onChange={(value) => setAttributes({ buttonColor: value || "" })}
							clearable={true}
						/>
					</BaseControl>
					<BaseControl label="Button Hover Color">
						<ColorPalette
							colors={themePalette || []}
							value={attributes.buttonHoverColor}
							onChange={(value) => setAttributes({ buttonHoverColor: value || "" })}
							clearable={true}
						/>
					</BaseControl>
					<BaseControl label="Cart Badge Color">
						<ColorPalette
							colors={themePalette || []}
							value={attributes.badgeColor}
							onChange={(value) => setAttributes({ badgeColor: value || "" })}
							clearable={true}
						/>
					</BaseControl>
					<BaseControl label="Action Icon Color">
						<ColorPalette
							colors={themePalette || []}
							value={attributes.actionIconColor}
							onChange={(value) => setAttributes({ actionIconColor: value || "" })}
							clearable={true}
						/>
					</BaseControl>
					<BaseControl label="Action Icon Hover Color">
						<ColorPalette
							colors={themePalette || []}
							value={attributes.actionIconHoverColor}
							onChange={(value) => setAttributes({ actionIconHoverColor: value || "" })}
							clearable={true}
						/>
					</BaseControl>
				</PanelBody>

				<PanelBody title="Action Icons" initialOpen={false}>
					<ActionIconUpload
						label="Search Icon"
						idAttribute="searchIconId"
						urlAttribute="searchIconUrl"
						altAttribute="searchIconAlt"
						attributes={attributes}
						setAttributes={setAttributes}
					/>
					<ActionIconUpload
						label="Wishlist Icon"
						idAttribute="wishlistIconId"
						urlAttribute="wishlistIconUrl"
						altAttribute="wishlistIconAlt"
						attributes={attributes}
						setAttributes={setAttributes}
					/>
					<ActionIconUpload
						label="Cart Icon"
						idAttribute="cartIconId"
						urlAttribute="cartIconUrl"
						altAttribute="cartIconAlt"
						attributes={attributes}
						setAttributes={setAttributes}
					/>
				</PanelBody>

				<PanelBody title="Header Actions" initialOpen={false}>
					<ToggleControl
						label="Show search"
						checked={!!attributes.showSearch}
						onChange={(value) => setAttributes({ showSearch: value })}
					/>
					<URLInputButton
						url={attributes.searchUrl}
						onChange={(value) => setAttributes({ searchUrl: value })}
					/>
					<ToggleControl
						label="Show wishlist"
						checked={!!attributes.showWishlist}
						onChange={(value) => setAttributes({ showWishlist: value })}
					/>
					<URLInputButton
						url={attributes.wishlistUrl}
						onChange={(value) => setAttributes({ wishlistUrl: value })}
					/>
					<ToggleControl
						label="Show cart"
						checked={!!attributes.showMiniCart}
						onChange={(value) => setAttributes({ showMiniCart: value })}
					/>
					<URLInputButton
						url={attributes.cartUrl}
						onChange={(value) => setAttributes({ cartUrl: value })}
					/>
					<TextControl
						label="Button Text"
						value={attributes.buttonText}
						onChange={(value) => setAttributes({ buttonText: value })}
					/>
					<URLInputButton
						url={attributes.buttonUrl}
						onChange={(value) => setAttributes({ buttonUrl: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<header {...blockProps}>
				<div className="nthv2__inner">
					<div className="nthv2__brand">
						{attributes.logoUrl ? (
							<img src={attributes.logoUrl} alt="" className="nthv2__logo" />
						) : (
							<BrandText
								value={attributes.brandText}
								onChange={(value) => setAttributes({ brandText: value })}
							/>
						)}
					</div>

					<div className="nthv2__desktop">
						<nav className="nthv2__nav">
							{navPreviewItems.map((item) =>
								item.key ? (
									<RichText
										key={item.id}
										tagName="span"
										className="nthv2__nav-link"
										value={attributes[`${item.key}Label`]}
										onChange={(value) => setAttributes({ [`${item.key}Label`]: value })}
										placeholder={item.label}
									/>
								) : (
									<span key={item.id} className="nthv2__nav-link">
										{item.label}
									</span>
								)
							)}
						</nav>

						<div className="nthv2__actions">
							{attributes.showSearch ? (
								<span className="nthv2__icon-link" aria-label="Search">
									<SearchIcon iconUrl={attributes.searchIconUrl} iconAlt={attributes.searchIconAlt} />
								</span>
							) : null}
							{attributes.showWishlist ? (
								<span className="nthv2__icon-link" aria-label="Wishlist">
									<HeartIcon iconUrl={attributes.wishlistIconUrl} iconAlt={attributes.wishlistIconAlt} />
								</span>
							) : null}
							{attributes.showMiniCart ? (
								<span className="nthv2__icon-link" aria-label="Cart">
									<CartIcon iconUrl={attributes.cartIconUrl} iconAlt={attributes.cartIconAlt} />
								</span>
							) : null}
							<RichText
								tagName="span"
								className="nthv2__cta"
								value={attributes.buttonText}
								onChange={(value) => setAttributes({ buttonText: value })}
								placeholder="Shop Now"
							/>
						</div>
					</div>

					<div className="nthv2__mobile-actions">
						{attributes.showSearch ? (
							<span className="nthv2__icon-link" aria-label="Search">
								<SearchIcon iconUrl={attributes.searchIconUrl} iconAlt={attributes.searchIconAlt} />
							</span>
						) : null}
						<button type="button" className="nthv2__toggle" aria-expanded="false">
							<span />
							<span />
							<span />
						</button>
					</div>
				</div>

				<div className="nthv2__offcanvas-preview">
					<p className="nthv2__offcanvas-title">Mobile Menu Preview</p>
					<nav className="nthv2__offcanvas-nav">
						{navPreviewItems.map((item) => (
							<span key={item.id} className="nthv2__offcanvas-link">
								{item.label}
							</span>
						))}
					</nav>
					<span className="nthv2__offcanvas-cta">{attributes.buttonText}</span>
				</div>
			</header>
		</>
	);
}
