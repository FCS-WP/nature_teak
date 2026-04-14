import { useBlockProps, RichText } from "@wordpress/block-editor";

const ITEMS = [
	["itemOne", "WPC Composite Decking"],
	["itemTwo", "Teak Handrails & Profiles"],
	["itemThree", "Premium Raw Teak Supply"],
	["itemFour", "Custom Wood Milling & Cutting"],
	["itemFive", "Indoor & Outdoor Decking"],
];

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps({ className: "ntk" });

	return (
		<div {...blockProps}>
			<div className="ntk__editor-list">
				{ITEMS.map(([key, placeholder]) => (
					<RichText
						key={key}
						tagName="span"
						className="ntk__item"
						value={attributes[key]}
						onChange={(value) => setAttributes({ [key]: value })}
						placeholder={placeholder}
					/>
				))}
			</div>
		</div>
	);
}
