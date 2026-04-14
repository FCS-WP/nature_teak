import { useBlockProps, RichText } from "@wordpress/block-editor";

const CARDS = ["One", "Two", "Three", "Four"];

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps({ className: "ntw" });

	return (
		<div {...blockProps}>
			<RichText
				tagName="p"
				className="ntw__eyebrow"
				value={attributes.eyebrow}
				onChange={(value) => setAttributes({ eyebrow: value })}
				placeholder="Why Nature Teak"
			/>
			<RichText
				tagName="h2"
				className="ntw__title"
				value={attributes.heading}
				onChange={(value) => setAttributes({ heading: value })}
				placeholder="Your Trusted Timber Partner"
			/>
			<RichText
				tagName="p"
				className="ntw__body"
				value={attributes.description}
				onChange={(value) => setAttributes({ description: value })}
				placeholder="Section description"
			/>

			<div className="ntw__grid">
				{CARDS.map((key) => (
					<div className="ntw__card" key={key}>
						<RichText
							tagName="p"
							className="ntw__num"
							value={attributes[`card${key}Number`]}
							onChange={(value) => setAttributes({ [`card${key}Number`]: value })}
							placeholder="01"
						/>
						<RichText
							tagName="h3"
							className="ntw__card-title"
							value={attributes[`card${key}Title`]}
							onChange={(value) => setAttributes({ [`card${key}Title`]: value })}
							placeholder="Card title"
						/>
						<RichText
							tagName="p"
							className="ntw__card-text"
							value={attributes[`card${key}Text`]}
							onChange={(value) => setAttributes({ [`card${key}Text`]: value })}
							placeholder="Card text"
						/>
					</div>
				))}
			</div>
		</div>
	);
}
