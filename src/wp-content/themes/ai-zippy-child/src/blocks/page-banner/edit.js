import { RichText, InspectorControls, useBlockProps, useSettings } from "@wordpress/block-editor";
import { BaseControl, ColorPalette, PanelBody } from "@wordpress/components";

export default function Edit({ attributes, setAttributes }) {
	const [themePalette] = useSettings("color.palette");
	const blockProps = useBlockProps({
		className: "pbn",
		style: attributes.backgroundColor
			? { backgroundColor: attributes.backgroundColor }
			: undefined,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title="Colors" initialOpen={true}>
					<BaseControl
						label="Background Color"
						help="Choose a background color for the banner."
					>
						<ColorPalette
							colors={themePalette || []}
							value={attributes.backgroundColor}
							onChange={(value) => setAttributes({ backgroundColor: value || "" })}
							clearable={true}
						/>
					</BaseControl>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="pbn__inner">
					<RichText
						tagName="p"
						className="pbn__eyebrow"
						value={attributes.eyebrow}
						onChange={(value) => setAttributes({ eyebrow: value })}
						placeholder="Get In Touch"
					/>
					<RichText
						tagName="h1"
						className="pbn__title"
						value={attributes.heading}
						onChange={(value) => setAttributes({ heading: value })}
						placeholder="Let's Talk Timber"
					/>
					<RichText
						tagName="p"
						className="pbn__desc"
						value={attributes.description}
						onChange={(value) => setAttributes({ description: value })}
						placeholder="Supporting text"
					/>
				</div>
			</div>
		</>
	);
}
