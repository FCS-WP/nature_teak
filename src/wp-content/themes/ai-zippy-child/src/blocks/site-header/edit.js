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
} from "@wordpress/components";
import { useEffect, useMemo, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

const FALLBACK_ITEMS = [
	["home", "Home"],
	["shop", "Shop"],
	["contact", "Contact Us"],
];

export default function Edit({ attributes, setAttributes }) {
	const [themePalette] = useSettings("color.palette");
	const [menus, setMenus] = useState([]);
	const [menuItems, setMenuItems] = useState([]);
	const blockProps = useBlockProps({
		className: "nth",
		style: attributes.backgroundColor
			? { backgroundColor: attributes.backgroundColor }
			: undefined,
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
				<PanelBody title="Logo" initialOpen={true}>
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
								<div className="nth-editor__picker">
									{attributes.logoUrl ? (
										<img src={attributes.logoUrl} alt="" className="nth-editor__thumb" />
									) : (
										<div className="nth-editor__thumb nth-editor__thumb--empty">No logo selected</div>
									)}
									<Button variant="secondary" onClick={open}>
										{attributes.logoUrl ? "Replace logo" : "Select logo"}
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
						<div key={key} className="nth-editor__link-group">
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
				</PanelBody>

				<PanelBody title="Enquiry Button" initialOpen={false}>
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
				<div className="nth__inner">
					<div className="nth__brand">
						{attributes.logoUrl ? (
							<img src={attributes.logoUrl} alt="" className="nth__logo" />
						) : (
							<div className="nth__logo nth__logo--placeholder">Logo</div>
						)}
					</div>

					<div className="nth__desktop">
						<nav className="nth__nav">
							{navPreviewItems.map((item) =>
								item.key ? (
									<RichText
										key={item.id}
										tagName="span"
										className="nth__nav-link"
										value={attributes[`${item.key}Label`]}
										onChange={(value) => setAttributes({ [`${item.key}Label`]: value })}
										placeholder={item.label}
									/>
								) : (
									<span key={item.id} className="nth__nav-link">
										{item.label}
									</span>
								)
							)}
						</nav>
						<RichText
							tagName="span"
							className="nth__cta"
							value={attributes.buttonText}
							onChange={(value) => setAttributes({ buttonText: value })}
							placeholder="Enquiry Now"
						/>
					</div>

					<button type="button" className="nth__toggle" aria-expanded="false">
						<span />
						<span />
						<span />
					</button>
				</div>

				<div className="nth__offcanvas-preview">
					<p className="nth__offcanvas-title">Mobile Menu Preview</p>
					<nav className="nth__offcanvas-nav">
						{navPreviewItems.map((item) => (
							<span key={item.id} className="nth__offcanvas-link">
								{item.label}
							</span>
						))}
					</nav>
					<span className="nth__offcanvas-cta">{attributes.buttonText}</span>
				</div>
			</header>
		</>
	);
}
