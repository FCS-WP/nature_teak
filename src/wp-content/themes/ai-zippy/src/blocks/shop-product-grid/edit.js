import { __ } from "@wordpress/i18n";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
} from "@wordpress/components";
import { useEffect, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

export default function Edit({ attributes, setAttributes }) {
	const {
		columns,
		perPage,
		orderby,
		order,
		showSaleBadge,
		showRating,
		showAddToCart,
	} = attributes;

	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		const params = new URLSearchParams({
			per_page: perPage,
			orderby,
			order,
		});
		apiFetch({ path: `/ai-zippy/v1/products?${params.toString()}` })
			.then((data) => setProducts(data.products || []))
			.catch(() => setProducts([]))
			.finally(() => setLoading(false));
	}, [perPage, orderby, order]);

	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Layout", "ai-zippy")} initialOpen>
					<RangeControl
						label={__("Columns", "ai-zippy")}
						value={columns}
						onChange={(val) => setAttributes({ columns: val })}
						min={1}
						max={6}
					/>
					<RangeControl
						label={__("Products per page", "ai-zippy")}
						value={perPage}
						onChange={(val) => setAttributes({ perPage: val })}
						min={4}
						max={48}
					/>
					<SelectControl
						label={__("Order by", "ai-zippy")}
						value={`${orderby}-${order}`}
						options={[
							{ label: "Default", value: "menu_order-ASC" },
							{ label: "Newest", value: "date-DESC" },
							{ label: "Price: Low to High", value: "price-ASC" },
							{ label: "Price: High to Low", value: "price-DESC" },
							{ label: "Best Rating", value: "rating-DESC" },
							{ label: "Popularity", value: "popularity-DESC" },
						]}
						onChange={(val) => {
							const [ob, od] = val.split("-");
							setAttributes({ orderby: ob, order: od });
						}}
					/>
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
			</InspectorControls>

			<div {...blockProps}>
				<div className="spg-editor">
					<div className="spg-editor__toolbar">
						<span className="spg-editor__count">
							{loading
								? __("Loading...", "ai-zippy")
								: `${products.length} ${__("products", "ai-zippy")}`}
						</span>
						<span className="spg-editor__sort">{__("Sort:", "ai-zippy")} {orderby}</span>
					</div>

					{loading ? (
						<div className="spg-editor__loading">
							<span>{__("Loading products...", "ai-zippy")}</span>
						</div>
					) : products.length === 0 ? (
						<div className="spg-editor__empty">
							{__("No products found.", "ai-zippy")}
						</div>
					) : (
						<div
							className="spg-editor__grid"
							style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
						>
							{products.slice(0, perPage).map((p) => (
								<div key={p.id} className="spg-editor__card">
									<div className="spg-editor__card-img">
										<img src={p.image} alt={p.name} />
										{p.on_sale && showSaleBadge && (
											<span className="spg-editor__badge">Sale</span>
										)}
									</div>
									<div className="spg-editor__card-info">
										<span className="spg-editor__card-name">{p.name}</span>
										{p.average_rating > 0 && showRating && (
											<span className="spg-editor__card-rating">
												{"★".repeat(Math.floor(p.average_rating))}
												{p.average_rating % 1 >= 0.5 ? "½" : ""}
											</span>
										)}
										<span
											className="spg-editor__card-price"
											dangerouslySetInnerHTML={{ __html: p.price_html }}
										/>
									</div>
								</div>
							))}
						</div>
					)}

					<div className="spg-editor__pagination">
						<span className="spg-editor__page">&lsaquo; Prev</span>
						<span className="spg-editor__page is-active">1</span>
						<span className="spg-editor__page">2</span>
						<span className="spg-editor__page">Next &rsaquo;</span>
					</div>
				</div>
			</div>
		</>
	);
}
