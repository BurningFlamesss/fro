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
	showInCollections?: boolean;
	extension?: Array<string>;
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
						code: (
							<main className="min-h-full w-full flex flex-col items-center justify-center overflow-hidden">
								<div className="min-h-full w-full flex flex-row items-center justify-center text-8xl font-black tracking-tight text-[#69C242]">
									4<img src="/logo.png" className="w-32 h-32" alt="" />4
								</div>
								<p className="text-xl font-semibold text-primary">
									Are you f*#king kidding me?
								</p>
								<p>
									Uh-oh! App not found. (*I meant*{" "}
									<span className="text-primary font-semibold">"Froking"</span>)
								</p>
							</main>
						),
					},
					logo: "/apps/Game.svg",
					showInCollections: false,
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
						title: data.name,
						logo: data.logo,
					});
				}),
		};
	}),
);
