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
	ensureDefaultTab: () => void;

	addTab: (title?: string, content?: string, identifier?: string) => NoteTab;
	closeTab: (id: string) => void;
	selectTab: (id: string) => void;
	updateContent: (id: string, content: string) => void;
	renameTab: (id: string, content: string) => void;
}

export const useNoteStore = create<NoteStore>()(
	persist(
		immer((set, get) => {
			return {
				tabs: [],
				activeTabId: "",

				ensureDefaultTab: () =>
					set((state) => {
						if (state.tabs.length === 0) {
							const id = useFileSystemStore
								.getState()
								.createNode("notes", "Untitled.frote", "file", "");
							state.tabs.push({ id, title: "Untitled", content: "" });
							state.activeTabId = id;
						}
					}),

				addTab: (title = "Untitled", content = "", identifier) => {
					const id = identifier
						? identifier
						: useFileSystemStore
								.getState()
								.createNode("notes", `${title}.frote`, "file", content);

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
						// deleteNode(id); // We actually wanna preserve this because that's the motive of adding fs.

						if (state.tabs.length === 0) {
							const tabId = useFileSystemStore
								.getState()
								.createNode("notes", "Untitled.frote", "file", "");

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
						if (!tab) return;
						tab.content = content;

						const latestNodes = useFileSystemStore.getState().nodes;
						const fileNode = latestNodes[id];

						if (fileNode) {
							useFileSystemStore.getState().updateNode(id, content);
						} else {
							useFileSystemStore
								.getState()
								.createNode("notes", `${tab.title}.frote`, "file", content);
						}
					}),

				renameTab: (id, title) =>
					set((state) => {
						const tab = state.tabs.find((tab) => tab.id === id);
						if (!tab) return;

						tab.title = title;

						const latestNodes = useFileSystemStore.getState().nodes;
						const fileNode = latestNodes[id];

						if (fileNode) {
							useFileSystemStore.getState().renameNode(id, `${title}.frote`);
						} else {
							useFileSystemStore
								.getState()
								.createNode("notes", `${title}.frote`, "file", tab.content);
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
