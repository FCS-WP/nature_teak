import {
	useBlockProps,
	InspectorControls,
	RichText,
	URLInputButton,
} from "@wordpress/block-editor";
import {
	Notice,
	PanelBody,
	RangeControl,
	Spinner,
	ToggleControl,
} from "@wordpress/components";
import { useEffect, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps({ className: "ntfp" });
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState("");

	useEffect(() => {
		let isMounted = true;

		async function loadProducts() {
			setLoading(true);
			setLoadError("");

			const limit = Math.max(1, Math.min(8, attributes.productsToShow || 4));

			try {
				const featuredResponse = await apiFetch({
					path: `/wc/store/v1/products?featured=true&per_page=${limit}`,
				});

				const featuredProducts = Array.isArray(featuredResponse)
					? featuredResponse
					: [];

				let mergedProducts = featuredProducts;

				if (
					attributes.fallbackToLatest &&
					featuredProducts.length < limit
				) {
					const latestResponse = await apiFetch({
						path: `/ai-zippy/v1/products?per_page=${limit}&orderby=date&order=DESC`,
					});

					const latestProducts = Array.isArray(latestResponse?.products)
						? latestResponse.products
						: [];

					const usedIds = new Set(featuredProducts.map((product) => product.id));

					for (const product of latestProducts) {
						if (mergedProducts.length >= limit) {
							break;
						}

						if (!usedIds.has(product.id)) {
							mergedProducts = [...mergedProducts, product];
							usedIds.add(product.id);
						}
					}
				}

				if (isMounted) {
					setProducts(mergedProducts.slice(0, limit));
				}
			} catch (error) {
				if (isMounted) {
					setProducts([]);
					setLoadError("Could not load products preview.");
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		loadProducts();

		return () => {
			isMounted = false;
		};
	}, [attributes.productsToShow, attributes.fallbackToLatest]);

	return (
		<>
			<InspectorControls>
				<PanelBody title="Shop Button Link" initialOpen={true}>
					<URLInputButton
						url={attributes.buttonUrl}
						onChange={(value) => setAttributes({ buttonUrl: value })}
					/>
				</PanelBody>
				<PanelBody title="Products" initialOpen={false}>
					<RangeControl
						label="Products to show"
						value={attributes.productsToShow}
						onChange={(value) => setAttributes({ productsToShow: value })}
						min={1}
						max={8}
					/>
					<ToggleControl
						label="Fallback to latest products"
						checked={!!attributes.fallbackToLatest}
						onChange={(value) => setAttributes({ fallbackToLatest: value })}
						help="If there are not enough featured products, fill the remaining cards with the latest products."
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="ntfp__header">
					<div>
						<RichText
							tagName="p"
							className="ntfp__eyebrow"
							value={attributes.eyebrow}
							onChange={(value) => setAttributes({ eyebrow: value })}
							placeholder="Featured Products"
						/>
						<RichText
							tagName="h2"
							className="ntfp__title"
							value={attributes.heading}
							onChange={(value) => setAttributes({ heading: value })}
							placeholder="Popular Timber Lines"
						/>
					</div>
					<RichText
						tagName="span"
						className="ntfp__button"
						value={attributes.buttonText}
						onChange={(value) => setAttributes({ buttonText: value })}
						placeholder="Shop All"
					/>
				</div>

				{loadError ? (
					<Notice status="warning" isDismissible={false}>
						{loadError}
					</Notice>
				) : null}

				{loading ? (
					<div className="ntfp-editor__loading">
						<Spinner />
					</div>
				) : (
					<div
						className="ntfp__grid"
						style={{ gridTemplateColumns: `repeat(${Math.min(products.length || 1, 4)}, 1fr)` }}
					>
						{products.map((product) => (
							<div className="ntfp__card" key={product.id}>
								<div className="ntfp__image-wrap">
									{product.image ? (
										<img src={product.image} alt={product.name} className="ntfp__image" />
									) : (
										<div className="ntfp__placeholder">No image</div>
									)}
								</div>
								<div className="ntfp__info">
									<p className="ntfp__category">
										{product.categories?.[0]?.name || "Product"}
									</p>
									<h3 className="ntfp__card-title">{product.name}</h3>
									<p className="ntfp__spec">
										{product.short_description || "Product details"}
									</p>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</>
	);
}
