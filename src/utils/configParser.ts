import type { ComponentConfig, ValidationResult } from "../types";
import { generateComponentId } from "./helper";

export function parseConfig(
	configText: string,
): ValidationResult & { components?: ComponentConfig[] } {
	const lines = configText
		.trim()
		.split("\n")
		.filter((line) => line.trim());
	const components: ComponentConfig[] = [];
	const errors: string[] = [];

	if (lines.length === 0) {
		return { isValid: false, errors: ["Configuration cannot be empty"] };
	}

	lines.forEach((line, index) => {
		const trimmedLine = line.trim();
		if (!trimmedLine) return;

		const firstColonIndex = trimmedLine.indexOf(":");
		if (firstColonIndex === -1) {
			errors.push(
				`Line ${index + 1}: Invalid format. Use "textbox: label" or "dropdown: label: option1, option2"`,
			);
			return;
		}

		const type = trimmedLine.slice(0, firstColonIndex).trim();
		const content = trimmedLine.slice(firstColonIndex + 1).trim();

		if (!content) {
			errors.push(`Line ${index + 1}: Missing label/options`);
			return;
		}

		if (type.toLowerCase() === "textbox") {
			components.push({
				id: generateComponentId("textbox", index),
				type: "textbox",
				label: content,
				required: true,
			});
		} else if (type.toLowerCase() === "dropdown") {
			const secondColonIndex = content.indexOf(":");
			if (secondColonIndex === -1) {
				errors.push(
					`Line ${index + 1}: Dropdown needs a label and options separated by ":"`,
				);
				return;
			}

			const label = content.slice(0, secondColonIndex).trim();
			const options = content
				.slice(secondColonIndex + 1)
				.split(",")
				.map((p) => p.trim())
				.filter((p) => p);

			if (!label || options.length === 0) {
				errors.push(
					`Line ${index + 1}: Dropdown needs a label and at least one option`,
				);
				return;
			}

			components.push({
				id: generateComponentId("dropdown", index),
				type: "dropdown",
				label,
				options,
				required: true,
			});
		} else {
			errors.push(
				`Line ${index + 1}: Unknown component type "${type}". Use "textbox" or "dropdown"`,
			);
		}
	});

	return {
		isValid: errors.length === 0,
		errors,
		components: errors.length === 0 ? components : undefined,
	};
}
