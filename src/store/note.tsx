import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface NoteTab {
	id: string;
	title: string;
	content: string;
}

interface NoteStore {
	tabs: Array<NoteTab>;
	activeTabId: string;

	addTab: () => void;
	closeTab: (id: string) => void;
	selectTab: (id: string) => void;
	updateContent: (id: string, content: string) => void;
}

export const useNoteStore = create<NoteStore>()(
	persist(
		immer((set, get) => {
			const firstTabId = crypto.randomUUID();

			return {
				tabs: [
					{
						id: firstTabId,
						title: "Untitled",
						content: "",
					},
					{
						id: crypto.randomUUID(),
						title: "Untitled",
						content: "",
					},
				],
				activeTabId: firstTabId,

				addTab: () => {
					const newTab: NoteTab = {
						id: crypto.randomUUID(),
						title: "Untitled",
						content: "",
					};

					set((state) => {
						state.tabs.push(newTab);
						state.activeTabId = newTab.id;
					});
				},

				closeTab: (id) =>
					set((state) => {
						const index = state.tabs.findIndex((tab) => tab.id === id);

						state.tabs.splice(index, 1);

						if (state.tabs.length === 0) {
							const tabId = crypto.randomUUID();

							state.tabs.push({
								id: tabId,
								title: "Untitled",
								content: "",
							});
						}

						if (state.activeTabId === id) {
							const newActiveTabIndex = Math.min(index, state.tabs.length - 1);
							state.activeTabId = state.tabs[newActiveTabIndex].id;
						}
					}),

				selectTab: (id) =>
					set((state) => {
						state.activeTabId = id;
					}),

				updateContent: (id, content) =>
					set((state) => {
						const tab = state.tabs.find((tab) => tab.id === id);

						if (tab) {
							tab.content = content;
						}
					}),
			};
		}),
		{
			name: "frotes-storage",
		},
	),
);
