import React, { useState } from "react";
import {
	Box,
	TextField,
	Button,
	Typography,
	Alert,
	FormControlLabel,
	Checkbox,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Stack,
} from "@mui/material";
import { ExpandMore, Help } from "@mui/icons-material";
import { validateConfig } from "../utils/validation";

// TODO getConfigHelp

interface ConfigEditorProps {
	config: string;
	fileName: string;
	removeHeaders: boolean;
	onConfigChange: (config: string) => void;
	onFileNameChange: (fileName: string) => void;
	onRemoveHeadersChange: (removeHeaders: boolean) => void;
	onGenerate: () => void;
}

const ConfigEditor: React.FC<ConfigEditorProps> = ({
	config,
	fileName,
	removeHeaders,
	onConfigChange,
	onFileNameChange,
	onRemoveHeadersChange,
	onGenerate,
}) => {
	const [errors, setErrors] = useState<string[]>([]);

	const handleGenerate = () => {
		const configErrors = validateConfig(config);
		setErrors(configErrors);

		if (configErrors.length === 0) {
			onGenerate();
		}
	};

	return (
		<Box
			sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}
		>
			<Typography variant="h6" gutterBottom>
				Configuration
			</Typography>

			<Accordion sx={{ mb: 2 }}>
				<AccordionSummary expandIcon={<ExpandMore />}>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<Help fontSize="small" />
						<Typography>How to write config</Typography>
					</Box>
				</AccordionSummary>
				<AccordionDetails>
					<Typography
						variant="body2"
						component="pre"
						sx={{ whiteSpace: "pre-line", fontSize: "0.8rem" }}
					>
						{/* {getConfigHelp()} */}
					</Typography>
				</AccordionDetails>
			</Accordion>

			<TextField
				label="Configuration"
				multiline
				rows={10}
				value={config}
				onChange={(e) => onConfigChange(e.target.value)}
				placeholder="textbox: Full Name&#10;dropdown: Country | USA,Canada,UK"
				sx={{ mb: 2, flex: 1 }}
				error={errors.length > 0}
				helperText={
					errors.length > 0
						? `${errors.length} error(s) found`
						: "Write your form configuration here"
				}
			/>

			{errors.length > 0 && (
				<Box sx={{ mb: 2 }}>
					{errors.map((error, index) => (
						<Alert key={index} severity="error" sx={{ mb: 1 }}>
							{error}
						</Alert>
					))}
				</Box>
			)}

			<Stack spacing={2}>
				<TextField
					label="File Name (optional)"
					value={fileName}
					onChange={(e) => onFileNameChange(e.target.value)}
					placeholder="config-to-csv"
					size="small"
					helperText="Leave empty for auto-generated name"
				/>

				<FormControlLabel
					control={
						<Checkbox
							checked={removeHeaders}
							onChange={(e) => onRemoveHeadersChange(e.target.checked)}
						/>
					}
					label="Remove headers from CSV export"
				/>

				<Button
					variant="contained"
					onClick={handleGenerate}
					disabled={!config.trim()}
					fullWidth
				>
					Generate Form
				</Button>
			</Stack>
		</Box>
	);
};

export default ConfigEditor;
