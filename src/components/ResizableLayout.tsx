import React, { useState, useCallback } from "react";
import { Box, Paper } from "@mui/material";

interface ResizableLayoutProps {
	leftPanel: React.ReactNode;
	rightPanel: React.ReactNode;
}

const ResizableLayout: React.FC<ResizableLayoutProps> = ({
	leftPanel,
	rightPanel,
}) => {
	const [leftWidth, setLeftWidth] = useState(50); // percentage
	const [isDragging, setIsDragging] = useState(false);

	const handleMouseDown = useCallback(() => {
		setIsDragging(true);
	}, []);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isDragging) return;

			const container = document.getElementById("resizable-container");
			if (!container) return;

			const containerRect = container.getBoundingClientRect();
			const newLeftWidth =
				((e.clientX - containerRect.left) / containerRect.width) * 100;

			// Constrain between 20% and 80%
			const constrainedWidth = Math.min(80, Math.max(20, newLeftWidth));
			setLeftWidth(constrainedWidth);
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
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
		};
	}, [isDragging, handleMouseMove, handleMouseUp]);

	return (
		<Box
			id="resizable-container"
			sx={{
				display: "flex",
				height: "100vh",
				overflow: "hidden",
			}}
		>
			<Paper
				elevation={1}
				sx={{
					width: `${leftWidth}%`,
					display: "flex",
					flexDirection: "column",
					overflow: "hidden",
				}}
			>
				{leftPanel}
			</Paper>

			<Box
				onMouseDown={handleMouseDown}
				sx={{
					width: "4px",
					backgroundColor: "divider",
					cursor: "col-resize",
					"&:hover": {
						backgroundColor: "primary.main",
					},
					transition: "background-color 0.2s",
				}}
			/>

			<Paper
				elevation={1}
				sx={{
					width: `${100 - leftWidth}%`,
					display: "flex",
					flexDirection: "column",
					overflow: "hidden",
				}}
			>
				{rightPanel}
			</Paper>
		</Box>
	);
};

export default ResizableLayout;
