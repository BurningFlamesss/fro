import type { PersistStorage, StorageValue } from "zustand/middleware";

export function createDebouncedStorage<T>(delay = 1000): PersistStorage<T> {
	let timer: ReturnType<typeof setTimeout> | undefined;

	const storage = localStorage;

	return {
		getItem: (name) => {
			const value = storage.getItem(name);
			if (value === null) return null;

			try {
				return JSON.parse(value) as StorageValue<T>;
			} catch {
				return null;
			}
		},

		setItem: (name, value) => {
			clearTimeout(timer);

			timer = setTimeout(() => {
				storage.setItem(name, JSON.stringify(value));
			}, delay);
		},

		removeItem: (name) => {
			clearTimeout(timer);

			storage.removeItem(name);
		},
	};
}
