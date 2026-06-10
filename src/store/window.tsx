import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
	type AppId,
	Apps,
	BACK_Z_INDEX,
	DEFAULT_WINDOW_INSTANCE_CONFIG,
	INITIAL_Z_INDEX,
	type WindowId,
	Windows,
} from "../constants";


interface WindowStore {
	windows: typeof Windows;
	apps: typeof Apps;
	nextZIndex: number;

	openApp: (appId: AppId) => void;
	focusWindow: (windowId: WindowId) => void;
	unfocusWindow: (windowId: WindowId) => void;
	closeWindow: (windowId: WindowId) => void;
}

export const useWindowStore = create<WindowStore>()(
	immer((set) => ({
		windows: Windows,
		apps: Apps,
		nextZIndex: INITIAL_Z_INDEX + 1,

		openApp: (appId) =>
			set((state) => {
				const app = state.apps[appId];

				if (app.singleInstance) {
					const existing = Object.values(state.windows).find(
						(win) => win?.appId === app.id,
					);
					if (existing) {
						existing.zIndex = state.nextZIndex++;
						return;
					}
				}

				const id = crypto.randomUUID();
				const key = `${app.id}_${id}` as WindowId;

				state.windows[key] = {
					...DEFAULT_WINDOW_INSTANCE_CONFIG,
					id: key,
					appId: app.id,
					title: app.title,
					theme: app?.theme ?? "",
					logo: app.logo,
					zIndex: state.nextZIndex++,
				};
			}),

		focusWindow: (windowId) =>
			set((state) => {
				const win = state.windows[windowId];
				if (win) {
					win.zIndex = state.nextZIndex++;
				}
			}),

		unfocusWindow: (windowId) =>
			set((state) => {
				const win = state.windows[windowId];
				if (win) {
					win.zIndex = BACK_Z_INDEX;
				}
			}),

		closeWindow: (windowId) =>
			set((state) => {
				delete state.windows[windowId];
			}),
	})),
);

export const findAppWindows = (windows: typeof Windows, appId: AppId) => {
	const wins = Object.values(windows);

	return wins.filter((win) => win?.appId === appId);
};
