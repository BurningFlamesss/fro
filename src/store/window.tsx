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

	openApp: (AppId: AppId) => void;
	closeWindow: (WindowId: WindowId) => void;
}

export const useWindowStore = create<WindowStore>()(
	immer((set) => ({
		windows: Windows,
		apps: Apps,
		nextZIndex: INITIAL_Z_INDEX + 1,

		openApp: (AppId) =>
			set((state) => {
				Object.values(state.windows).forEach((window_ins) => {
					if (window_ins) {
						window_ins.focused = false;
					}
				});

				const app = state.apps[AppId];
				const id = crypto.randomUUID();
				const key = `${app.id}_${id}` as WindowId;

				if (app.singleInstance) {
					const existing = Object.values(state.windows).find(
						(window) => window?.appId === app.id,
					);

					if (existing) {
						existing.focused = true;
						existing.zIndex = state.nextZIndex++;

						return;
					}
				}

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

		closeWindow: (WindowId) =>
			set((state) => {
				const closing = state.windows[WindowId];

				delete state.windows[WindowId];

				if (closing?.focused) {
					const windows = Object.values(state.windows);

					windows.forEach((window_ins) => {
						if (window_ins) {
							window_ins.focused = false;
						}
					});

					const topWindow = Object.values(state.windows).sort((a, b) => {
						if (a && b) {
							return b.zIndex - a.zIndex;
						}
						return 0;
					})[0];

					if (topWindow) {
						topWindow.focused = true;
					}
				}
			}),
	})),
);
