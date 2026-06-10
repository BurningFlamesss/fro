import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Apps, INITIAL_Z_INDEX, Windows } from "../constants";

interface WindowStore {
	windows: typeof Windows;
	apps: typeof Apps;
	nextZIndex: number;

	openWindow: (
		windowKey: keyof typeof Windows,
		component?: React.ReactNode,
	) => void;
}

export const useWindowStore = create<WindowStore>()(
	immer((set) => ({
		windows: Windows,
		apps: Apps,
		nextZIndex: INITIAL_Z_INDEX + 1,

		openWindow: (windowKey, component = <></>) =>
			set((state) => {
				const windowInstance = state.windows[windowKey];
				windowInstance[0].isOpened = true
			}),
	})),
);
