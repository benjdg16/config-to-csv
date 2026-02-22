export const generateComponentId = (type: string, index: number) => {
	if (type === "textbox") {
		return `textbox-${index}-${Date.now()}`;
	} else if (type === "dropdown") {
		return `dropdown-${index}-${Date.now()}`;
	} else {
		return `component-${index}-${Date.now()}`;
	}
};
