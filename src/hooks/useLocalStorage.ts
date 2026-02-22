import { useState, useEffect } from "react";

export function useLocalStorage<T>(
	key: string,
	initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] {
	const [storedValue, setStoredValue] = useState<T>(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch {
			return initialValue;
		}
	});

	const setValue = (value: T | ((val: T) => T)) => {
		setStoredValue((prev) => {
			const valueToStore = value instanceof Function ? value(prev) : value;

			window.localStorage.setItem(key, JSON.stringify(valueToStore));
			return valueToStore;
		});
	};

	useEffect(() => {
		const handleStorage = (event: StorageEvent) => {
			if (event.key === key && event.newValue !== null) {
				setStoredValue(JSON.parse(event.newValue));
			}
		};

		window.addEventListener("storage", handleStorage);
		return () => window.removeEventListener("storage", handleStorage);
	}, [key]);

	return [storedValue, setValue] as const;
}
