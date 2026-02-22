import type { ConfigField } from "../types";

export const parseConfig = (configText: string): ConfigField[] => {
	const lines = configText
		.trim()
		.split("\n")
		.filter((line) => line.trim());
	const fields: ConfigField[] = [];

	lines.forEach((line, index) => {
		const trimmedLine = line.trim();
		if (!trimmedLine) return;

		// Simple parsing format:
		// textbox: Field Name
		// dropdown: Field Name | option1,option2,option3
		// textbox*: Field Name (required)

		const isRequired = trimmedLine.includes("*");
		const cleanLine = trimmedLine.replace("*", "");

		if (cleanLine.toLowerCase().startsWith("textbox:")) {
			const label = cleanLine.substring(8).trim();
			fields.push({
				id: `field_${index}`,
				type: "textbox",
				label: label || `Textbox ${index + 1}`,
				required: isRequired,
				value: "",
			});
		} else if (cleanLine.toLowerCase().startsWith("dropdown:")) {
			const content = cleanLine.substring(9).trim();
			const [label, optionsStr] = content.split("|").map((s) => s.trim());
			const options = optionsStr
				? optionsStr.split(",").map((s) => s.trim())
				: ["Option 1", "Option 2"];

			fields.push({
				id: `field_${index}`,
				type: "dropdown",
				label: label || `Dropdown ${index + 1}`,
				options,
				required: isRequired,
				value: "",
			});
		}
	});

	return fields;
};

export const generateConfigFromFields = (fields: ConfigField[]): string => {
	return fields
		.map((field) => {
			const required = field.required ? "*" : "";
			if (field.type === "textbox") {
				return `textbox${required}: ${field.label}`;
			} else if (field.type === "dropdown") {
				const options = field.options?.join(",") || "Option 1,Option 2";
				return `dropdown${required}: ${field.label} | ${options}`;
			}
			return "";
		})
		.join("\n");
};

export const getConfigHelp = (): string => {
	return `How to write config (one per line):

textbox: Your Label
dropdown: Your Label | option1,option2,option3
textbox*: Required Field (add * for required)
dropdown*: Required Dropdown | yes,no,maybe

Examples:
textbox: Full Name
textbox*: Email Address
dropdown: Country | USA,Canada,UK,Australia
dropdown*: Status | Active,Inactive`;
};
