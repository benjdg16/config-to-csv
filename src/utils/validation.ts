import type { ComponentConfig, ComponentData } from "../types";

export function validateRow(
	data: ComponentData[],
	components: ComponentConfig[],
): { isValid: boolean; errors: Record<string, string> } {
	const errors: Record<string, string> = {};

	components.forEach((component) => {
		const dataItem = data.find((d) => d.id === component.id);
		const value = dataItem?.value || "";

		if (component.required && !value.trim()) {
			errors[component.id] = `${component.label} is required`;
		}

		if (component.type === "textbox" && value.length > 500) {
			errors[component.id] =
				`${component.label} must be less than 500 characters`;
		}
	});

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	};
}

export function validateFileName(fileName: string): string | null {
	if (!fileName.trim()) return null;

	const invalidChars = /[<>:"/\\|?*]/g;
	if (invalidChars.test(fileName)) {
		return "File name contains invalid characters";
	}

	if (fileName.length > 255) {
		return "File name is too long";
	}

	return null;
}
