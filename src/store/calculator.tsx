import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface CalculatorStore {
	expression: string;
	mode: "Rad" | "Deg";
	setCalculatorExpression: (expression: string, mode?: "Rad" | "Deg") => void;
}

export const useCalculatorStore = create<CalculatorStore>()(
	immer((set) => ({
		expression: "",
		mode: "Rad",
		setCalculatorExpression: (expression: string, mode?: "Rad" | "Deg") =>
			set((state) => {
				state.expression = expression;
				if (mode) {
					state.mode = mode;
				}
			}),
	})),
);
