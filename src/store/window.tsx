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
	minimizeWindow: (windowId: WindowId) => void;
	maximizeWindow: (windowId: WindowId) => void;
	restoreOriginalPosition: (windowId: WindowId) => void;
	closeWindow: (windowId: WindowId) => void;
	updateWindowRect: (
		windowId: WindowId,
		rect: { x: number; y: number; width: number; height: number },
	) => void;
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
						existing.minimized = false;
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
					minimized: false,
					zIndex: state.nextZIndex++,
				};
			}),

		focusWindow: (windowId) =>
			set((state) => {
				const win = state.windows[windowId];
				if (win) {
					win.minimized = false;
					win.zIndex = state.nextZIndex++;
				}
			}),

		minimizeWindow: (windowId) =>
			set((state) => {
				const win = state.windows[windowId];
				if (win && !win.minimized) {
					win.minimized = true;
					win.zIndex = BACK_Z_INDEX;
				}
			}),

		maximizeWindow: (windowId) =>
			set((state) => {
				const win = state.windows[windowId];
				if (win) {
					if (!win.maximized) {
						win.maximized = true;
						win.zIndex = state.nextZIndex++;
					} else {
						win.maximized = false;
					}
				}
			}),

		restoreOriginalPosition: (windowId) =>
			set((state) => {
				const win = state.windows[windowId];
				if (win && win.maximized) {
					win.maximized = false;
					win.zIndex = state.nextZIndex++;
				}
			}),

		closeWindow: (windowId) =>
			set((state) => {
				delete state.windows[windowId];
			}),

		updateWindowRect: (windowId, rect) =>
			set((state) => {
				const win = state.windows[windowId];
				if (win) {
					win.x = rect.x;
					win.y = rect.y;
					win.width = rect.width;
					win.height = rect.height;
				}
			}),
	})),
);

export const findAppWindows = (windows: typeof Windows, appId: AppId) => {
	return Object.values(windows).filter((win) => win?.appId === appId);
};
