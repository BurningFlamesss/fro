import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

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
	addToDesktop: () => void;
	removeFromDesktop: () => void;
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
	immer((set, get) => ({
		nodes: {
			root: createRoot(),
		},
		rootId: "root",
		desktopFolderIds: [],
		createNode: (parentId, name, type, content) => {},
		renameNode: (id, newName) => {},
		moveNode: (id, newParentId) => {},
		addToDesktop: () => {},
		removeFromDesktop: () => {},
		deleteNode: (id) => {},
	})),
);
