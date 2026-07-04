import type React from "react";
import Froculator from "#/apps/Froculator.tsx";
import Frolendar from "#/apps/Frolendar.tsx";
import Frominal from "#/apps/Frominal.tsx";
import Froncher from "#/apps/Froncher.tsx";
import Frosic from "#/apps/Frosic.tsx";
import Frotes from "#/apps/Frotes.tsx";
import Frotore from "#/apps/Frotore.tsx";
import Frottings from "#/apps/Frottings.tsx";
import Frowser from "#/apps/Frowser.tsx";
import Froxplorer from "#/apps/Froxplorer.tsx";

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
	fileId?: string;
	folderId?: string;
}

export type AppId =
	| "notes"
	| "file_explorer"
	| "settings"
	| "browser"
	| "terminal"
	| "calculator"
	| "calendar"
	| "music"
	| "store"
	| "launcher"
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
	file_explorer: {
		id: "file_explorer",
		name: "Froxplorer",
		title: "Froxplorer",
		logo: "/apps/Explorer.svg",
		isPinned: true,
		theme: DEFAULT_THEME,
		component: <Froxplorer />,
	},
	settings: {
		id: "settings",
		name: "Frottings",
		title: "Frottings",
		logo: "/apps/Settings.svg",
		isPinned: true,
		theme: DEFAULT_THEME,
		component: <Frottings />,
	},
	browser: {
		id: "browser",
		name: "Frowser",
		title: "Frowser",
		logo: "/apps/Browser.svg",
		isPinned: true,
		theme: DEFAULT_THEME,
		component: <Frowser />,
	},
	terminal: {
		id: "terminal",
		name: "Frominal",
		title: "Frominal",
		logo: "/apps/Terminal.svg",
		isPinned: true,
		theme: DEFAULT_THEME,
		component: <Frominal />,
	},
	calculator: {
		id: "calculator",
		name: "Froculator",
		title: "Froculator",
		logo: "/apps/Calculator.svg",
		isPinned: true,
		theme: DEFAULT_THEME,
		component: <Froculator windowId="" />,
	},
	calendar: {
		id: "calendar",
		name: "Frolendar",
		title: "Frolendar",
		logo: "/apps/Calendar.svg",
		isPinned: true,
		theme: DEFAULT_THEME,
		component: <Frolendar />,
	},
	music: {
		id: "music",
		name: "Frosic",
		title: "Frosic",
		logo: "/apps/Music.svg",
		singleInstance: true,
		isPinned: false,
		theme: DEFAULT_THEME,
		component: <Frosic windowId="" />,
	},
	store: {
		id: "store",
		name: "Frotore",
		title: "Frotore",
		logo: "/apps/Store.svg",
		isPinned: false,
		theme: DEFAULT_THEME,
		component: <Frotore />,
	},
	launcher: {
		id: "launcher",
		name: "Froncher",
		title: "Froncher",
		logo: "/apps/Game.svg",
		isPinned: true,
		theme: DEFAULT_THEME,
		component: <Froncher />,
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
