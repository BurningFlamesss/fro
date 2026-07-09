import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface TerminalStore {
	commandExpression: string;
	setCommandExpression: (commandExpression: string) => void;
}

export const useTerminalStore = create<TerminalStore>()(
	immer((set) => ({
		commandExpression: "",
		setCommandExpression: (commandExpression: string) =>
			set((state) => {
				state.commandExpression = commandExpression;
			}),
	})),
);
