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
    activeId: string;

}

export const useNoteStore = create<NoteStore>()(
	persist(
		immer((set, get) => ({
            tabs: [{
                id: crypto.randomUUID(),
                title: "Untitled",
                content: ""
            }],
            activeId: get().tabs[0].id,

            
        })),
		{
			name: "frotes-storage",
		},
	),
);
