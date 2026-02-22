import React, { useState, useCallback } from "react";
import {
	ThemeProvider,
	CssBaseline,
	AppBar,
	Toolbar,
	Typography,
	Box,
} from "@mui/material";
import { Download } from "@mui/icons-material";
import { lightTheme, darkTheme } from "./theme";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { ConfigField, FormData, AppSettings } from "./types";
import { parseConfig, generateConfigFromFields } from "./utils/configParser";
import { exportToCSV } from "./utils/csvExporter";
import ResizableLayout from "./components/ResizableLayout";
import ConfigEditor from "./components/ConfigEditor";
import ComponentRenderer from "./components/ComponentRenderer";
import ThemeToggle from "./components/ThemeToggle";

const DEFAULT_CONFIG = `textbox: Full Name
textbox*: Email Address
dropdown: Country | USA,Canada,UK,Australia
dropdown*: Status | Active,Inactive`;

const App: React.FC = () => {
	// Local storage for settings
	const [settings, setSettings] = useLocalStorage<AppSettings>(
		"config-to-csv-settings",
		{
			darkMode: false,
			removeHeaders: false,
			fileName: "",
		},
	);

	// State
	const [config, setConfig] = useLocalStorage<string>(
		"config-to-csv-config",
		DEFAULT_CONFIG,
	);
	const [fields, setFields] = useState<ConfigField[]>([]);
	const [formData, setFormData] = useState<FormData[]>([]);
	const [currentRow, setCurrentRow] = useState<FormData>({});

	const toggleDarkMode = () => {
		setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }));
	};

	const handleFileNameChange = (fileName: string) => {
		setSettings((prev) => ({ ...prev, fileName }));
	};

	const handleRemoveHeadersChange = (removeHeaders: boolean) => {
		setSettings((prev) => ({ ...prev, removeHeaders }));
	};

	const handleGenerate = useCallback(() => {
		const parsedFields = parseConfig(config);
		setFields(parsedFields);

		// Initialize current row
		const initialRow: FormData = {};
		parsedFields.forEach((field) => {
			initialRow[field.id] = "";
		});
		setCurrentRow(initialRow);

		// Clear existing data
		setFormData([]);
	}, [config]);

	const handleFieldChange = useCallback((fieldId: string, value: string) => {
		setCurrentRow((prev) => ({
			...prev,
			[fieldId]: value,
		}));
	}, []);

	const handleAddRow = useCallback(() => {
		setFormData((prev) => [...prev, { ...currentRow }]);

		// Reset current row
		const resetRow: FormData = {};
		fields.forEach((field) => {
			resetRow[field.id] = "";
		});
		setCurrentRow(resetRow);
	}, [currentRow, fields]);

	const handleDeleteRow = useCallback((index: number) => {
		setFormData((prev) => prev.filter((_, i) => i !== index));
	}, []);

	const handleSave = useCallback(() => {
		const fileName = settings.fileName || `config-to-csv_${Date.now()}`;
		exportToCSV(fields, formData, fileName, settings.removeHeaders);
	}, [fields, formData, settings.fileName, settings.removeHeaders]);

	const handleCancel = useCallback(() => {
		setFields([]);
		setFormData([]);
		setCurrentRow({});
	}, []);

	const handleEditConfig = useCallback(() => {
		const newConfig = generateConfigFromFields(fields);
		setConfig(newConfig);
	}, [fields, setConfig]);

	return (
		<ThemeProvider theme={settings.darkMode ? darkTheme : lightTheme}>
			<CssBaseline />

			<Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
				<AppBar position="static" elevation={1}>
					<Toolbar>
						<Download sx={{ mr: 1 }} />
						<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
							Config to CSV
						</Typography>
						<ThemeToggle
							darkMode={settings.darkMode}
							onToggle={toggleDarkMode}
						/>
					</Toolbar>
				</AppBar>

				<ResizableLayout
					leftPanel={
						<ConfigEditor
							config={config}
							fileName={settings.fileName}
							removeHeaders={settings.removeHeaders}
							onConfigChange={setConfig}
							onFileNameChange={handleFileNameChange}
							onRemoveHeadersChange={handleRemoveHeadersChange}
							onGenerate={handleGenerate}
						/>
					}
					rightPanel={
						<ComponentRenderer
							fields={fields}
							onFieldChange={handleFieldChange}
							onAddRow={handleAddRow}
							onDeleteRow={handleDeleteRow}
							onSave={handleSave}
							onCancel={handleCancel}
							data={formData}
							onEditConfig={handleEditConfig}
						/>
					}
				/>
			</Box>
		</ThemeProvider>
	);
};

export default App;
