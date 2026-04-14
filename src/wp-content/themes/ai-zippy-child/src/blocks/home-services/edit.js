import { useBlockProps, InspectorControls, RichText, URLInputButton } from "@wordpress/block-editor";
import { PanelBody } from "@wordpress/components";

const CARDS = [
	["cardOne", "Raw Teak Supply"],
	["cardTwo", "Custom Milling & Cutting"],
	["cardThree", "Decking & Flooring"],
	["cardFour", "B2B Wholesale"],
	["cardFive", "Wood Grading"],
	["cardSix", "Regional Distribution"],
];

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps({ className: "nts" });

	return (
		<>
			<InspectorControls>
				<PanelBody title="Button Link" initialOpen={true}>
					<URLInputButton
						url={attributes.buttonUrl}
						onChange={(value) => setAttributes({ buttonUrl: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="nts__header">
					<div>
						<RichText
							tagName="p"
							className="nts__eyebrow"
							value={attributes.eyebrow}
							onChange={(value) => setAttributes({ eyebrow: value })}
							placeholder="What We Offer"
						/>
						<RichText
							tagName="h2"
							className="nts__title"
							value={attributes.heading}
							onChange={(value) => setAttributes({ heading: value })}
							placeholder="Our Core Services"
						/>
					</div>
					<RichText
						tagName="span"
						className="nts__button"
						value={attributes.buttonText}
						onChange={(value) => setAttributes({ buttonText: value })}
						placeholder="View All Products"
					/>
				</div>

				<div className="nts__grid">
					{CARDS.map(([prefix, placeholder]) => (
						<div className="nts__card" key={prefix}>
							<RichText
								tagName="p"
								className="nts__icon"
								value={attributes[`${prefix}Icon`]}
								onChange={(value) => setAttributes({ [`${prefix}Icon`]: value })}
								placeholder="Icon"
							/>
							<RichText
								tagName="h3"
								className="nts__card-title"
								value={attributes[`${prefix}Title`]}
								onChange={(value) => setAttributes({ [`${prefix}Title`]: value })}
								placeholder={placeholder}
							/>
							<RichText
								tagName="p"
								className="nts__card-text"
								value={attributes[`${prefix}Text`]}
								onChange={(value) => setAttributes({ [`${prefix}Text`]: value })}
								placeholder="Card description"
							/>
						</div>
					))}
				</div>
			</div>
		</>
	);
}
