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
	// extension?: Array<string>;
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
			launch: (data) =>
				set((state) => {
					state.recentLaunches.push({
						id: data.id,
						launchedAt: Date.now(),
					});

					useWindowStore.getState().openApp("launcher", undefined, {
						launchSpecification: {
							name: data.name,
							source: data.source,
						},
					});
				}),
		};
	}),
);
