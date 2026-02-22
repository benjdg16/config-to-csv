// import type { ComponentData } from "../types";

// export function validateRow(data: ComponentData[]): {
// 	isValid: boolean;
// 	errors: Record<string, string>;
// } {
// 	const errors: Record<string, string> = {};

// 	data.forEach((data) => {
// 		if (data.required && !data.value.trim()) {
// 			errors[data.id] = `Required`;
// 		}
// 	});

// 	return {
// 		isValid: Object.keys(errors).length === 0,
// 		errors,
// 	};
// }

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
