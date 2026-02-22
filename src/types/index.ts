export interface ConfigField {
	id: string;
	type: "textbox" | "dropdown";
	label: string;
	options?: string[];
	required?: boolean;
	value?: string;
}

export interface FormData {
	[key: string]: string;
}

export interface ValidationError {
	fieldId: string;
	message: string;
}

export interface AppSettings {
	darkMode: boolean;
	removeHeaders: boolean;
	fileName: string;
}
