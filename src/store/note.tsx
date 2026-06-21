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
}

export const useNoteStore = create<NoteStore>()(
	persist(
		immer((set, get) => ({
			tabs: [
				{
					id: crypto.randomUUID(),
					title: "Untitled",
					content: "",
				},
				{
					id: crypto.randomUUID(),
					title: "Untitled",
					content: "",
				},
			],
			activeTabId: "",
		})),
		{
			name: "frotes-storage",
		},
	),
);
