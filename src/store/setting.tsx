import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createDebouncedStorage } from "#/lib/debounced-storage.ts";

interface SettingStore {
	backgroundImage: Record<"url" | "position", string>;
	setBackgroundImage: (imageUrl: string, position: string) => void;
}

export const useSettingStore = create<SettingStore>()(
	persist(
		immer((set) => ({
			backgroundImage: {
				url: "/backgrounds/forest.gif",
				position: "center",
			},

			setBackgroundImage: (imageUrl, position) =>
				set((state) => {
					state.backgroundImage.url = imageUrl;
					state.backgroundImage.position = position;
				}),
		})),
		{
			name: "frottings-storage",
			storage: createDebouncedStorage(1000),
		},
	),
);
