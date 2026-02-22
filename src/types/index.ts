export interface ComponentConfig {
	// Use this as factory for dynamic components
	id: string;
	type: "textbox" | "dropdown";
	label: string;
	required: boolean;
	options?: string[];
}

// export interface ComponentData {
// 	id: string;
//     type: "textbox" | "dropdown";
//     label: string;
//     required: boolean;
//     options?: stringp
// 	componentId: string; // Links to ComponentConfig.id
// 	value: string;
// 	error?: string;
// }

export interface ComponentData extends ComponentConfig {
	componentId: string;
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
