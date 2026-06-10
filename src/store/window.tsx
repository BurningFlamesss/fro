import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
	type AppId,
	Apps,
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
	closeWindow: (windowId: WindowId) => void;
}

export const useWindowStore = create<WindowStore>()(
	immer((set) => ({
		windows: Windows,
		apps: Apps,
		nextZIndex: INITIAL_Z_INDEX + 1,

		openApp: (appId) =>
			set((state) => {
				unfocusAll(state.windows);

				const app = state.apps[appId];

				if (app.singleInstance) {
					const existing = Object.values(state.windows).find(
						(window_ins) => window_ins?.appId === app.id,
					);

					if (existing) {
						existing.focused = true;
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
					focused: true,
					zIndex: state.nextZIndex,
				};

				state.nextZIndex++;
			}),

		focusWindow: (windowId) =>
			set((state) => {
				unfocusAll(state.windows);

				const focusingWindow = state.windows[windowId];

				if (focusingWindow) {
					focusingWindow.focused = true;
					focusingWindow.zIndex = state.nextZIndex++;
				}
			}),

		closeWindow: (windowId) =>
			set((state) => {
				const closing = state.windows[windowId];

				delete state.windows[windowId];

				if (closing?.focused) {
					unfocusAll(state.windows);

					const topWindow = getTopWindow(state.windows);

					if (topWindow) {
						topWindow.focused = true;
					}
				}
			}),
	})),
);

const getTopWindow = (windows: typeof Windows) => {
	return Object.values(windows).sort((a, b) => {
		if (a && b) {
			return b.zIndex - a.zIndex;
		}
		return 0;
	})[0];
};

const unfocusAll = (windows: typeof Windows) => {
	const wins = Object.values(windows);

	wins.forEach((window_ins) => {
		if (window_ins) {
			window_ins.focused = false;
		}
	});
};

export const findAppWindows = (windows: typeof Windows, appId: AppId) => {
	const wins = Object.values(windows)

	return wins.filter((win) => win?.appId === appId)
}