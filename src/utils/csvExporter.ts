import type { ComponentConfig, ComponentData } from "../types";

export function exportToCSV(
	data: ComponentData[][],
	components: ComponentConfig[],
	fileName: string,
	removeHeaders: boolean = false,
): void {
	if (data.length === 0) {
		alert("No data to export");
		return;
	}

	const headers = components.map((comp) => comp.label);
	const rows: string[][] = [];

	if (!removeHeaders) {
		rows.push(headers);
	}

	data.forEach((rowData) => {
		const row = components.map((comp) => {
			const item = rowData.find((d) => d.id === comp.id);
			return item?.value || "";
		});
		rows.push(row);
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
