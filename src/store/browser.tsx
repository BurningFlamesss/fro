import type { IconType } from "react-icons";
import { FaPenFancy, FaWikipediaW } from "react-icons/fa6";
import { PiGlobeDuotone } from "react-icons/pi";
import { SiExcalidraw, SiGutenberg } from "react-icons/si";
import { TbMathMaxMin } from "react-icons/tb";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type TabState =
	| "search"
	| "loading"
	| "results"
	| "surfing"
	| "error"
	| "warning";

export interface Tab {
	id: string;
	title: string;
	state: TabState;
	url?: string;
	query?: string;
	searchResponse?: {
		results?: Array<{
			title: string;
			url: string;
			content: string;
			rawContent?: string;
			score: number;
			publishedDate: string;
			favicon?: string;
		}>;
		images?: Array<{
			url: string;
			description?: string;
		}>;
		answer?: string;
	};
}

export interface PinnedSite {
	name: string;
	url: string;
	icon: IconType;
	color: string;
}

export interface Suggestion {
	icon: IconType;
	text: string;
}

interface BrowserStore {
	pinned_sites: Array<PinnedSite>;
	suggestions: Array<Suggestion>;
	tabs: Array<Tab>;
	editTabs: (id: string, payload: Partial<Omit<Tab, "id">>) => void;
	deleteTab: (id: string) => void;
}

export const useBrowserStore = create<BrowserStore>()(
	immer((set) => ({
		pinned_sites: [
			{
				name: "Wikipedia",
				url: "https://www.wikipedia.org/",
				icon: FaWikipediaW,
				color: "#ffffff",
			},
			{
				name: "Excalidraw",
				url: "https://excalidraw.com/",
				icon: SiExcalidraw,
				color: "#5865f2",
			},
			{
				name: "Desmos",
				url: "https://www.desmos.com/calculator",
				icon: TbMathMaxMin,
				color: "#00ff00",
			},
			{
				name: "Zenpen",
				url: "https://zenpen.io/",
				icon: FaPenFancy,
				color: "#00ffff",
			},
			{
				name: "Gutenberg",
				url: "https://www.gutenberg.org/",
				icon: SiGutenberg,
				color: "#ff0000",
			},
		],
		suggestions: [
			{ icon: PiGlobeDuotone, text: "frocus.tech" },
			{ icon: PiGlobeDuotone, text: "time.is" },
		],
		tabs: [{ id: "1", title: "New Tab", state: "search" }],
		editTabs: (id, payload) =>
			set((state) => {
				const tab = state.tabs.find((tab) => tab.id === id);

				if (tab) {
					Object.assign(tab, payload);
				}
			}),
		deleteTab: (id) =>
			set((state) => {
				const index = state.tabs.findIndex((tab) => tab.id === id);
                
				if (index !== -1) {
					state.tabs.splice(index, 1);
				}
			}),
	})),
);
