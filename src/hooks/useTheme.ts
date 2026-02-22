import { useLocalStorage } from "./useLocalStorage";

export function useTheme() {
	const [darkMode, setDarkMode] = useLocalStorage("config-to-csv-theme", false);

	const toggleTheme = () => {
		setDarkMode(!darkMode);
	};

	return { darkMode, toggleTheme };
}
