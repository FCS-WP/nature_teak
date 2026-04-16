import { useBlockProps, InspectorControls, RichText, URLInputButton } from "@wordpress/block-editor";
import { FormTokenField, PanelBody, TextControl, ToggleControl } from "@wordpress/components";
import { useEffect, useMemo, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

const FILTERS = [
	["One", "All Products"],
	["Two", "Solid Teak"],
	["Three", "WPC Composite"],
	["Four", "Handrails"],
	["Five", "Accessories"],
];

function normalizeCategoryList(values = []) {
	return [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];
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
	const blockProps = useBlockProps({ className: "sph" });
	const [categories, setCategories] = useState([]);

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

	const includeCategories = normalizeCategoryList(attributes.includeCategories);
	const excludeCategories = normalizeCategoryList(attributes.excludeCategories).filter(
		(slug) => !includeCategories.includes(slug)
	);
	const previewCategories = categories.filter((item) => {
		if (includeCategories.length > 0 && !includeCategories.includes(item.value)) {
			return false;
		}

		if (excludeCategories.includes(item.value)) {
			return false;
		}

		return true;
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title="Primary Button Link" initialOpen={true}>
					<URLInputButton
						url={attributes.buttonUrl}
						onChange={(value) => setAttributes({ buttonUrl: value })}
					/>
				</PanelBody>
				<PanelBody title="Category Filters" initialOpen={false}>
					<ToggleControl
						label="Use existing product categories"
						checked={!!attributes.useAutoCategories}
						onChange={(value) => setAttributes({ useAutoCategories: value })}
						help="Generate the filter pills from WooCommerce product categories."
					/>
					<ToggleControl
						label='Show "All Products" filter'
						checked={!!attributes.showAllProductsFilter}
						onChange={(value) => setAttributes({ showAllProductsFilter: value })}
					/>
					<TextControl
						label='"All Products" Label'
						value={attributes.allProductsLabel}
						onChange={(value) => setAttributes({ allProductsLabel: value })}
					/>
					<URLInputButton
						url={attributes.allProductsUrl}
						onChange={(value) => setAttributes({ allProductsUrl: value })}
					/>
					<FormTokenField
						label="Include Categories"
						value={includeCategories.map((slug) => getCategoryLabel(slug, categoryMap))}
						suggestions={categories.map((item) => item.label)}
						onChange={(tokens) =>
							setAttributes({
								includeCategories: parseCategoryTokens(tokens, tokenSuggestions),
							})
						}
						help="Leave empty to use all existing categories."
						disabled={!attributes.useAutoCategories}
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
						disabled={!attributes.useAutoCategories}
					/>
				</PanelBody>
				<PanelBody title="Filter Links" initialOpen={false}>
					{FILTERS.map(([key]) => (
						<URLInputButton
							key={key}
							url={attributes[`filter${key}Url`]}
							onChange={(value) => setAttributes({ [`filter${key}Url`]: value })}
						/>
					))}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="sph__header">
					<div>
						<RichText
							tagName="h1"
							className="sph__title"
							value={attributes.title}
							onChange={(value) => setAttributes({ title: value })}
							placeholder="Our Products"
						/>
						<RichText
							tagName="p"
							className="sph__subtitle"
							value={attributes.subtitle}
							onChange={(value) => setAttributes({ subtitle: value })}
							placeholder="Shop subtitle"
						/>
					</div>
					<RichText
						tagName="span"
						className="sph__button"
						value={attributes.buttonText}
						onChange={(value) => setAttributes({ buttonText: value })}
						placeholder="Request B2B Pricing"
					/>
				</div>

				<div className="sph__filters">
					{attributes.useAutoCategories ? (
						<>
							{attributes.showAllProductsFilter ? (
								<RichText
									tagName="span"
									className="sph__filter is-active"
									value={attributes.allProductsLabel}
									onChange={(value) => setAttributes({ allProductsLabel: value })}
									placeholder="All Products"
								/>
							) : null}
							{previewCategories.map((category) => (
								<span key={category.value} className="sph__filter">
									{category.label}
								</span>
							))}
						</>
					) : (
						FILTERS.map(([key, placeholder], index) => (
							<RichText
								key={key}
								tagName="span"
								className={`sph__filter${index === 0 ? " is-active" : ""}`}
								value={attributes[`filter${key}Label`]}
								onChange={(value) => setAttributes({ [`filter${key}Label`]: value })}
								placeholder={placeholder}
							/>
						))
					)}
				</div>
			</div>
		</>
	);
}
