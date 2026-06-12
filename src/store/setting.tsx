import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface SettingStore {
	backgroundImage: string;
	setBackgroundImage: (imageUrl: string) => void;
}

export const useSettingStore = create<SettingStore>()(
	immer((set) => ({
		backgroundImage: "/backgrounds/cyber-rain.gif",

		setBackgroundImage: (imageUrl) =>
			set((state) => {
				state.backgroundImage = imageUrl;
			}),
	})),
);
