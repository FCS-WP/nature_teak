import { __ } from "@wordpress/i18n";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, ToggleControl, SelectControl } from "@wordpress/components";

export default function Edit({ attributes, setAttributes }) {
	const {
		showSearch,
		showCategories,
		showPrice,
		showBrands,
		showTags,
		showAttributes,
		showStock,
		layout,
	} = attributes;

	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Filter Sections", "ai-zippy")} initialOpen>
					<ToggleControl
						label={__("Show Search", "ai-zippy")}
						checked={showSearch}
						onChange={(val) => setAttributes({ showSearch: val })}
					/>
					<ToggleControl
						label={__("Show Categories", "ai-zippy")}
						checked={showCategories}
						onChange={(val) => setAttributes({ showCategories: val })}
					/>
					<ToggleControl
						label={__("Show Price Range", "ai-zippy")}
						checked={showPrice}
						onChange={(val) => setAttributes({ showPrice: val })}
					/>
					<ToggleControl
						label={__("Show Brands", "ai-zippy")}
						checked={showBrands}
						onChange={(val) => setAttributes({ showBrands: val })}
					/>
					<ToggleControl
						label={__("Show Tags", "ai-zippy")}
						checked={showTags}
						onChange={(val) => setAttributes({ showTags: val })}
					/>
					<ToggleControl
						label={__("Show Attributes", "ai-zippy")}
						checked={showAttributes}
						onChange={(val) => setAttributes({ showAttributes: val })}
					/>
					<ToggleControl
						label={__("Show Stock Status", "ai-zippy")}
						checked={showStock}
						onChange={(val) => setAttributes({ showStock: val })}
					/>
				</PanelBody>

				<PanelBody title={__("Layout", "ai-zippy")} initialOpen={false}>
					<SelectControl
						label={__("Filter Layout", "ai-zippy")}
						value={layout}
						options={[
							{ label: "Sidebar", value: "sidebar" },
							{ label: "Top Bar", value: "top" },
						]}
						onChange={(val) => setAttributes({ layout: val })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="spf-editor">
					<div className="spf-editor__header">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<line x1="4" y1="6" x2="20" y2="6" />
							<line x1="4" y1="12" x2="16" y2="12" />
							<line x1="4" y1="18" x2="12" y2="18" />
						</svg>
						<span>{__("Product Filters", "ai-zippy")}</span>
					</div>

					<div className="spf-editor__sections">
						{showSearch && (
							<div className="spf-editor__section">
								<span className="spf-editor__section-title">
									{__("Search", "ai-zippy")}
								</span>
								<div className="spf-editor__input-preview">
									{__("Search name or SKU...", "ai-zippy")}
								</div>
							</div>
						)}

						{showCategories && (
							<div className="spf-editor__section">
								<span className="spf-editor__section-title">
									{__("Categories", "ai-zippy")}
								</span>
								<div className="spf-editor__checkboxes">
									<span>Category 1</span>
									<span>Category 2</span>
									<span>Category 3</span>
								</div>
							</div>
						)}

						{showPrice && (
							<div className="spf-editor__section">
								<span className="spf-editor__section-title">
									{__("Price", "ai-zippy")}
								</span>
								<div className="spf-editor__price-preview">
									$0 — $1000
								</div>
							</div>
						)}

						{showBrands && (
							<div className="spf-editor__section">
								<span className="spf-editor__section-title">
									{__("Brands", "ai-zippy")}
								</span>
								<div className="spf-editor__checkboxes">
									<span>Brand A</span>
									<span>Brand B</span>
								</div>
							</div>
						)}

						{showTags && (
							<div className="spf-editor__section">
								<span className="spf-editor__section-title">
									{__("Tags", "ai-zippy")}
								</span>
								<div className="spf-editor__checkboxes">
									<span>Tag 1</span>
									<span>Tag 2</span>
								</div>
							</div>
						)}

						{showAttributes && (
							<div className="spf-editor__section">
								<span className="spf-editor__section-title">
									{__("Attributes", "ai-zippy")}
								</span>
								<div className="spf-editor__checkboxes">
									<span>Color: Red, Blue</span>
									<span>Size: S, M, L</span>
								</div>
							</div>
						)}

						{showStock && (
							<div className="spf-editor__section">
								<span className="spf-editor__section-title">
									{__("Availability", "ai-zippy")}
								</span>
								<div className="spf-editor__checkboxes">
									<span>In Stock</span>
									<span>Out of Stock</span>
								</div>
							</div>
						)}
					</div>

					<div className="spf-editor__hint">
						{__(
							"Place this block next to the Shop Product Grid block.",
							"ai-zippy"
						)}
					</div>
				</div>
			</div>
		</>
	);
}
