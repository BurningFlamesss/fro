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
	})),
);
