import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	URLInputButton,
} from "@wordpress/block-editor";
import { PanelBody, Button } from "@wordpress/components";

const CARDS = ["One", "Two", "Three", "Four"];

function ImagePicker({ imageId, imageUrl, onSelect, onRemove, title }) {
	return (
		<MediaUploadCheck>
			<MediaUpload
				onSelect={onSelect}
				allowedTypes={["image"]}
				value={imageId}
				render={({ open }) => (
					<div className="ntfp-editor__picker">
						{imageUrl ? (
							<img src={imageUrl} alt="" className="ntfp-editor__thumb" />
						) : (
							<div className="ntfp-editor__thumb ntfp-editor__thumb--empty">No image selected</div>
						)}
						<Button variant="secondary" onClick={open}>{imageUrl ? `Replace ${title}` : `Select ${title}`}</Button>
						{imageUrl ? <Button variant="link" isDestructive onClick={onRemove}>Remove</Button> : null}
					</div>
				)}
			/>
		</MediaUploadCheck>
	);
}

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps({ className: "ntfp" });

	return (
		<>
			<InspectorControls>
				<PanelBody title="Shop Button Link" initialOpen={true}>
					<URLInputButton
						url={attributes.buttonUrl}
						onChange={(value) => setAttributes({ buttonUrl: value })}
					/>
				</PanelBody>
				<PanelBody title="Product Images" initialOpen={false}>
					{CARDS.map((key) => (
						<ImagePicker
							key={key}
							title={`Card ${key}`}
							imageId={attributes[`card${key}ImageId`]}
							imageUrl={attributes[`card${key}ImageUrl`]}
							onSelect={(media) => setAttributes({ [`card${key}ImageId`]: media.id, [`card${key}ImageUrl`]: media.url })}
							onRemove={() => setAttributes({ [`card${key}ImageId`]: 0, [`card${key}ImageUrl`]: "" })}
						/>
					))}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="ntfp__header">
					<div>
						<RichText tagName="p" className="ntfp__eyebrow" value={attributes.eyebrow} onChange={(value) => setAttributes({ eyebrow: value })} placeholder="Featured Products" />
						<RichText tagName="h2" className="ntfp__title" value={attributes.heading} onChange={(value) => setAttributes({ heading: value })} placeholder="Popular Timber Lines" />
					</div>
					<RichText tagName="span" className="ntfp__button" value={attributes.buttonText} onChange={(value) => setAttributes({ buttonText: value })} placeholder="Shop All" />
				</div>

				<div className="ntfp__grid">
					{CARDS.map((key) => (
						<div className="ntfp__card" key={key}>
							<div className="ntfp__image-wrap">
								{attributes[`card${key}ImageUrl`] ? (
									<img src={attributes[`card${key}ImageUrl`]} alt="" className="ntfp__image" />
								) : (
									<div className="ntfp__placeholder">Select image</div>
								)}
							</div>
							<div className="ntfp__info">
								<RichText tagName="p" className="ntfp__category" value={attributes[`card${key}Category`]} onChange={(value) => setAttributes({ [`card${key}Category`]: value })} placeholder="Category" />
								<RichText tagName="h3" className="ntfp__card-title" value={attributes[`card${key}Title`]} onChange={(value) => setAttributes({ [`card${key}Title`]: value })} placeholder="Product title" />
								<RichText tagName="p" className="ntfp__spec" value={attributes[`card${key}Spec`]} onChange={(value) => setAttributes({ [`card${key}Spec`]: value })} placeholder="Product spec" />
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
}
