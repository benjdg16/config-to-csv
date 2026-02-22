import React, { useState, useCallback } from "react";
import { Box } from "@mui/material";

interface ResizablePanelsProps {
	leftPanel: React.ReactNode;
	rightPanel: React.ReactNode;
}

export const ResizablePanels: React.FC<ResizablePanelsProps> = ({
	leftPanel,
	rightPanel,
}) => {
	const [leftWidth, setLeftWidth] = useState(40); // percentage
	const [isDragging, setIsDragging] = useState(false);

	const handleMouseDown = useCallback(() => {
		setIsDragging(true);
	}, []);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isDragging) return;

			const containerWidth = window.innerWidth;
			const newLeftWidth = (e.clientX / containerWidth) * 100;

			// Constrain between 20% and 80%
			if (newLeftWidth >= 20 && newLeftWidth <= 80) {
				setLeftWidth(newLeftWidth);
			}
		},
		[isDragging],
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
	}, []);

	React.useEffect(() => {
		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
			document.body.style.cursor = "col-resize";
			document.body.style.userSelect = "none";

			return () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
				document.body.style.cursor = "";
				document.body.style.userSelect = "";
			};
		}
	}, [isDragging, handleMouseMove, handleMouseUp]);

	return (
		<Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
			{/* Left Panel */}
			<Box
				sx={{
					width: `${leftWidth}%`,
					height: "100%",
					overflow: "hidden",
					p: 2,
				}}
			>
				{leftPanel}
			</Box>

			{/* Resizer */}
			<Box
				sx={{
					width: "4px",
					height: "100%",
					backgroundColor: "divider",
					cursor: "col-resize",
					position: "relative",
					"&:hover": {
						backgroundColor: "primary.main",
					},
					"&::after": {
						content: '""',
						position: "absolute",
						top: 0,
						left: "-4px",
						right: "-4px",
						bottom: 0,
						cursor: "col-resize",
					},
				}}
				onMouseDown={handleMouseDown}
			/>

			{/* Right Panel */}
			<Box
				sx={{
					width: `${100 - leftWidth}%`,
					height: "100%",
					overflow: "hidden",
					p: 2,
				}}
			>
				{rightPanel}
			</Box>
		</Box>
	);
};
