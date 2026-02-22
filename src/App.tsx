import React, { useState } from "react";
import {
	ThemeProvider,
	CssBaseline,
	AppBar,
	Toolbar,
	Typography,
	Box,
} from "@mui/material";
import type { ComponentConfig, ComponentData } from "./types";
import { ConfigPanel } from "./components/ConfigPanel";
import { ComponentsPanel } from "./components/ComponentsPanel";
import { ResizablePanels } from "./components/ResizablePanels";
import { ThemeToggle } from "./components/ThemeToggle";
import { useTheme } from "./hooks/useTheme";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { lightTheme, darkTheme } from "./theme";

function App() {
	const { darkMode, toggleTheme } = useTheme();
	const [removeHeaders, setRemoveHeaders] = useLocalStorage(
		"config-to-csv-remove-headers",
		false,
	);

	const [components, setComponents] = useState<ComponentConfig[]>([]);
	const [data, setData] = useState<ComponentData[][]>([]);
	const [fileName, setFileName] = useState("");

	const handleGenerate = (newComponents: ComponentConfig[]) => {
		setComponents(newComponents);
		setData([]); // Clear existing data when regenerating components
	};

	const handleAddRow = () => {
		const newRow = components.map((comp) => ({
			id: comp.id,
			value: "",
		}));
		setData((prev) => [...prev, newRow]);
	};

	const handleDeleteRow = (rowIndex: number) => {
		setData((prev) => prev.filter((_, index) => index !== rowIndex));
	};

	const handleDataChange = (rowIndex: number, id: string, value: string) => {
		setData((prev) => {
			const newData = [...prev];
			const existingItem = newData[rowIndex].find((item) => item.id === id);

			if (existingItem) {
				existingItem.value = value;
			} else {
				newData[rowIndex].push({ id, value });
			}

			return newData;
		});
	};

	const leftPanel = (
		<ConfigPanel
			fileName={fileName}
			onFileNameChange={setFileName}
			onGenerate={handleGenerate}
		/>
	);

	const rightPanel = (
		<ComponentsPanel
			components={components}
			data={data}
			removeHeaders={removeHeaders}
			fileName={fileName}
			onDataChange={handleDataChange}
			onAddRow={handleAddRow}
			onDeleteRow={handleDeleteRow}
			onRemoveHeadersChange={setRemoveHeaders}
		/>
	);

	return (
		<ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
			<CssBaseline />
			<Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
				<AppBar position="static" elevation={1}>
					<Toolbar>
						<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
							Config-to-CSV Generator
						</Typography>
						<ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />
					</Toolbar>
				</AppBar>

				<Box sx={{ flex: 1, overflow: "hidden" }}>
					<ResizablePanels leftPanel={leftPanel} rightPanel={rightPanel} />
				</Box>
			</Box>
		</ThemeProvider>
	);
}

export default App;
