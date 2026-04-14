import { useBlockProps, InspectorControls, RichText, URLInputButton } from "@wordpress/block-editor";
import { PanelBody } from "@wordpress/components";

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps({ className: "ntc" });

	return (
		<>
			<InspectorControls>
				<PanelBody title="CTA Link" initialOpen={true}>
					<URLInputButton
						url={attributes.buttonUrl}
						onChange={(value) => setAttributes({ buttonUrl: value })}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<div>
					<RichText tagName="h2" className="ntc__title" value={attributes.heading} onChange={(value) => setAttributes({ heading: value })} placeholder="CTA heading" />
					<RichText tagName="p" className="ntc__body" value={attributes.description} onChange={(value) => setAttributes({ description: value })} placeholder="CTA description" />
				</div>
				<RichText tagName="span" className="ntc__button" value={attributes.buttonText} onChange={(value) => setAttributes({ buttonText: value })} placeholder="Contact Us Today" />
			</div>
		</>
	);
}
