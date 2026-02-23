import { useCallback, useRef, useState } from "react";

export type ConfirmOptions = {
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
};

type Resolver = (value: boolean) => void;

export function useConfirmationDialog() {
	const [open, setOpen] = useState(false);
	const [options, setOptions] = useState<ConfirmOptions>({});
	const resolverRef = useRef<Resolver | null>(null);

	const confirm = useCallback((customOptions?: ConfirmOptions) => {
		setOptions(customOptions ?? {});
		setOpen(true);

		return new Promise<boolean>((resolve) => {
			resolverRef.current = resolve;
		});
	}, []);

	const handleConfirm = () => {
		setOpen(false);
		resolverRef.current?.(true);
	};

	const handleCancel = () => {
		setOpen(false);
		resolverRef.current?.(false);
	};

	return {
		open,
		options,
		confirm,
		handleConfirm,
		handleCancel,
	};
}
