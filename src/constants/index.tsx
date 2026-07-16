import type React from "react";
import Froculator from "#/apps/Froculator.tsx";
import Frolendar from "#/apps/Frolendar.tsx";
import Frominal from "#/apps/Frominal.tsx";
import Froncher, { type LaunchSpecification } from "#/apps/Froncher.tsx";
import Frosic from "#/apps/Frosic.tsx";
import Frotes from "#/apps/Frotes.tsx";
import Frotore from "#/apps/Frotore.tsx";
import Frottings from "#/apps/Frottings.tsx";
import Frowser from "#/apps/Frowser.tsx";
import Froxplorer from "#/apps/Froxplorer.tsx";
import type { ComponentType } from "react";

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

export type WidgetProps = {};

export interface WidgetInstance {
	id: WidgetId;
	name: string;
	x: number;
	y: number;
	width: number;
	height: number;
	source:
		| {
				type: "html";
				code: string;
		  }
		| {
				type: "component";
				code: ComponentType<WidgetProps>;
		  };
	minimized: boolean;
	locked: boolean;
	hidden: boolean;
	props?: Record<string, unknown>;
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
	containerId?: string;
	launchSpecification?: LaunchSpecification;
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

export type WidgetId = `widget_${string}`;
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
		component: <Froxplorer windowId="" />,
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
		component: <Froncher windowId="" />,
	},
};

export const Widgets: Record<WidgetId, WidgetInstance> = {
	widget_quote: {
		id: "widget_quote",
		name: "Quote",
		x: 400,
		y: 200,
		width: 200,
		height: 100,
		minimized: false,
		hidden: false,
		locked: false,
		source: {
			type: "component",
			code: function Quote() {
				return (
					<main className="px-4 py-2 bg-white text-black">
						<p>
							It won't happen overnight. But if you quit, it won't happen at
							all.
						</p>
					</main>
				);
			},
		},
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
