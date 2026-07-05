import type React from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useWindowStore } from "./window";

export interface Launchable {
	id: string;
	name: string;
	source: {
		type: "ftml" | "fromponent";
		code: string | React.ReactNode;
	};
	shortcut?:
		| {
				name: string;
		  }
		| false;
	logo: string;
}

interface LauncherStore {
	launchables: Record<string, Launchable>;
	recentLaunches: Array<{ id: string; launchedAt: number }>;
	launch: (data: Launchable) => void;
}

export const useLauncherStore = create<LauncherStore>()(
	immer((set) => {
		return {
			launchables: {
				app_not_found: {
					id: "app_not_found",
					name: "App not found",
					source: {
						type: "fromponent",
						code: <>Not found!!!</>,
					},
					logo: "",
				},
			},
			recentLaunches: [],
			launched: null,
			launch: (data) =>
				set((state) => {
					const launchable =
						state.launchables?.[data.id] || state.launchables.app_not_found;

					state.recentLaunches.push({
						id: launchable.id,
						launchedAt: Date.now(),
					});

					useWindowStore.getState().openApp("launcher", undefined, {
						launchSpecifications: {
							name: data.name,
							source: {
								type: data.source.type,
								code: data.source.code,
							},
						},
					});
				}),
		};
	}),
);
