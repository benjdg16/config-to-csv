import React, { useState } from "react";
import {
	Box,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Button,
	Typography,
	Alert,
	Stack,
	FormHelperText,
} from "@mui/material";
import type { ConfigField, FormData, ValidationError } from "../types";
import { validateFormData } from "../utils/validation";

interface DynamicFormProps {
	fields: ConfigField[];
	onFieldChange: (fieldId: string, value: string) => void;
	onAddRow: () => void;
	onDeleteRow: (index: number) => void;
	onSave: () => void;
	onCancel: () => void;
	data: FormData[];
}

const DynamicForm: React.FC<DynamicFormProps> = ({
	fields,
	onFieldChange,
	onAddRow,
	onDeleteRow,
	onSave,
	onCancel,
	data,
}) => {
	const [currentRow, setCurrentRow] = useState<FormData>({});
	const [errors, setErrors] = useState<ValidationError[]>([]);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);

	// useEffect(() => {
	// 	// Initialize current row with empty values
	// 	const initialRow: FormData = {};
	// 	fields.forEach((field) => {
	// 		initialRow[field.id] = "";
	// 	});
	// 	setCurrentRow(initialRow);
	// }, [fields]);

	const handleFieldChange = (fieldId: string, value: string) => {
		setCurrentRow((prev) => ({
			...prev,
			[fieldId]: value,
		}));
		onFieldChange(fieldId, value);

		// Clear errors for this field
		setErrors((prev) => prev.filter((error) => error.fieldId !== fieldId));
	};

	const handleAddRow = () => {
		const validationErrors = validateFormData(fields, currentRow);
		setErrors(validationErrors);

		if (validationErrors.length === 0) {
			if (editingIndex !== null) {
				// Update existing row
				const newData = [...data];
				newData[editingIndex] = { ...currentRow };
				setEditingIndex(null);
			} else {
				// Add new row
				onAddRow();
			}

			// Reset form
			const resetRow: FormData = {};
			fields.forEach((field) => {
				resetRow[field.id] = "";
			});
			setCurrentRow(resetRow);
		}
	};

	const handleEdit = (index: number) => {
		setCurrentRow(data[index]);
		setEditingIndex(index);
	};

	const handleCancelEdit = () => {
		setEditingIndex(null);
		const resetRow: FormData = {};
		fields.forEach((field) => {
			resetRow[field.id] = "";
		});
		setCurrentRow(resetRow);
	};

	const hasErrors = (fieldId: string): boolean => {
		return errors.some((error) => error.fieldId === fieldId);
	};

	const getFieldError = (fieldId: string): string => {
		const error = errors.find((error) => error.fieldId === fieldId);
		return error ? error.message : "";
	};

	if (fields.length === 0) {
		return (
			<Box sx={{ p: 3, textAlign: "center" }}>
				<Typography variant="h6" color="text.secondary">
					Generate a form from the configuration to start adding data
				</Typography>
			</Box>
		);
	}

	return (
		<Box
			sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}
		>
			<Typography variant="h6" gutterBottom>
				Dynamic Form ({data.length} rows)
			</Typography>

			{/* Current form */}
			<Box
				sx={{ mb: 3, p: 2, border: 1, borderColor: "divider", borderRadius: 1 }}
			>
				<Typography variant="subtitle2" gutterBottom>
					{editingIndex !== null
						? `Editing Row ${editingIndex + 1}`
						: "Add New Row"}
				</Typography>

				<Stack spacing={2}>
					{fields.map((field) => (
						<Box key={field.id}>
							{field.type === "textbox" ? (
								<TextField
									label={field.label}
									value={currentRow[field.id] || ""}
									onChange={(e) => handleFieldChange(field.id, e.target.value)}
									required={field.required}
									error={hasErrors(field.id)}
									helperText={getFieldError(field.id)}
									fullWidth
									size="small"
								/>
							) : (
								<FormControl
									fullWidth
									size="small"
									error={hasErrors(field.id)}
									required={field.required}
								>
									<InputLabel>{field.label}</InputLabel>
									<Select
										value={currentRow[field.id] || ""}
										onChange={(e) =>
											handleFieldChange(field.id, e.target.value)
										}
										label={field.label}
									>
										<MenuItem value="">
											<em>Select an option</em>
										</MenuItem>
										{field.options?.map((option) => (
											<MenuItem key={option} value={option}>
												{option}
											</MenuItem>
										))}
									</Select>
									{hasErrors(field.id) && (
										<FormHelperText>{getFieldError(field.id)}</FormHelperText>
									)}
								</FormControl>
							)}
						</Box>
					))}

					<Box sx={{ display: "flex", gap: 1 }}>
						<Button variant="contained" onClick={handleAddRow} size="small">
							{editingIndex !== null ? "Update Row" : "Add Row"}
						</Button>
						{editingIndex !== null && (
							<Button
								variant="outlined"
								onClick={handleCancelEdit}
								size="small"
							>
								Cancel Edit
							</Button>
						)}
					</Box>
				</Stack>
			</Box>

			{/* Data table */}
			<Box sx={{ flex: 1, overflow: "auto", mb: 2 }}>
				{data.length > 0 ? (
					<Box>
						<Typography variant="subtitle2" gutterBottom>
							Current Data:
						</Typography>
						{data.map((row, index) => (
							<Box
								key={index}
								sx={{
									p: 1,
									mb: 1,
									border: 1,
									borderColor: "divider",
									borderRadius: 1,
									backgroundColor:
										editingIndex === index
											? "action.selected"
											: "background.paper",
								}}
							>
								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										mb: 1,
									}}
								>
									<Typography variant="caption" fontWeight="bold">
										Row {index + 1}
									</Typography>
									<Box>
										<Button
											size="small"
											onClick={() => handleEdit(index)}
											sx={{ mr: 1 }}
										>
											Edit
										</Button>
										<Button
											size="small"
											color="error"
											onClick={() => onDeleteRow(index)}
										>
											Delete
										</Button>
									</Box>
								</Box>
								{fields.map((field) => (
									<Typography key={field.id} variant="body2">
										<strong>{field.label}:</strong> {row[field.id] || "(empty)"}
									</Typography>
								))}
							</Box>
						))}
					</Box>
				) : (
					<Alert severity="info">
						No data yet. Add some rows using the form above.
					</Alert>
				)}
			</Box>

			{/* Action buttons */}
			<Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
				<Button variant="outlined" onClick={onCancel}>
					Cancel
				</Button>
				<Button
					variant="contained"
					onClick={onSave}
					disabled={data.length === 0}
				>
					Save as CSV
				</Button>
			</Box>
		</Box>
	);
};

export default DynamicForm;
