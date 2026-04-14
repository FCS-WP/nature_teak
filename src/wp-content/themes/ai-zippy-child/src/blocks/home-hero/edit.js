import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	URLInputButton,
} from "@wordpress/block-editor";
import { PanelBody, Button, TextControl } from "@wordpress/components";

const TILE_CONFIG = [
	{ key: "Teak", attrId: "tileTeakId", attrUrl: "tileTeakUrl", labelAttr: "labelTeak" },
	{ key: "Willow", attrId: "tileWillowId", attrUrl: "tileWillowUrl", labelAttr: "labelWillow" },
	{ key: "Walnut", attrId: "tileWalnutId", attrUrl: "tileWalnutUrl", labelAttr: "labelWalnut" },
	{ key: "Maple", attrId: "tileMapleId", attrUrl: "tileMapleUrl", labelAttr: "labelMaple" },
];

function TilePicker({ title, imageId, imageUrl, onSelect, onRemove }) {
	return (
		<MediaUploadCheck>
			<MediaUpload
				onSelect={onSelect}
				allowedTypes={["image"]}
				value={imageId}
				render={({ open }) => (
					<div className="hh-editor__picker">
						{imageUrl ? (
							<img src={imageUrl} alt="" className="hh-editor__thumb" />
						) : (
							<div className="hh-editor__thumb hh-editor__thumb--empty">No image selected</div>
						)}
						<Button variant="secondary" onClick={open}>
							{imageUrl ? `Replace ${title}` : `Select ${title}`}
						</Button>
						{imageUrl && (
							<Button variant="link" isDestructive onClick={onRemove}>
								Remove
							</Button>
						)}
					</div>
				)}
			/>
		</MediaUploadCheck>
	);
}

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps({ className: "hh" });
	const {
		eyebrow,
		heading,
		description,
		primaryBtnText,
		primaryBtnUrl,
		secondaryBtnText,
		secondaryBtnUrl,
		statOneValue,
		statOneLabel,
		statTwoValue,
		statTwoLabel,
		statThreeValue,
		statThreeLabel,
		tileTeakId,
		tileTeakUrl,
		tileWillowId,
		tileWillowUrl,
		tileWalnutId,
		tileWalnutUrl,
		tileMapleId,
		tileMapleUrl,
		labelTeak,
		labelWillow,
		labelWalnut,
		labelMaple,
		locationTitle,
		locationSubtitle,
	} = attributes;

	const tiles = [tileTeakUrl, tileWillowUrl, tileWalnutUrl, tileMapleUrl];

	return (
		<>
			<InspectorControls>
				<PanelBody title="Buttons" initialOpen={true}>
					<TextControl
						label="Primary Button Text"
						value={primaryBtnText}
						onChange={(value) => setAttributes({ primaryBtnText: value })}
					/>
					<URLInputButton
						url={primaryBtnUrl}
						onChange={(value) => setAttributes({ primaryBtnUrl: value })}
					/>
					<TextControl
						label="Secondary Button Text"
						value={secondaryBtnText}
						onChange={(value) => setAttributes({ secondaryBtnText: value })}
					/>
					<URLInputButton
						url={secondaryBtnUrl}
						onChange={(value) => setAttributes({ secondaryBtnUrl: value })}
					/>
				</PanelBody>

				<PanelBody title="Stats" initialOpen={false}>
					<TextControl
						label="Stat 1 Value"
						value={statOneValue}
						onChange={(value) => setAttributes({ statOneValue: value })}
					/>
					<TextControl
						label="Stat 1 Label"
						value={statOneLabel}
						onChange={(value) => setAttributes({ statOneLabel: value })}
					/>
					<TextControl
						label="Stat 2 Value"
						value={statTwoValue}
						onChange={(value) => setAttributes({ statTwoValue: value })}
					/>
					<TextControl
						label="Stat 2 Label"
						value={statTwoLabel}
						onChange={(value) => setAttributes({ statTwoLabel: value })}
					/>
					<TextControl
						label="Stat 3 Value"
						value={statThreeValue}
						onChange={(value) => setAttributes({ statThreeValue: value })}
					/>
					<TextControl
						label="Stat 3 Label"
						value={statThreeLabel}
						onChange={(value) => setAttributes({ statThreeLabel: value })}
					/>
				</PanelBody>

				<PanelBody title="Collage Images" initialOpen={false}>
					{TILE_CONFIG.map(({ key, attrId, attrUrl }) => (
						<TilePicker
							key={key}
							title={key}
							imageId={attributes[attrId]}
							imageUrl={attributes[attrUrl]}
							onSelect={(media) =>
								setAttributes({ [attrId]: media.id, [attrUrl]: media.url })
							}
							onRemove={() => setAttributes({ [attrId]: 0, [attrUrl]: "" })}
						/>
					))}
				</PanelBody>

				<PanelBody title="Labels" initialOpen={false}>
					<TextControl
						label="Teak Label"
						value={labelTeak}
						onChange={(value) => setAttributes({ labelTeak: value })}
					/>
					<TextControl
						label="Willow Label"
						value={labelWillow}
						onChange={(value) => setAttributes({ labelWillow: value })}
					/>
					<TextControl
						label="Walnut Label"
						value={labelWalnut}
						onChange={(value) => setAttributes({ labelWalnut: value })}
					/>
					<TextControl
						label="Maple Label"
						value={labelMaple}
						onChange={(value) => setAttributes({ labelMaple: value })}
					/>
					<TextControl
						label="Location Title"
						value={locationTitle}
						onChange={(value) => setAttributes({ locationTitle: value })}
					/>
					<TextControl
						label="Location Subtitle"
						value={locationSubtitle}
						onChange={(value) => setAttributes({ locationSubtitle: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="hh__inner">
					<div className="hh__left">
						<RichText
							tagName="p"
							className="hh__eyebrow"
							value={eyebrow}
							onChange={(value) => setAttributes({ eyebrow: value })}
							placeholder="Eyebrow text"
						/>
						<RichText
							tagName="h2"
							className="hh__title"
							value={heading}
							onChange={(value) => setAttributes({ heading: value })}
							placeholder="Main heading"
						/>
						<RichText
							tagName="p"
							className="hh__desc"
							value={description}
							onChange={(value) => setAttributes({ description: value })}
							placeholder="Description"
						/>

						<div className="hh__actions">
							<span className="hh__btn hh__btn--primary">{primaryBtnText || "Browse Products"}</span>
							<span className="hh__btn hh__btn--outline">{secondaryBtnText || "Get a Quote"}</span>
						</div>

						<div className="hh__stats">
							<div className="hh__stat">
								<RichText tagName="p" className="hh__stat-value" value={statOneValue} onChange={(value) => setAttributes({ statOneValue: value })} placeholder="20+" />
								<RichText tagName="p" className="hh__stat-label" value={statOneLabel} onChange={(value) => setAttributes({ statOneLabel: value })} placeholder="Years Experience" />
							</div>
							<div className="hh__stat">
								<RichText tagName="p" className="hh__stat-value" value={statTwoValue} onChange={(value) => setAttributes({ statTwoValue: value })} placeholder="500+" />
								<RichText tagName="p" className="hh__stat-label" value={statTwoLabel} onChange={(value) => setAttributes({ statTwoLabel: value })} placeholder="Projects Completed" />
							</div>
							<div className="hh__stat">
								<RichText tagName="p" className="hh__stat-value" value={statThreeValue} onChange={(value) => setAttributes({ statThreeValue: value })} placeholder="B2B" />
								<RichText tagName="p" className="hh__stat-label" value={statThreeLabel} onChange={(value) => setAttributes({ statThreeLabel: value })} placeholder="Trade Specialists" />
							</div>
						</div>
					</div>

					<div className="hh__right">
						<div className="hh__tiles">
							{[labelTeak, labelWillow, labelWalnut, labelMaple].map((label, index) => (
								<div key={label + index} className={`hh__tile hh__tile--${index + 1}`}>
									{tiles[index] ? <img src={tiles[index]} alt="" className="hh__tile-img" /> : <span className="hh__tile-fallback">Upload image</span>}
									<span className="hh__wood-label">{label}</span>
									{index === 1 && (
										<div className="hh__location-badge">
											<p>{locationTitle}</p>
											<p>{locationSubtitle}</p>
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
