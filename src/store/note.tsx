import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const useNoteStore = create(
	persist(
		immer((set, get) => ({})),
		{
			name: "frotes-storage",
		},
	),
);
