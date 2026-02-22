import React, { useState } from "react";
import {
	Box,
	Card,
	CardContent,
	TextField,
	Button,
	Typography,
	Alert,
	Divider,
} from "@mui/material";
import type { ComponentConfig } from "../types";
import { parseConfig } from "../utils/configParser";
import { validateFileName } from "../utils/validation";

interface ConfigPanelProps {
	fileName: string;
	onFileNameChange: (fileName: string) => void;
	onGenerate: (components: ComponentConfig[]) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
	fileName,
	onFileNameChange,
	onGenerate,
}) => {
	const [configText, setConfigText] = useState("");
	const [errors, setErrors] = useState<string[]>([]);
	const [fileNameError, setFileNameError] = useState<string | null>(null);

	const handleGenerate = () => {
		const fileError = validateFileName(fileName);
		setFileNameError(fileError);

		const result = parseConfig(configText);
		setErrors(result.errors);

		if (result.isValid && result.components && !fileError) {
			onGenerate(result.components);
		}
	};

	const exampleConfig = `textbox: Full Name
dropdown: Gender, Male, Female, Other
textbox: Email Address
dropdown: Department, Sales, Marketing, IT, HR`;

	return (
		<Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
			<CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
				<Typography variant="h6" gutterBottom>
					Configuration Panel
				</Typography>

				<TextField
					label="CSV File Name (optional)"
					value={fileName}
					onChange={(e) => onFileNameChange(e.target.value)}
					error={!!fileNameError}
					helperText={fileNameError || "Leave empty for auto-generated name"}
					fullWidth
					size="small"
					sx={{ mb: 2 }}
				/>

				<Divider sx={{ my: 2 }} />

				<Typography variant="subtitle1" gutterBottom>
					Component Configuration
				</Typography>

				<Typography variant="body2" color="textSecondary" gutterBottom>
					Define your form components using simple syntax. Each line creates a
					component:
				</Typography>

				<Box sx={{ mb: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
					<Typography variant="caption" display="block" gutterBottom>
						<strong>Examples:</strong>
					</Typography>
					<Typography
						variant="caption"
						component="pre"
						sx={{ fontFamily: "monospace" }}
					>
						{exampleConfig}
					</Typography>
				</Box>

				<TextField
					multiline
					rows={10}
					placeholder="Enter your configuration here..."
					value={configText}
					onChange={(e) => setConfigText(e.target.value)}
					fullWidth
					sx={{ mb: 2, flex: 1 }}
					helperText="Format: 'textbox: Label' or 'dropdown: Label, Option1, Option2, Option3'"
				/>

				{errors.length > 0 && (
					<Alert severity="error" sx={{ mb: 2 }}>
						<Typography variant="subtitle2" gutterBottom>
							Configuration Errors:
						</Typography>
						{errors.map((error, index) => (
							<Typography key={index} variant="body2">
								• {error}
							</Typography>
						))}
					</Alert>
				)}

				<Button
					variant="contained"
					onClick={handleGenerate}
					disabled={!configText.trim()}
					fullWidth
					size="large"
				>
					Generate Components
				</Button>
			</CardContent>
		</Card>
	);
};
