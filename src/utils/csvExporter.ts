import type { ConfigField, FormData } from "../types";

export const exportToCSV = (
	fields: ConfigField[],
	dataRows: FormData[],
	fileName: string,
	removeHeaders: boolean = false,
): void => {
	if (dataRows.length === 0) {
		alert("No data to export");
		return;
	}

	const headers = fields.map((field) => field.label);
	const csvContent: string[] = [];

	// Add headers if not removing them
	if (!removeHeaders) {
		csvContent.push(headers.join(","));
	}

	// Add data rows
	dataRows.forEach((row) => {
		const rowData = fields.map((field) => {
			const value = row[field.id] || "";
			// Escape quotes and wrap in quotes if contains comma or quote
			if (value.includes(",") || value.includes('"') || value.includes("\n")) {
				return `"${value.replace(/"/g, '""')}"`;
			}
			return value;
		});
		csvContent.push(rowData.join(","));
	});

	// Create and download file
	const csvString = csvContent.join("\n");
	const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
	const link = document.createElement("a");

	if (link.download !== undefined) {
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute(
			"download",
			fileName.endsWith(".csv") ? fileName : `${fileName}.csv`,
		);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
};
