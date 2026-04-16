import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	URLInputButton,
	useBlockProps,
	useSettings,
} from "@wordpress/block-editor";
import {
	BaseControl,
	Button,
	ColorPalette,
	PanelBody,
	TextControl,
	TextareaControl,
} from "@wordpress/components";

const HOURS = [
	["One", "Mon – Fri", "8am – 5:30pm"],
	["Two", "Saturday", "8am – 1pm"],
	["Three", "Sunday", "Closed"],
	["Four", "Public Holidays", "Closed"],
];

const TRADE_ITEMS = [
	["One", "B2B wholesale pricing available"],
	["Two", "Custom milling and cutting to spec"],
	["Three", "Bulk orders and project supply"],
	["Four", "Wood grading expertise & guidance"],
];

export default function Edit({ attributes, setAttributes }) {
	const [themePalette] = useSettings("color.palette");
	const blockProps = useBlockProps({
		className: "cts",
		style: attributes.backgroundColor
			? { backgroundColor: attributes.backgroundColor }
			: undefined,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title="Form" initialOpen={true}>
					<TextareaControl
						label="Form Shortcode"
						value={attributes.formShortcode}
						onChange={(value) => setAttributes({ formShortcode: value })}
						help='Example: [formidable id="1"] or your preferred contact form shortcode.'
					/>
					<TextControl
						label="Response Note"
						value={attributes.responseNote}
						onChange={(value) => setAttributes({ responseNote: value })}
					/>
				</PanelBody>

				<PanelBody title="Colors" initialOpen={false}>
					<BaseControl
						label="Section Background Color"
						help="Choose a background color for the contact section."
					>
						<ColorPalette
							colors={themePalette || []}
							value={attributes.backgroundColor}
							onChange={(value) => setAttributes({ backgroundColor: value || "" })}
							clearable={true}
						/>
					</BaseControl>
				</PanelBody>

				<PanelBody title="Links" initialOpen={false}>
					<p>Map Link</p>
					<URLInputButton
						url={attributes.mapLinkUrl}
						onChange={(value) => setAttributes({ mapLinkUrl: value })}
					/>
					<p>Follow Button Link</p>
					<URLInputButton
						url={attributes.followButtonUrl}
						onChange={(value) => setAttributes({ followButtonUrl: value })}
					/>
				</PanelBody>

				<PanelBody title="Map Card Image" initialOpen={false}>
					<TextareaControl
						label="Map Embed HTML"
						value={attributes.mapEmbedHtml}
						onChange={(value) => setAttributes({ mapEmbedHtml: value })}
						help="Paste Google Maps embed HTML here. When set, it will replace the image/text map card on the frontend."
					/>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) =>
								setAttributes({
									mapImageId: media.id,
									mapImageUrl: media.url,
									mapAlt: media.alt || "",
								})
							}
							allowedTypes={["image"]}
							value={attributes.mapImageId}
							render={({ open }) => (
								<div className="cts-editor__picker">
									{attributes.mapImageUrl ? (
										<img src={attributes.mapImageUrl} alt="" className="cts-editor__thumb" />
									) : (
										<div className="cts-editor__thumb cts-editor__thumb--empty">No map image selected</div>
									)}
									<Button variant="secondary" onClick={open}>
										{attributes.mapImageUrl ? "Replace map image" : "Select map image"}
									</Button>
									{attributes.mapImageUrl ? (
										<Button
											variant="link"
											isDestructive
											onClick={() =>
												setAttributes({
													mapImageId: 0,
													mapImageUrl: "",
													mapAlt: "",
												})
											}
										>
											Remove
										</Button>
									) : null}
								</div>
							)}
						/>
					</MediaUploadCheck>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="cts__grid">
					<div className="cts__form-col">
						<RichText
							tagName="p"
							className="cts__eyebrow"
							value={attributes.eyebrow}
							onChange={(value) => setAttributes({ eyebrow: value })}
							placeholder="Send An Enquiry"
						/>
						<RichText
							tagName="h2"
							className="cts__title"
							value={attributes.heading}
							onChange={(value) => setAttributes({ heading: value })}
							placeholder="B2B & Project Enquiries"
						/>

						<div className="cts__form-preview">
							<div className="cts__form-row cts__form-row--two">
								<div className="cts__field"><span>First Name *</span><div /></div>
								<div className="cts__field"><span>Last Name *</span><div /></div>
							</div>
							<div className="cts__form-row">
								<div className="cts__field"><span>Company / Organisation</span><div /></div>
							</div>
							<div className="cts__form-row cts__form-row--two">
								<div className="cts__field"><span>Email Address *</span><div /></div>
								<div className="cts__field"><span>Phone Number</span><div /></div>
							</div>
							<div className="cts__form-row">
								<div className="cts__field"><span>Product Interest</span><div /></div>
							</div>
							<div className="cts__form-row">
								<div className="cts__field cts__field--textarea"><span>Project Details / Message *</span><div /></div>
							</div>
							<div className="cts__form-row">
								<div className="cts__field"><span>How Did You Hear About Us?</span><div /></div>
							</div>
							<div className="cts__submit">Send Enquiry</div>
						</div>

						{attributes.formShortcode ? (
							<p className="cts-editor__note">Shortcode configured. The real form will render on the frontend.</p>
						) : (
							<p className="cts-editor__note">Add a contact form shortcode in the block sidebar to replace this preview with a real form on the frontend.</p>
						)}

						<RichText
							tagName="p"
							className="cts__response-note"
							value={attributes.responseNote}
							onChange={(value) => setAttributes({ responseNote: value })}
							placeholder="We typically respond within 1–2 business days."
						/>
					</div>

					<div className="cts__info-col">
						<div className="cts__panel">
							<RichText
								tagName="h3"
								className="cts__panel-title cts__panel-title--location"
								value={attributes.locationTitle}
								onChange={(value) => setAttributes({ locationTitle: value })}
								placeholder="Our Location"
							/>
							<div className="cts__location-copy">
								<RichText
									tagName="p"
									className="cts__location-name"
									value={attributes.locationName}
									onChange={(value) => setAttributes({ locationName: value })}
									placeholder="Nature Teak Pte Ltd"
								/>
								<RichText
									tagName="p"
									className="cts__location-address"
									value={attributes.locationAddress}
									onChange={(value) => setAttributes({ locationAddress: value })}
									placeholder="Sungei Kadut, Singapore"
								/>
								<RichText
									tagName="p"
									className="cts__location-tagline"
									value={attributes.locationTagline}
									onChange={(value) => setAttributes({ locationTagline: value })}
									placeholder="Singapore's premier timber & wood hub"
								/>
							</div>
							<div className="cts__map-card">
								{attributes.mapEmbedHtml ? (
									<div className="cts__map-embed-placeholder">
										<p>Embedded map HTML configured.</p>
										<p>The live embed will render on the frontend.</p>
									</div>
								) : (
									<>
										{attributes.mapImageUrl ? (
											<img src={attributes.mapImageUrl} alt="" className="cts__map-image" />
										) : null}
										<RichText
											tagName="p"
											className="cts__map-title"
											value={attributes.mapTitle}
											onChange={(value) => setAttributes({ mapTitle: value })}
											placeholder="Sungei Kadut Timber Hub"
										/>
										<RichText
											tagName="p"
											className="cts__map-subtitle"
											value={attributes.mapSubtitle}
											onChange={(value) => setAttributes({ mapSubtitle: value })}
											placeholder="Singapore"
										/>
										<RichText
											tagName="span"
											className="cts__map-link"
											value={attributes.mapLinkText}
											onChange={(value) => setAttributes({ mapLinkText: value })}
											placeholder="Open in Google Maps"
										/>
									</>
								)}
							</div>
						</div>

						<div className="cts__panel">
							<RichText
								tagName="h3"
								className="cts__panel-title cts__panel-title--hours"
								value={attributes.hoursTitle}
								onChange={(value) => setAttributes({ hoursTitle: value })}
								placeholder="Operating Hours"
							/>
							<div className="cts__hours-list">
								{HOURS.map(([key, dayPlaceholder, timePlaceholder]) => (
									<div className="cts__hours-row" key={key}>
										<RichText
											tagName="span"
											className="cts__hours-label"
											value={attributes[`hoursLine${key}Label`]}
											onChange={(value) => setAttributes({ [`hoursLine${key}Label`]: value })}
											placeholder={dayPlaceholder}
										/>
										<RichText
											tagName="span"
											className="cts__hours-value"
											value={attributes[`hoursLine${key}Value`]}
											onChange={(value) => setAttributes({ [`hoursLine${key}Value`]: value })}
											placeholder={timePlaceholder}
										/>
									</div>
								))}
							</div>
						</div>

						<div className="cts__panel">
							<RichText
								tagName="h3"
								className="cts__panel-title cts__panel-title--trade"
								value={attributes.tradeTitle}
								onChange={(value) => setAttributes({ tradeTitle: value })}
								placeholder="Trade Enquiries"
							/>
							<div className="cts__trade-list">
								{TRADE_ITEMS.map(([key, placeholder]) => (
									<div className="cts__trade-item" key={key}>
										<span className="cts__trade-check" />
										<RichText
											tagName="p"
											className="cts__trade-text"
											value={attributes[`trade${key}`]}
											onChange={(value) => setAttributes({ [`trade${key}`]: value })}
											placeholder={placeholder}
										/>
									</div>
								))}
							</div>
						</div>

						<div className="cts__panel">
							<RichText
								tagName="h3"
								className="cts__panel-title cts__panel-title--follow"
								value={attributes.followTitle}
								onChange={(value) => setAttributes({ followTitle: value })}
								placeholder="Follow Us"
							/>
							<RichText
								tagName="span"
								className="cts__follow-button"
								value={attributes.followButtonText}
								onChange={(value) => setAttributes({ followButtonText: value })}
								placeholder="Nature Teak Wood on Facebook"
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
