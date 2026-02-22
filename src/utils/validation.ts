import type { ConfigField, FormData, ValidationError } from "../types";

export const validateFormData = (
	fields: ConfigField[],
	data: FormData,
): ValidationError[] => {
	const errors: ValidationError[] = [];

	fields.forEach((field) => {
		const value = data[field.id];

		if (field.required && (!value || value.trim() === "")) {
			errors.push({
				fieldId: field.id,
				message: `${field.label} is required`,
			});
		}

		if (
			field.type === "dropdown" &&
			value &&
			field.options &&
			!field.options.includes(value)
		) {
			errors.push({
				fieldId: field.id,
				message: `Invalid option selected for ${field.label}`,
			});
		}
	});

	return errors;
};

export const validateConfig = (configText: string): string[] => {
	const errors: string[] = [];
	const lines = configText
		.trim()
		.split("\n")
		.filter((line) => line.trim());

	if (lines.length === 0) {
		errors.push("Config cannot be empty");
		return errors;
	}

	lines.forEach((line, index) => {
		const trimmedLine = line.trim().replace("*", "");

		if (
			!trimmedLine.toLowerCase().startsWith("textbox:") &&
			!trimmedLine.toLowerCase().startsWith("dropdown:")
		) {
			errors.push(
				`Line ${index + 1}: Must start with 'textbox:' or 'dropdown:'`,
			);
		}

		if (trimmedLine.toLowerCase().startsWith("dropdown:")) {
			const content = trimmedLine.substring(9).trim();
			if (!content.includes("|")) {
				errors.push(
					`Line ${index + 1}: Dropdown must have options after '|' (e.g., 'dropdown: Name | option1,option2')`,
				);
			}
		}
	});

	return errors;
};
