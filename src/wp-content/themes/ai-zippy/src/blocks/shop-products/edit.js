import { __ } from "@wordpress/i18n";
import { useBlockProps, InspectorControls, RichText } from "@wordpress/block-editor";
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	TextControl,
	CheckboxControl,
	Spinner,
} from "@wordpress/components";
import { useEffect, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

export default function Edit({ attributes, setAttributes }) {
	const {
		heading,
		subheading,
		columns,
		perPage,
		orderby,
		categories,
		showTabs,
		showSaleBadge,
		showRating,
		showAddToCart,
		viewAllText,
		viewAllUrl,
		showViewAll,
	} = attributes;

	const [allCategories, setAllCategories] = useState([]);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);

	// Load all categories
	useEffect(() => {
		apiFetch({ path: "/wc/store/v1/products/categories?per_page=100" })
			.then((data) => setAllCategories(data))
			.catch(() => {});
	}, []);

	// Load product preview
	useEffect(() => {
		setLoading(true);
		const params = new URLSearchParams({
			per_page: perPage,
			orderby: orderby === "popularity" ? "date" : orderby,
		});
		if (categories.length === 1) {
			params.set("category", categories[0]);
		}

		apiFetch({ path: `/ai-zippy/v1/products?${params.toString()}` })
			.then((data) => setProducts(data.products || []))
			.catch(() => setProducts([]))
			.finally(() => setLoading(false));
	}, [categories, orderby, perPage]);

	const blockProps = useBlockProps();

	const toggleCategory = (slug, checked) => {
		if (checked) {
			setAttributes({ categories: [...categories, slug] });
		} else {
			setAttributes({ categories: categories.filter((c) => c !== slug) });
		}
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Layout", "ai-zippy")} initialOpen>
					<RangeControl
						label={__("Columns", "ai-zippy")}
						value={columns}
						onChange={(val) => setAttributes({ columns: val })}
						min={2}
						max={6}
					/>
					<RangeControl
						label={__("Products per page", "ai-zippy")}
						value={perPage}
						onChange={(val) => setAttributes({ perPage: val })}
						min={2}
						max={24}
					/>
					<SelectControl
						label={__("Order by", "ai-zippy")}
						value={orderby}
						options={[
							{ label: "Newest", value: "date" },
							{ label: "Price: Low to High", value: "price" },
							{ label: "Popularity", value: "popularity" },
							{ label: "Best Rating", value: "rating" },
							{ label: "Menu Order", value: "menu_order" },
						]}
						onChange={(val) => setAttributes({ orderby: val })}
					/>
				</PanelBody>

				<PanelBody title={__("Category Tabs", "ai-zippy")} initialOpen>
					<ToggleControl
						label={__("Show category tabs", "ai-zippy")}
						checked={showTabs}
						onChange={(val) => setAttributes({ showTabs: val })}
					/>
					{allCategories.length > 0 && (
						<>
							<p style={{ fontSize: "11px", color: "#757575", marginBottom: "8px" }}>
								{__("Select categories to show as tabs (empty = all):", "ai-zippy")}
							</p>
							{allCategories.map((cat) => (
								<CheckboxControl
									key={cat.id}
									label={cat.name}
									checked={categories.includes(cat.slug)}
									onChange={(checked) => toggleCategory(cat.slug, checked)}
								/>
							))}
						</>
					)}
				</PanelBody>

				<PanelBody title={__("Card Options", "ai-zippy")} initialOpen={false}>
					<ToggleControl
						label={__("Show sale badge", "ai-zippy")}
						checked={showSaleBadge}
						onChange={(val) => setAttributes({ showSaleBadge: val })}
					/>
					<ToggleControl
						label={__("Show rating", "ai-zippy")}
						checked={showRating}
						onChange={(val) => setAttributes({ showRating: val })}
					/>
					<ToggleControl
						label={__("Show Add to Cart", "ai-zippy")}
						checked={showAddToCart}
						onChange={(val) => setAttributes({ showAddToCart: val })}
					/>
				</PanelBody>

				<PanelBody title={__("View All Button", "ai-zippy")} initialOpen={false}>
					<ToggleControl
						label={__("Show View All button", "ai-zippy")}
						checked={showViewAll}
						onChange={(val) => setAttributes({ showViewAll: val })}
					/>
					{showViewAll && (
						<>
							<TextControl
								label={__("Button text", "ai-zippy")}
								value={viewAllText}
								onChange={(val) => setAttributes({ viewAllText: val })}
							/>
							<TextControl
								label={__("Button URL", "ai-zippy")}
								value={viewAllUrl}
								onChange={(val) => setAttributes({ viewAllUrl: val })}
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="sp-editor">
					{/* Heading */}
					<div className="sp-editor__header">
						<RichText
							tagName="h2"
							className="sp-editor__heading"
							value={heading}
							onChange={(val) => setAttributes({ heading: val })}
							placeholder={__("Section Title", "ai-zippy")}
						/>
						{subheading !== undefined && (
							<RichText
								tagName="p"
								className="sp-editor__subheading"
								value={subheading}
								onChange={(val) => setAttributes({ subheading: val })}
								placeholder={__("Optional subtitle…", "ai-zippy")}
							/>
						)}
					</div>

					{/* Tab preview */}
					{showTabs && allCategories.length > 0 && (
						<div className="sp-editor__tabs">
							<span className="sp-editor__tab is-active">
								{__("All", "ai-zippy")}
							</span>
							{allCategories
								.filter((c) => categories.length === 0 || categories.includes(c.slug))
								.slice(0, 6)
								.map((c) => (
									<span key={c.id} className="sp-editor__tab">
										{c.name}
									</span>
								))}
						</div>
					)}

					{/* Product grid preview */}
					{loading ? (
						<div className="sp-editor__loading">
							<Spinner />
						</div>
					) : products.length === 0 ? (
						<div className="sp-editor__empty">
							{__("No products found.", "ai-zippy")}
						</div>
					) : (
						<div
							className="sp-editor__grid"
							style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
						>
							{products.slice(0, perPage).map((p) => (
								<div key={p.id} className="sp-editor__card">
									<div className="sp-editor__card-img">
										<img src={p.image} alt={p.name} />
										{p.on_sale && showSaleBadge && (
											<span className="sp-editor__sale">Sale</span>
										)}
									</div>
									<div className="sp-editor__card-info">
										<span className="sp-editor__card-name">{p.name}</span>
										<span
											className="sp-editor__card-price"
											dangerouslySetInnerHTML={{ __html: p.price_html }}
										/>
									</div>
								</div>
							))}
						</div>
					)}

					{/* View All footer */}
					{showViewAll && viewAllText && (
						<div className="sp-editor__footer">
							<span className="sp-editor__view-all">{viewAllText} →</span>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
