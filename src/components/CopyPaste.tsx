import { useState } from "react";
import { Button, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";

interface CopyButtonProps {
	targetId: string;
}

const CopyButton = ({ targetId }: CopyButtonProps) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		const input = document.getElementById(targetId) as HTMLInputElement;
		if (input && input.value) {
			input.select();
			input.setSelectionRange(0, input.value.length); // mobile support
			navigator.clipboard.writeText(input.value).then(() => {
				setCopied(true);
				setTimeout(() => setCopied(false), 1000);
			});
		}
	};

	const input = document.getElementById(targetId) as HTMLInputElement | null;
	const isDisabled = !input || !input.value;

	return (
		<Tooltip
			title={isDisabled ? "Nothing to copy" : copied ? "Copied!" : "Copy"}
		>
			<span>
				{/* wrapping in span allows tooltip on disabled button */}
				<Button
					onClick={handleCopy}
					variant="text"
					endIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
					disabled={isDisabled}
				>
					{copied ? "Copied!" : "Copy"}
				</Button>
			</span>
		</Tooltip>
	);
};

export default CopyButton;
