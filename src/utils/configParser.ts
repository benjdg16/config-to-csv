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

		const parts = trimmedLine.split(":").map((p) => p.trim());

		if (parts.length < 2) {
			errors.push(
				`Line ${index + 1}: Invalid format. Use "type: label" or "dropdown: label, option1, option2"`,
			);
			return;
		}

		const [type, ...rest] = parts;
		const content = rest.join(":").trim();

		if (!content) {
			errors.push(`Line ${index + 1}: Missing label`);
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
			const parts = content.split(",").map((p) => p.trim());
			if (parts.length < 2) {
				errors.push(
					`Line ${index + 1}: Dropdown needs at least a label and one option`,
				);
				return;
			}

			const [label, ...options] = parts;
			components.push({
				id: generateComponentId("dropdown", index),
				type: "dropdown",
				label,
				options: options.filter((opt) => opt.length > 0),
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
