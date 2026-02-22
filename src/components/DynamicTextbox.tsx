import React from "react";
import { TextField, Box } from "@mui/material";
import type { ComponentConfig, ComponentData } from "../types";

interface DynamicTextboxProps {
	config: ComponentConfig;
	data: ComponentData;
	onChange: (id: string, value: string) => void;
	error?: string;
}

export const DynamicTextbox: React.FC<DynamicTextboxProps> = ({
	config,
	data,
	onChange,
	error,
}) => {
	return (
		<Box sx={{ minWidth: 200, flex: 1 }}>
			<TextField
				fullWidth
				size="small"
				label={config.label}
				value={data.value || ""}
				onChange={(e) => onChange(config.id, e.target.value)}
				required={config.required}
				error={!!error}
				helperText={error}
				variant="outlined"
			/>
		</Box>
	);
};
