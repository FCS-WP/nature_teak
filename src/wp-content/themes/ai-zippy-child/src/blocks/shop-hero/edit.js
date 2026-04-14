import { useBlockProps, InspectorControls, RichText, URLInputButton } from "@wordpress/block-editor";
import { PanelBody } from "@wordpress/components";

const FILTERS = [
	["One", "All Products"],
	["Two", "Solid Teak"],
	["Three", "WPC Composite"],
	["Four", "Handrails"],
	["Five", "Accessories"],
];

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps({ className: "sph" });

	return (
		<>
			<InspectorControls>
				<PanelBody title="Primary Button Link" initialOpen={true}>
					<URLInputButton
						url={attributes.buttonUrl}
						onChange={(value) => setAttributes({ buttonUrl: value })}
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
					{FILTERS.map(([key, placeholder], index) => (
						<RichText
							key={key}
							tagName="span"
							className={`sph__filter${index === 0 ? " is-active" : ""}`}
							value={attributes[`filter${key}Label`]}
							onChange={(value) => setAttributes({ [`filter${key}Label`]: value })}
							placeholder={placeholder}
						/>
					))}
				</div>
			</div>
		</>
	);
}
