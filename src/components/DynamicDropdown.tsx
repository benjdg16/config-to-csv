import React from "react";
import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
	Box,
} from "@mui/material";
import type { ComponentConfig, ComponentData } from "../types";

interface DynamicDropdownProps {
	config: ComponentConfig;
	data: ComponentData;
	onChange: (id: string, value: string) => void;
	error?: string;
}

export const DynamicDropdown: React.FC<DynamicDropdownProps> = ({
	config,
	data,
	onChange,
	error,
}) => {
	return (
		<Box sx={{ minWidth: 200, flex: 1 }}>
			<FormControl fullWidth size="small" error={!!error}>
				<InputLabel>{config.label}</InputLabel>
				<Select
					value={data.value || ""}
					onChange={(e) => onChange(config.id, e.target.value)}
					label={config.label}
					required={config.required}
				>
					<MenuItem value="">
						<em>Select...</em>
					</MenuItem>
					{config.options?.map((option, index) => (
						<MenuItem key={index} value={option}>
							{option}
						</MenuItem>
					))}
				</Select>
				{error && <FormHelperText>{error}</FormHelperText>}
			</FormControl>
		</Box>
	);
};
