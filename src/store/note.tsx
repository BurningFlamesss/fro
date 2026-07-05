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

			const node = Object.entries(nodes).find(
				([key, value]) => value.id === "notes",
			);

			let id: string = "";

			if (!node) {
				id = createNode("notes", "Untitled.frote", "file", "");
			} else {
				if (!node[1].children?.length) {
					id = createNode("notes", "Untitled.frote", "file", "");
				} else {
					id = node[1].children[0];
				}
			}

			return {
				tabs: [
					{
						id: id,
						title: "Untitled",
						content: "",
					},
				],
				activeTabId: id,

				addTab: (title = "Untitled", content = "") => {
					const id = createNode("notes", `${title}.frote`, "file", content);

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
							const tabId = createNode("notes", "Untitled.frote", "file", "");

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
						const node = Object.entries(nodes).find(
							([key, value]) => value.id === id,
						);

						if (tab) {
							tab.content = content;

							// This maynot be suitable logic though
							if (node) {
								updateNode(tab.id, content);
							} else {
								createNode("notes", `${tab.title}.frote`, "file", content);
							}
						}
					}),

				renameTab: (id, title) =>
					set((state) => {
						const tab = state.tabs.find((tab) => tab.id === id);
						const node = Object.entries(nodes).find(
							([key, value]) => value.id === id,
						);

						if (tab) {
							tab.title = title;
							renameNode(tab.id, `${title}.frote`);

							// This maynot be suitable logic though
							if (node) {
								renameNode(tab.id, `${title}.frote`);
							} else {
								createNode("notes", `${title}.frote`, "file", tab.content);
							}
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
