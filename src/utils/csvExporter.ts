import type { ComponentData } from "../types";

export function exportToCSV(
	data: ComponentData[][],
	fileName: string,
	removeHeaders: boolean = false,
): void {
	if (data.length === 0) {
		alert("No data to export");
		return;
	}

	const headers = data[0].map((rowData) => rowData.label);
	const rows: string[][] = [];

	if (!removeHeaders) {
		rows.push(headers);
	}

	data.forEach((rowData) => {
		const rowValues = rowData.map((item) => item.value);
		rows.push(rowValues);
	});

	const csvContent = rows
		.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
		.join("\n");

	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
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
}
