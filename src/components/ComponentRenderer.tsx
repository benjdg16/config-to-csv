import React from "react";
import type { ConfigField } from "../types";
import DynamicForm from "./DynamicForm";

interface ComponentRendererProps {
	fields: ConfigField[];
	onFieldChange: (fieldId: string, value: string) => void;
	onAddRow: () => void;
	onDeleteRow: (index: number) => void;
	onSave: () => void;
	onCancel: () => void;
	data: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
	onEditConfig: () => void;
}

const ComponentRenderer: React.FC<ComponentRendererProps> = (props) => {
	return (
		<DynamicForm
			fields={props.fields}
			onFieldChange={props.onFieldChange}
			onAddRow={props.onAddRow}
			onDeleteRow={props.onDeleteRow}
			onSave={props.onSave}
			onCancel={props.onCancel}
			data={props.data}
		/>
	);
};

export default ComponentRenderer;
