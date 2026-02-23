import React from "react";
import {
	Box,
	Card,
	CardContent,
	Typography,
	Button,
	IconButton,
	Checkbox,
	FormControlLabel,
	Alert,
	Divider,
} from "@mui/material";
import { Add, Delete, Download } from "@mui/icons-material";
import type { ComponentData } from "../types";
import { DynamicTextbox } from "./DynamicTextbox";
import { DynamicDropdown } from "./DynamicDropdown";
import { exportToCSV } from "../utils/csvExporter";

interface ComponentsPanelProps {
	hasValidConfig: boolean;
	data: ComponentData[][];
	removeHeaders: boolean;
	fileName: string;
	onDataChange: (rowIndex: number, id: string, value: string) => void;
	onAddRow: () => void;
	onDeleteRow: (rowIndex: number) => void;
	onRemoveHeadersChange: (remove: boolean) => void;
}

export const ComponentsPanel: React.FC<ComponentsPanelProps> = ({
	hasValidConfig,
	data,
	removeHeaders,
	fileName,
	onDataChange,
	onAddRow,
	onDeleteRow,
	onRemoveHeadersChange,
}) => {
	const handleDownload = () => {
		const finalFileName = fileName.trim() || `config-to-csv_${Date.now()}`;
		exportToCSV(data, finalFileName, removeHeaders);
	};

	if (!hasValidConfig) {
		return (
			<Card sx={{ height: "100%" }}>
				<CardContent
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						height: "100%",
					}}
				>
					<Typography variant="h6" color="textSecondary">
						Generate components from the configuration panel to get started
					</Typography>
				</CardContent>
			</Card>
		);
	}

	return (
		<Box
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 2,
				}}
			>
				<Typography variant="h6">Dynamic Form Components</Typography>
				<Button variant="contained" startIcon={<Add />} onClick={onAddRow}>
					Add Row
				</Button>
			</Box>

			<Box sx={{ flex: 1, overflow: "auto", mb: 2 }}>
				{data.length === 0 ? (
					<Alert severity="info">Click "Add Row" to start entering data</Alert>
				) : (
					data.map((rowData, rowIndex) => (
						<Card key={rowIndex} variant="outlined" sx={{ mb: 2 }}>
							<CardContent>
								<Box
									sx={{
										display: "flex",
										justifyContent: "between",
										alignItems: "flex-start",
										gap: 2,
									}}
								>
									<Typography variant="subtitle2" sx={{ minWidth: 60 }}>
										Row {rowIndex + 1}
									</Typography>

									<Box
										sx={{
											display: "flex",
											gap: 2,
											flex: 1,
											flexWrap: "wrap",
										}}
									>
										{rowData.map((data) => {
											return (
												<Box key={data.id} sx={{ minWidth: 200, flex: 1 }}>
													{data.type === "textbox" ? (
														<DynamicTextbox
															data={data}
															onChange={(id, value) =>
																onDataChange(rowIndex, id, value)
															}
														/>
													) : (
														<DynamicDropdown
															data={data}
															onChange={(id, value) =>
																onDataChange(rowIndex, id, value)
															}
														/>
													)}
												</Box>
											);
										})}
									</Box>

									<IconButton
										color="error"
										onClick={() => onDeleteRow(rowIndex)}
										size="small"
									>
										<Delete />
									</IconButton>
								</Box>
							</CardContent>
						</Card>
					))
				)}
			</Box>

			<Divider sx={{ my: 2 }} />

			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<FormControlLabel
					control={
						<Checkbox
							checked={removeHeaders}
							onChange={(e) => onRemoveHeadersChange(e.target.checked)}
						/>
					}
					label="Remove headers from CSV download"
				/>

				<Button
					variant="contained"
					color="primary"
					startIcon={<Download />}
					onClick={handleDownload}
					disabled={data.length === 0}
					size="large"
				>
					Download CSV
				</Button>
			</Box>
		</Box>
	);
};
