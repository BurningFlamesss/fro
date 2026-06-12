import type React from "react";
import Frotes from "#/apps/Frotes.tsx";

export const INITIAL_Z_INDEX = 1000;
export const BACK_Z_INDEX = 0;
export const DEFAULT_THEME = "";

export interface AppInstance {
	id: AppId;
	name: string;
	title: string;
	logo: string;
	isPinned: boolean;
	component: React.ReactNode;
	theme?: string;
	singleInstance?: boolean;
}

export interface WindowInstance {
	id: WindowId;
	appId: AppId;
	title: string;
	logo: string;
	zIndex: number;
	x: number;
	y: number;
	width: number;
	height: number;
	minimized: boolean;
	maximized: boolean;
	theme?: string;
	component: React.ReactNode;
}

export type AppId =
	| "notes"
	| "settings"
	| "browser"
	| "terminal"
	| "calculator"
	| "calendar"
	| "music"
	| "store"
	| "game"
	| `app_${string}`;

export type WindowId = `${AppId}_${string}`;

export const Apps: Record<AppId, AppInstance> = {
	notes: {
		id: "notes",
		name: "Frotes",
		title: "Frotes",
		logo: "/apps/Notepad.svg",
		isPinned: true,
		theme: DEFAULT_THEME,
		component: <Frotes />,
	},
	settings: {
		id: "settings",
		name: "Frottings",
		title: "Frottings",
		logo: "/apps/Settings.svg",
		isPinned: true,
		theme: DEFAULT_THEME,
		component: <></>,
	},
	browser: {
		id: "browser",
		name: "Frowser",
		title: "Frowser",
		logo: "/apps/Browser.svg",
		isPinned: true,
		theme: DEFAULT_THEME,
		component: <>Hello World!!!</>,
	},
	terminal: {
		id: "terminal",
		name: "Frominal",
		title: "Frominal",
		logo: "/apps/Terminal.svg",
		isPinned: true,
		theme: DEFAULT_THEME,
		component: <></>,
	},
	calculator: {
		id: "calculator",
		name: "Froculator",
		title: "Froculator",
		logo: "/apps/Calculator.svg",
		isPinned: true,
		theme: DEFAULT_THEME,
		component: <></>,
	},
	calendar: {
		id: "calendar",
		name: "Frolendar",
		title: "Frolendar",
		logo: "/apps/Calendar.svg",
		isPinned: true,
		theme: DEFAULT_THEME,
		component: <></>,
	},
	music: {
		id: "music",
		name: "Frosic",
		title: "Frosic",
		logo: "/apps/Music.svg",
		isPinned: true,
		theme: DEFAULT_THEME,
		component: <></>,
	},
	store: {
		id: "store",
		name: "Frotore",
		title: "Frotore",
		logo: "/apps/Store.svg",
		isPinned: true,
		theme: DEFAULT_THEME,
		component: <></>,
	},
	game: {
		id: "game",
		name: "Froame",
		title: "Froame Launcher",
		logo: "/apps/Game.svg",
		isPinned: true,
		theme: DEFAULT_THEME,
		component: <></>,
	},
};

export const Windows: Partial<Record<WindowId, WindowInstance>> = {};

export const DEFAULT_WINDOW_INSTANCE_CONFIG: Omit<
	WindowInstance,
	"id" | "appId" | "title" | "logo"
> = {
	x: 500,
	y: 80,
	height: 400,
	width: 600,
	maximized: false,
	minimized: false,
	theme: "",
	zIndex: INITIAL_Z_INDEX,
	component: <></>,
};
