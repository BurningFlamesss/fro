import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createDebouncedStorage } from "#/lib/debounced-storage.ts";

interface SettingStore {
	backgroundImage: Record<"url" | "position", string>;
	location: string;
	setBackgroundImage: (imageUrl: string, position: string) => void;
	setLocation: (location: string) => void;
}

export const useSettingStore = create<SettingStore>()(
	persist(
		immer((set) => ({
			backgroundImage: {
				url: "/backgrounds/forest.gif",
				position: "center",
			},
			location: "Butwal",

			setBackgroundImage: (imageUrl, position) =>
				set((state) => {
					state.backgroundImage.url = imageUrl;
					state.backgroundImage.position = position;
				}),

			setLocation: (location) =>
				set((state) => {
					const trimmed = location.trim();
					if (!trimmed) {
						return;
					}
					state.location = trimmed;
				}),
		})),
		{
			name: "frottings-storage",
			storage: createDebouncedStorage(1000),
		},
	),
);
