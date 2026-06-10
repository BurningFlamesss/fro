import type React from "react";

export const INITIAL_Z_INDEX = 1000;
export const DEFAULT_THEME = "";

export const Apps: Array<AppInstance> = [
	{
		id: "notes",
		name: "Frotes",
		title: "Frotes",
		logo: "/apps/Notepad.svg",
		isPinned: true,
		theme: DEFAULT_THEME,
		component: <></>,
	},
	{
		id: "settings",
		name: "Frottings",
		title: "Frottings",
		logo: "/apps/Settings.svg",
		isPinned: true,
		theme: DEFAULT_THEME,
		component: <></>,
	},
];

export interface AppInstance {
	id: string;
	name: string;
	title: string;
	logo: string;
	isPinned: boolean;
	theme: string;
	component: React.ReactNode;
}

export interface WindowInstance {
	id: string;
	appId: string;
	title: string;
	zIndex: number;
	x: number;
	y: number;
	width: number;
	height: number;
	minimized: boolean;
	maximized: boolean;
	focused: boolean;
}
