export interface ComponentConfig {
	id: string;
	type: "textbox" | "dropdown";
	label: string;
	options?: string[];
	required?: boolean;
}

export interface ComponentData {
	id: string;
	value: string;
	error?: string;
}

export interface AppState {
	components: ComponentConfig[];
	data: ComponentData[][];
	fileName: string;
	removeHeaders: boolean;
	darkMode: boolean;
}

export interface ValidationResult {
	isValid: boolean;
	errors: string[];
}
