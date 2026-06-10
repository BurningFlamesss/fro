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
	{
		id: "browser",
		name: "Frowser",
		title: "Frowser",
		logo: "/apps/Browser.svg",
		isPinned: true,
		theme: DEFAULT_THEME,
		component: <></>,
	},
	{
		id: "terminal",
		name: "Frominal",
		title: "Frominal",
		logo: "/apps/Terminal.svg",
		isPinned: true,
		theme: DEFAULT_THEME,
		component: <></>,
	},
	{
		id: "calculator",
		name: "Froculator",
		title: "Froculator",
		logo: "/apps/Calculator.svg",
		isPinned: true,
		theme: DEFAULT_THEME,
		component: <></>,
	},
	{
		id: "calendar",
		name: "Frolendar",
		title: "Frolendar",
		logo: "/apps/Calendar.svg",
		isPinned: true,
		theme: DEFAULT_THEME,
		component: <></>,
	},
	{
		id: "music",
		name: "Frosic",
		title: "Frosic",
		logo: "/apps/Music.svg",
		isPinned: true,
		theme: DEFAULT_THEME,
		component: <></>,
	},
	{
		id: "store",
		name: "Frotore",
		title: "Frotore",
		logo: "/apps/Store.svg",
		isPinned: true,
		theme: DEFAULT_THEME,
		component: <></>,
	},
	{
		id: "game",
		name: "Froame",
		title: "Froame Launcher",
		logo: "/apps/Game.svg",
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
