import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface CalculatorStore {
	expression: string;
	setExpression: (expression: string) => void;
}

export const useCalculatorStore = create<CalculatorStore>()(
	immer((set) => ({
		expression: "",
		setExpression: (expression: string) =>
			set((state) => {
				state.expression = expression;
			}),
	})),
);
