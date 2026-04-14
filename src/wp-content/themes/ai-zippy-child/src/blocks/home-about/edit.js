import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
} from "@wordpress/block-editor";
import { PanelBody, Button, TextControl } from "@wordpress/components";

const FEATURES = [
	["featureOne", "Feature one"],
	["featureTwo", "Feature two"],
	["featureThree", "Feature three"],
	["featureFour", "Feature four"],
];

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps({ className: "nta" });
	const {
		imageId,
		imageUrl,
		imageCaption,
		eyebrow,
		heading,
		description,
	} = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title="Section Image" initialOpen={true}>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) =>
								setAttributes({ imageId: media.id, imageUrl: media.url })
							}
							allowedTypes={["image"]}
							value={imageId}
							render={({ open }) => (
								<div className="nta-editor__picker">
									{imageUrl ? (
										<img src={imageUrl} alt="" className="nta-editor__thumb" />
									) : (
										<div className="nta-editor__thumb nta-editor__thumb--empty">
											No image selected
										</div>
									)}
									<Button variant="secondary" onClick={open}>
										{imageUrl ? "Replace image" : "Select image"}
									</Button>
									{imageUrl && (
										<Button
											variant="link"
											isDestructive
											onClick={() => setAttributes({ imageId: 0, imageUrl: "" })}
										>
											Remove
										</Button>
									)}
								</div>
							)}
						/>
					</MediaUploadCheck>
				</PanelBody>

				<PanelBody title="Image Caption" initialOpen={false}>
					<TextControl
						label="Caption"
						value={imageCaption}
						onChange={(value) => setAttributes({ imageCaption: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="nta__inner">
					<div className="nta__media">
						<div className="nta__image-wrap">
							{imageUrl ? (
								<img src={imageUrl} alt="" className="nta__image" />
							) : (
								<div className="nta__placeholder">Select section image</div>
							)}
						</div>
						<RichText
							tagName="p"
							className="nta__caption"
							value={imageCaption}
							onChange={(value) => setAttributes({ imageCaption: value })}
							placeholder="Image caption"
						/>
					</div>

					<div className="nta__content">
						<RichText
							tagName="p"
							className="nta__eyebrow"
							value={eyebrow}
							onChange={(value) => setAttributes({ eyebrow: value })}
							placeholder="Who We Are"
						/>
						<RichText
							tagName="h2"
							className="nta__title"
							value={heading}
							onChange={(value) => setAttributes({ heading: value })}
							placeholder="Section title"
						/>
						<RichText
							tagName="p"
							className="nta__body"
							value={description}
							onChange={(value) => setAttributes({ description: value })}
							placeholder="Section description"
						/>

						<div className="nta__features">
							{FEATURES.map(([key, placeholder]) => (
								<div className="nta__feature" key={key}>
									<span className="nta__dot" />
									<RichText
										tagName="p"
										className="nta__feature-text"
										value={attributes[key]}
										onChange={(value) => setAttributes({ [key]: value })}
										placeholder={placeholder}
									/>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
