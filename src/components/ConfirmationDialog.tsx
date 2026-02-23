import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
} from "@mui/material";
import type { ConfirmOptions } from "../hooks/useConfirmationDialog";

type Props = {
	open: boolean;
	options: ConfirmOptions;
	onConfirm: () => void;
	onCancel: () => void;
};
const ConfirmationDialog = ({ open, options, onConfirm, onCancel }: Props) => {
	return (
		<Dialog open={open} onClose={onCancel}>
			<DialogTitle>{options.title ?? "Are you sure?"}</DialogTitle>

			<DialogContent>
				<DialogContentText>
					{options.description ?? "This action may overwrite existing data."}
				</DialogContentText>
			</DialogContent>

			<DialogActions>
				<Button onClick={onCancel}>{options.cancelText ?? "Cancel"}</Button>

				<Button variant="contained" color="error" onClick={onConfirm}>
					{options.confirmText ?? "Confirm"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmationDialog;
