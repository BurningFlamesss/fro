import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createDebouncedStorage } from "#/lib/debounced-storage.ts";
import { useFileSystemStore } from "./fs";

interface NoteTab {
	id: string;
	title: string;
	content: string;
}

interface NoteStore {
	tabs: Array<NoteTab>;
	activeTabId: string;

	addTab: (title?: string, content?: string) => NoteTab;
	closeTab: (id: string) => void;
	selectTab: (id: string) => void;
	updateContent: (id: string, content: string) => void;
	renameTab: (id: string, content: string) => void;
}

export const useNoteStore = create<NoteStore>()(
	persist(
		immer((set, get) => {
			const { createNode, updateNode, renameNode, deleteNode, nodes } =
				useFileSystemStore.getState();

			const firstTabId = createNode(
				"notes",
				"Untitled.frote",
				"file",
				"",
			);

			return {
				tabs: [
					{
						id: firstTabId,
						title: "Untitled",
						content: "",
					},
				],
				activeTabId: firstTabId,

				addTab: (title = "Untitled", content = "") => {
					const id = createNode(
						"notes",
						`${title}.frote`,
						"file",
						content,
					);

					const newTab: NoteTab = {
						id,
						title: title,
						content: content,
					};

					set((state) => {
						state.tabs.push(newTab);
						state.activeTabId = newTab.id;
					});

					return newTab;
				},

				closeTab: (id) =>
					set((state) => {
						const index = state.tabs.findIndex((tab) => tab.id === id);

						state.tabs.splice(index, 1);
						deleteNode(id);

						if (state.tabs.length === 0) {
							const tabId = createNode(
								"notes",
								"Untitled.frote",
								"file",
								"",
							);

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
							updateNode(tab.id, content);
						}
					}),

				renameTab: (id, title) =>
					set((state) => {
						const tab = state.tabs.find((tab) => tab.id === id);
						if (tab) {
							tab.title = title;
							renameNode(tab.id, `${title}.frote`);
						}
					}),
			};
		}),
		{
			name: "frotes-storage",
			storage: createDebouncedStorage(1000),
		},
	),
);
