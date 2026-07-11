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

const default_tab = { id: "1", title: "New Tab", state: "search" } as const;

interface BrowserStore {
	pinned_sites: Array<PinnedSite>;
	suggestions: Array<Suggestion>;
	tabs: Array<Tab>;
	currentTabId: string;
	setCurrentTabId: (id: string) => void;
	editTab: (id: string, payload: Partial<Omit<Tab, "id">>) => void;
	closeTab: (id: string) => void;
	deleteTab: (id: string) => void;
	addTab: () => Tab;
	addAndUpdateTab: (patch: Partial<Tab>) => Tab;
}

const createNewTab = (): Tab => ({
	...default_tab,
	id: crypto.randomUUID(),
});

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
		tabs: [default_tab],
		currentTabId: "1",
		setCurrentTabId: (id) =>
			set((state) => {
				state.currentTabId = id;
			}),
		editTab: (id, payload) =>
			set((state) => {
				const tab = state.tabs.find((tab) => tab.id === id);

				if (tab) {
					Object.assign(tab, payload);
				}
			}),
		closeTab: (id) =>
            set((state) => {
                if (state.tabs.length === 1) {
                    const fresh = createNewTab();

                    state.tabs = [fresh];
                    state.currentTabId = fresh.id;

                    return;
                }

                const index = state.tabs.findIndex((tab) => tab.id === id);

                if (index === -1) return;

                state.tabs.splice(index, 1);

                if (id === state.currentTabId) {
                    const nextIndex = index > 0 ? index - 1 : 0;
                    state.currentTabId = state.tabs[nextIndex].id;
                }
            }),
		deleteTab: (id) =>
            set((state) => {
                const index = state.tabs.findIndex((tab) => tab.id === id);

                if (index !== -1) {
					state.tabs.splice(index, 1)
				};
            }),
		addTab: () => {
			const newTab = createNewTab();

			set((state) => {
				state.tabs.push(newTab);
				state.currentTabId = newTab.id;
			});

			return newTab;
		},
		addAndUpdateTab:  (patch) => {
            const newTab = { ...createNewTab(), ...patch };

            set((state) => {
                state.tabs.push(newTab);
                state.currentTabId = newTab.id;
            });

            return newTab;
        },,
	})),
);
