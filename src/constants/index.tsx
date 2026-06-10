import type React from "react";

export const INITIAL_Z_INDEX = 1000;
export const DEFAULT_THEME = "";

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
	theme: string;
	zIndex: number;
	x: number;
	y: number;
	width: number;
	height: number;
	minimized: boolean;
	maximized: boolean;
	focused: boolean;
	isOpened: boolean;
}

export type appKeys = "notes" | "settings" | "browser" | "terminal" | "calculator" | "calendar" | "music" | "store" | "game" | `app_${string}`

export const Apps: Record<appKeys, AppInstance> = {
	notes: {
		id: "notes",
		name: "Frotes",
		title: "Frotes",
		logo: "/apps/Notepad.svg",
		isPinned: true,
		theme: DEFAULT_THEME,
		component: <></>,
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
		component: <></>,
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

export const Windows: Record<appKeys, Array<WindowInstance>> = {
	notes: [
		{
			id: "notes",
			appId: "notes",
			title: "",
			theme: DEFAULT_THEME,
			x: 0,
			y: 0,
			height: 0,
			width: 0,
			maximized: false,
			minimized: false,
			focused: false,
			zIndex: INITIAL_Z_INDEX,
			isOpened: false,
		},
	],
	settings: [
		{
			id: "settings",
			appId: "settings",
			title: "",
			theme: DEFAULT_THEME,
			x: 0,
			y: 0,
			height: 0,
			width: 0,
			maximized: false,
			minimized: false,
			focused: false,
			zIndex: INITIAL_Z_INDEX,
			isOpened: false,
		},
	],
	browser: [
		{
			id: "browser",
			appId: "browser",
			title: "",
			theme: DEFAULT_THEME,
			x: 0,
			y: 0,
			height: 0,
			width: 0,
			maximized: false,
			minimized: false,
			focused: false,
			zIndex: INITIAL_Z_INDEX,
			isOpened: false,
		},
	],
	terminal: [
		{
			id: "terminal",
			appId: "terminal",
			title: "",
			theme: DEFAULT_THEME,
			x: 0,
			y: 0,
			height: 0,
			width: 0,
			maximized: false,
			minimized: false,
			focused: false,
			zIndex: INITIAL_Z_INDEX,
			isOpened: false,
		},
	],
	calculator: [
		{
			id: "calculator",
			appId: "calculator",
			title: "",
			theme: DEFAULT_THEME,
			x: 0,
			y: 0,
			height: 0,
			width: 0,
			maximized: false,
			minimized: false,
			focused: false,
			zIndex: INITIAL_Z_INDEX,
			isOpened: false,
		},
	],
	calendar: [
		{
			id: "calendar",
			appId: "calendar",
			title: "",
			theme: DEFAULT_THEME,
			x: 0,
			y: 0,
			height: 0,
			width: 0,
			maximized: false,
			minimized: false,
			focused: false,
			zIndex: INITIAL_Z_INDEX,
			isOpened: false,
		},
	],
	music: [
		{
			id: "music",
			appId: "music",
			title: "",
			theme: DEFAULT_THEME,
			x: 0,
			y: 0,
			height: 0,
			width: 0,
			maximized: false,
			minimized: false,
			focused: false,
			zIndex: INITIAL_Z_INDEX,
			isOpened: false,
		},
	],
	store: [
		{
			id: "store",
			appId: "store",
			title: "",
			theme: DEFAULT_THEME,
			x: 0,
			y: 0,
			height: 0,
			width: 0,
			maximized: false,
			minimized: false,
			focused: false,
			zIndex: INITIAL_Z_INDEX,
			isOpened: false,
		},
	],
	game: [
		{
			id: "game",
			appId: "game",
			title: "",
			theme: DEFAULT_THEME,
			x: 0,
			y: 0,
			height: 0,
			width: 0,
			maximized: false,
			minimized: false,
			focused: false,
			zIndex: INITIAL_Z_INDEX,
			isOpened: false,
		},
	],
};