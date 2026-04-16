import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	URLInputButton,
	useSettings,
} from "@wordpress/block-editor";
import {
	BaseControl,
	Button,
	ColorPalette,
	FormTokenField,
	Notice,
	PanelBody,
	RangeControl,
	Spinner,
	TextControl,
	ToggleControl,
} from "@wordpress/components";
import { useEffect, useMemo, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

function normalizeCategoryList(values = []) {
	return [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];
}

function getActiveIncludeCategories(attributes) {
	const includeCategories = normalizeCategoryList(attributes.includeCategories);

	if (includeCategories.length > 0) {
		return includeCategories;
	}

	return attributes.category ? [attributes.category] : [];
}

function getCategoryLabel(slug, categoryMap) {
	return categoryMap.get(slug)?.label || slug;
}

function parseCategoryTokens(tokens = [], suggestionsMap) {
	return normalizeCategoryList(
		tokens.map((token) => {
			const value = String(token || "").trim();

			if (!value) {
				return "";
			}

			return suggestionsMap[value.toLowerCase()] || "";
		})
	);
}

export default function Edit({ attributes, setAttributes }) {
	const [themePalette] = useSettings("color.palette");
	const blockProps = useBlockProps({
		className: "scs",
		style: attributes.backgroundColor
			? { backgroundColor: attributes.backgroundColor }
			: undefined,
	});
	const [categories, setCategories] = useState([]);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState("");

	const categoryMap = useMemo(
		() =>
			new Map(
				categories.map((item) => [
					item.value,
					{
						label: item.label,
						value: item.value,
					},
				])
			),
		[categories]
	);

	const tokenSuggestions = useMemo(
		() =>
			categories.reduce((accumulator, item) => {
				accumulator[item.label.toLowerCase()] = item.value;
				accumulator[item.value.toLowerCase()] = item.value;
				return accumulator;
			}, {}),
		[categories]
	);

	const includeCategories = useMemo(
		() => getActiveIncludeCategories(attributes),
		[attributes.includeCategories, attributes.category]
	);

	const excludeCategories = useMemo(
		() =>
			normalizeCategoryList(attributes.excludeCategories).filter(
				(slug) => !includeCategories.includes(slug)
			),
		[attributes.excludeCategories, includeCategories]
	);

	useEffect(() => {
		apiFetch({ path: "/wc/store/v1/products/categories?per_page=100" })
			.then((data) =>
				setCategories(
					data.map((item) => ({
						label: item.name,
						value: item.slug,
					}))
				)
			)
			.catch(() => setCategories([]));
	}, []);

	useEffect(() => {
		setLoading(true);
		setLoadError("");

		const params = new URLSearchParams({
			per_page: String(Math.max(attributes.perPage || 4, 24)),
		});

		if (includeCategories.length > 0) {
			params.set("category", includeCategories.join(","));
		}

		apiFetch({ path: `/ai-zippy/v1/products?${params.toString()}` })
			.then((data) => {
				const requestedProducts = Array.isArray(data.products) ? data.products : [];
				const filteredProducts = requestedProducts.filter((product) => {
					const productCategorySlugs = Array.isArray(product.categories)
						? product.categories.map((category) => category.slug)
						: [];

					if (
						includeCategories.length > 0 &&
						!includeCategories.some((slug) => productCategorySlugs.includes(slug))
					) {
						return false;
					}

					if (
						excludeCategories.length > 0 &&
						excludeCategories.some((slug) => productCategorySlugs.includes(slug))
					) {
						return false;
					}

					return true;
				});

				setProducts(filteredProducts.slice(0, attributes.perPage || 4));
			})
			.catch(() => {
				setProducts([]);
				setLoadError(__("Could not load product preview.", "ai-zippy-child"));
			})
			.finally(() => setLoading(false));
	}, [includeCategories, excludeCategories, attributes.perPage]);

	return (
		<>
			<InspectorControls>
				<PanelBody title="Section Settings" initialOpen={true}>
					<TextControl
						label="Section Anchor ID"
						value={attributes.sectionId}
						onChange={(value) => setAttributes({ sectionId: value })}
					/>
					<ToggleControl
						label="Use Current Product Category Archive"
						checked={!!attributes.useCurrentCategory}
						onChange={(value) => setAttributes({ useCurrentCategory: value })}
						help="Use the currently viewed product category automatically. Useful in taxonomy templates."
					/>
					<FormTokenField
						label="Include Categories"
						value={includeCategories.map((slug) => getCategoryLabel(slug, categoryMap))}
						suggestions={categories.map((item) => item.label)}
						onChange={(tokens) =>
							setAttributes({
								category: "",
								includeCategories: parseCategoryTokens(tokens, tokenSuggestions),
							})
						}
						help="Only products in these categories will be shown. Leave empty to allow all categories."
						disabled={!!attributes.useCurrentCategory}
					/>
					<FormTokenField
						label="Exclude Categories"
						value={excludeCategories.map((slug) => getCategoryLabel(slug, categoryMap))}
						suggestions={categories
							.filter((item) => !includeCategories.includes(item.value))
							.map((item) => item.label)}
						onChange={(tokens) =>
							setAttributes({
								excludeCategories: parseCategoryTokens(tokens, tokenSuggestions).filter(
									(slug) => !includeCategories.includes(slug)
								),
							})
						}
						help="Hide products that belong to any of these categories."
					/>
					<RangeControl
						label="Products to show"
						value={attributes.perPage}
						onChange={(value) => setAttributes({ perPage: value })}
						min={1}
						max={12}
					/>
					<RangeControl
						label="Columns"
						value={attributes.columns}
						onChange={(value) => setAttributes({ columns: value })}
						min={2}
						max={4}
					/>
				</PanelBody>

				<PanelBody title="Colors" initialOpen={false}>
					<BaseControl
						label="Section Background Color"
						help="Choose a custom background color for this section."
					>
						<ColorPalette
							colors={themePalette || []}
							value={attributes.backgroundColor}
							onChange={(value) =>
								setAttributes({ backgroundColor: value || "" })
							}
							clearable={true}
						/>
					</BaseControl>
				</PanelBody>

				<PanelBody title="Enquire Button" initialOpen={false}>
					<TextControl
						label="Button Text"
						value={attributes.enquireText}
						onChange={(value) => setAttributes({ enquireText: value })}
					/>
					<URLInputButton
						url={attributes.enquireUrl}
						onChange={(value) => setAttributes({ enquireUrl: value })}
					/>
				</PanelBody>

				<PanelBody title="Promo Card" initialOpen={false}>
					<ToggleControl
						label="Show promo card"
						checked={attributes.showPromoCard}
						onChange={(value) => setAttributes({ showPromoCard: value })}
					/>
					{attributes.showPromoCard ? (
						<>
							<TextControl
								label="Promo Icon"
								value={attributes.promoIcon}
								onChange={(value) => setAttributes({ promoIcon: value })}
							/>
							<TextControl
								label="Promo Title"
								value={attributes.promoTitle}
								onChange={(value) => setAttributes({ promoTitle: value })}
							/>
							<TextControl
								label="Promo Text"
								value={attributes.promoText}
								onChange={(value) => setAttributes({ promoText: value })}
							/>
							<TextControl
								label="Promo Button Text"
								value={attributes.promoButtonText}
								onChange={(value) => setAttributes({ promoButtonText: value })}
							/>
							<URLInputButton
								url={attributes.promoButtonUrl}
								onChange={(value) => setAttributes({ promoButtonUrl: value })}
							/>
						</>
					) : null}
				</PanelBody>

				<PanelBody title="Bottom Banner" initialOpen={false}>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) =>
								setAttributes({
									bannerImageId: media.id,
									bannerImageUrl: media.url,
									bannerAlt: media.alt || "",
								})
							}
							allowedTypes={["image"]}
							value={attributes.bannerImageId}
							render={({ open }) => (
								<div className="scs-editor__picker">
									{attributes.bannerImageUrl ? (
										<img src={attributes.bannerImageUrl} alt="" className="scs-editor__thumb" />
									) : (
										<div className="scs-editor__thumb scs-editor__thumb--empty">No image selected</div>
									)}
									<Button variant="secondary" onClick={open}>
										{attributes.bannerImageUrl ? "Replace banner" : "Select banner"}
									</Button>
									{attributes.bannerImageUrl ? (
										<Button
											variant="link"
											isDestructive
											onClick={() =>
												setAttributes({
													bannerImageId: 0,
													bannerImageUrl: "",
													bannerAlt: "",
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
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<RichText
					tagName="h2"
					className="scs__title"
					value={attributes.heading}
					onChange={(value) => setAttributes({ heading: value })}
					placeholder="Section title"
				/>
				<RichText
					tagName="p"
					className="scs__subtitle"
					value={attributes.subtitle}
					onChange={(value) => setAttributes({ subtitle: value })}
					placeholder="Section subtitle"
				/>

				{includeCategories.length > 0 || excludeCategories.length > 0 ? (
					<div className="scs-editor__filters">
						{attributes.useCurrentCategory ? (
							<span className="scs-editor__filter-badge">
								{__("Archive:", "ai-zippy-child")} {__("Current product category", "ai-zippy-child")}
							</span>
						) : null}
						{includeCategories.length > 0 ? (
							<span className="scs-editor__filter-badge">
								{__("Include:", "ai-zippy-child")}{" "}
								{includeCategories.map((slug) => getCategoryLabel(slug, categoryMap)).join(", ")}
							</span>
						) : null}
						{excludeCategories.length > 0 ? (
							<span className="scs-editor__filter-badge scs-editor__filter-badge--muted">
								{__("Exclude:", "ai-zippy-child")}{" "}
								{excludeCategories.map((slug) => getCategoryLabel(slug, categoryMap)).join(", ")}
							</span>
						) : null}
					</div>
				) : null}

				{loadError ? <Notice status="warning" isDismissible={false}>{loadError}</Notice> : null}

				{loading ? (
					<div className="scs-editor__loading">
						<Spinner />
					</div>
				) : (
					<div
						className={`scs__grid scs__grid--cols-${attributes.columns || 4}`}
						style={{ gridTemplateColumns: `repeat(${attributes.columns || 4}, 1fr)` }}
					>
						{products.map((product) => (
							<div key={product.id} className="scs__card">
								<div className="scs__image-wrap">
									<img src={product.image} alt={product.name} className="scs__image" />
									<span className="scs__enquire">
										{attributes.enquireText || __("Enquire", "ai-zippy-child")}
									</span>
								</div>
								<div className="scs__info">
									<span className="scs__cat">
										{product.categories?.[0]?.name ||
											includeCategories[0] ||
											__("Product Category", "ai-zippy-child")}
									</span>
									<span className="scs__name">{product.name}</span>
									<span className="scs__spec">
										{product.short_description ||
											__("Product details", "ai-zippy-child")}
									</span>
								</div>
							</div>
						))}

						{attributes.showPromoCard ? (
							<div className="scs__promo">
								<p className="scs__promo-icon">{attributes.promoIcon}</p>
								<h3 className="scs__promo-title">{attributes.promoTitle}</h3>
								<p className="scs__promo-text">{attributes.promoText}</p>
								<span className="scs__promo-button">{attributes.promoButtonText}</span>
							</div>
						) : null}
					</div>
				)}

				{!loading && products.length === 0 ? (
					<div className="scs-editor__empty">
						{__("No products found for the selected category filters.", "ai-zippy-child")}
					</div>
				) : null}

				{attributes.bannerImageUrl ? (
					<div className="scs__banner-wrap">
						<img src={attributes.bannerImageUrl} alt="" className="scs__banner" />
					</div>
				) : null}
			</div>
		</>
	);
}
