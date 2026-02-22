import React from "react";
import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
	Box,
} from "@mui/material";
import type { ComponentData } from "../types";

interface DynamicDropdownProps {
	data: ComponentData;
	onChange: (id: string, value: string) => void;
}

export const DynamicDropdown: React.FC<DynamicDropdownProps> = ({
	data,
	onChange,
}) => {
	return (
		<Box sx={{ minWidth: 200, flex: 1 }}>
			<FormControl fullWidth size="small" error={!!data.error}>
				<InputLabel>{data.label}</InputLabel>
				<Select
					value={data.value || ""}
					onChange={(e) => onChange(data.id, e.target.value)}
					label={data.label}
					required={data.required}
				>
					<MenuItem value="">
						<em>Select...</em>
					</MenuItem>
					{data.options?.map((option, index) => (
						<MenuItem key={index} value={option}>
							{option}
						</MenuItem>
					))}
				</Select>
				{data.error && <FormHelperText>{data.error}</FormHelperText>}
			</FormControl>
		</Box>
	);
};
