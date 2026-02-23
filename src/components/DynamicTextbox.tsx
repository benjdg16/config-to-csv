import React from "react";
import { TextField, Box } from "@mui/material";
import type { ComponentData } from "../types";

interface DynamicTextboxProps {
	data: ComponentData;
	onChange: (id: string, value: string) => void;
}

const DynamicTextbox: React.FC<DynamicTextboxProps> = ({ data, onChange }) => {
	return (
		<Box sx={{ minWidth: 200, flex: 1 }}>
			<TextField
				fullWidth
				size="small"
				label={data.label}
				value={data.value || ""}
				onChange={(e) => onChange(data.id, e.target.value)}
				required={data.required}
				error={!!data.error}
				helperText={data.error}
				variant="outlined"
			/>
		</Box>
	);
};

export default DynamicTextbox;
