import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createDebouncedStorage } from "#/lib/debounced-storage.ts";

export interface FileNode {
	id: string;
	name: string;
	type: "file" | "folder";
	parentId?: string | null;
	children?: Array<string>; // For folders
	content?: string; // For files
	extension?: string; // For files
	createdAt: number;
	modifiedAt: number;
}

interface FileSystemState {
	nodes: Record<string, FileNode>;
	rootId: string;
	desktopFolderIds: Array<string>;
	createNode: (
		parentId: string,
		name: string,
		type: "file" | "folder",
		content?: string,
	) => void;
	renameNode: (id: string, newName: string) => void;
	moveNode: (id: string, newParentId: string) => void;
	deleteNode: (id: string) => void;
	addToDesktop: (folderId: string) => void;
	removeFromDesktop: (folderId: string) => void;
	getChildren: (parentId: string) => Array<FileNode>;
	getPath: (id: string) => Array<string>;
}

const createRoot = (): FileNode => ({
	id: "root",
	name: "Froot",
	type: "folder",
	parentId: null,
	children: [],
	createdAt: Date.now(),
	modifiedAt: Date.now(),
});

export const useFileSystemStore = create<FileSystemState>()(
	persist(
		immer((set, get) => ({
			nodes: {
				root: createRoot(),
			},
			rootId: "root",
			desktopFolderIds: [],
			createNode: (parentId, name, type, content) => {
				const id = crypto.randomUUID();

				set((state) => {
					const parent = state.nodes[parentId];

					if (!parent || parent.type !== "folder") return;

					const node: FileNode = {
						id,
						name,
						type,
						content,
						parentId,
						createdAt: Date.now(),
						modifiedAt: Date.now(),
					};

					if (type === "folder") {
						node.children = [];
					} else {
						node.content = content;
					}

					state.nodes[id] = node;
					parent.children = parent.children ? [...parent.children, id] : [id];
				});
			},
			renameNode: (id, newName) => {
				set((state) => {
					const node = state.nodes[id];

					if (node && newName.trim().length > 0) {
						node.name = newName.trim();
						node.modifiedAt = Date.now();
					}
				});
			},
			moveNode: (id, newParentId) => {
				set((state) => {
					const node = state.nodes[id];
					const newParent = state.nodes[newParentId];

					if (
						!node ||
						!newParent ||
						newParent.type !== "folder" ||
						node.parentId === newParentId
					) {
						return;
					}

					if (node.parentId) {
						const oldParent = state.nodes[node.parentId];

						if (oldParent?.children) {
							oldParent.children = oldParent.children.filter(
								(child) => child !== id,
							);
						}
					}

					newParent.children = newParent.children
						? [...newParent.children, id]
						: [id];
					node.parentId = newParentId;
					node.modifiedAt = Date.now();
				});
			},
			deleteNode: (id) => {
				set((state) => {
					const node = state.nodes[id];

					if (!node) {
						return;
					}

					const deleteRecusive = (nodeId: string) => {
						const node = state.nodes[nodeId];

						if (node.type === "folder" && node.children) {
							node.children.map((childId) => deleteRecusive(childId));
						}

						delete state.nodes[nodeId];
					};

					if (node.parentId) {
						const parent = state.nodes[node.parentId];

						if (parent.children) {
							parent.children = parent.children.filter((child) => child !== id);
						}
					}

					deleteRecusive(id);

					state.desktopFolderIds = state.desktopFolderIds.filter(
						(folderId) => folderId !== id,
					);
				});
			},
			addToDesktop: (folderId) => {
				set((state) => {
					if (
						state.nodes[folderId].type === "folder" &&
						!state.desktopFolderIds.includes(folderId)
					) {
						state.desktopFolderIds.push(folderId);
					}
				});
			},
			removeFromDesktop: (folderId) => {
				set((state) => {
					state.desktopFolderIds = state.desktopFolderIds.filter(
						(id) => id !== folderId,
					);
				});
			},
			getChildren: (parentId) => {
				const state = get();
				const parent = state.nodes[parentId];
				if (!parent || parent.type !== "folder" || !parent.children) {
					return [];
				}

				return parent.children
					.map((id) => state.nodes[id])
					.filter(Boolean) as Array<FileNode>;
			},
			getPath: (id) => {
				const state = get();
				const path: Array<string> = [];
				let current: FileNode | null = state.nodes[id];

				while (current) {
					path.unshift(current.id);
					current = current.parentId ? state.nodes[current.parentId] : null;
				}

				return path;
			},
		})),
		{
			name: "froxplorer-storage",
			storage: createDebouncedStorage(1000),
		},
	),
);
