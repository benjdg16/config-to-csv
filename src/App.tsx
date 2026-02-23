import { useState } from "react";
import {
	ThemeProvider,
	CssBaseline,
	AppBar,
	Toolbar,
	Typography,
	Box,
} from "@mui/material";
import type { ComponentConfig, ComponentData } from "./types";
import ConfigPanel from "./components/ConfigPanel";
import ComponentsPanel from "./components/ComponentsPanel";
import ResizablePanels from "./components/ResizablePanels";
import ThemeToggle from "./components/ThemeToggle";
import { useTheme } from "./hooks/useTheme";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { lightTheme, darkTheme } from "./theme";
import { generateComponentId } from "./utils/helper";
import { useConfirmationDialog } from "./hooks/useConfirmationDialog";
import ConfirmationDialog from "./components/ConfirmationDialog";

function App() {
	const { darkMode, toggleTheme } = useTheme();
	const [removeHeaders, setRemoveHeaders] = useLocalStorage(
		"config-to-csv-remove-headers",
		false,
	);
	const { open, options, confirm, handleConfirm, handleCancel } =
		useConfirmationDialog();

	const [components, setComponents] = useState<ComponentConfig[]>([]); // Blueprint for dynamic components
	const [data, setData] = useState<ComponentData[][]>([]);
	const [fileName, setFileName] = useState("");

	const addRows = (
		components: ComponentConfig[],
		noOfRowsToAdd: number,
		reset = false,
	) => {
		const rowsToAdd: ComponentData[][] = [];
		for (let i = 0; i < noOfRowsToAdd; i++) {
			const newRow: ComponentData[] = components.map((comp, index) => ({
				...comp,
				id: generateComponentId(comp.type, index), // Unique ID for each row item
				componentId: comp.id, // Link to ComponentConfig
				value: "",
				error: undefined,
			}));
			rowsToAdd.push(newRow);
		}

		if (reset) {
			setData(rowsToAdd);
		} else {
			setData((prev) => [...prev, ...rowsToAdd]);
		}
	};

	const handleGenerate = async (
		newComponents: ComponentConfig[],
		noOfRows: number,
	) => {
		if (components.length > 0 || data.length > 0) {
			const confirmed = await confirm({
				title: "Overwrite existing data?",
				description: "Generating will overwrite existing data. Continue?",
				confirmText: "Overwrite",
			});
			if (!confirmed) return;
		}

		setComponents(newComponents);
		// Note: We are just about to save the new configuration so the state is not updated yet.
		// Use the parameters instead
		addRows(newComponents, noOfRows, true);
	};

	const handleAddRow = () => {
		// Note: We know the configuration from state
		addRows(components, 1);
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
				newData[rowIndex].push({
					id,
					value,
					componentId: "",
					type: "textbox",
					label: "",
					required: false,
				});
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
			hasValidConfig={components.length > 0}
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
			<ConfirmationDialog
				open={open}
				options={options}
				onConfirm={handleConfirm}
				onCancel={handleCancel}
			/>
		</ThemeProvider>
	);
}

export default App;
