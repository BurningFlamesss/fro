import { useState } from "react";

type ButtonType =
	| "number"
	| "operator"
	| "equals"
	| "function"
	| "clear"
	| "memory"
	| "utility";

interface CalculatorButton {
	label: string;
	value: string;
	type: ButtonType;
	span?: boolean;
}

const buttons: Array<CalculatorButton> = [
	{
		label: "MC",
		value: "MC",
		type: "memory",
	},
	{
		label: "MR",
		value: "MR",
		type: "memory",
	},
	{
		label: "M+",
		value: "M+",
		type: "memory",
	},
	{
		label: "M-",
		value: "M-",
		type: "memory",
	},
	{
		label: "Deg",
		value: "Deg",
		type: "utility",
	},
	{
		label: "Rad",
		value: "Rad",
		type: "utility",
	},
	{
		label: "C",
		value: "C",
		type: "clear",
	},
	{
		label: "⌫",
		value: "⌫",
		type: "clear",
	},
	{
		label: "!",
		value: "!",
		type: "operator",
	},
	{
		label: "%",
		value: "%",
		type: "operator",
	},
	{
		label: "(",
		value: "(",
		type: "operator",
	},
	{
		label: ")",
		value: ")",
		type: "operator",
	},
	{
		label: "/",
		value: "/",
		type: "operator",
	},
	{
		label: "*",
		value: "*",
		type: "operator",
	},
	{
		label: "-",
		value: "-",
		type: "operator",
	},
	{
		label: "+",
		value: "+",
		type: "operator",
	},
	{
		label: "log",
		value: "log(",
		type: "function",
	},
	{
		label: "sin",
		value: "sin(",
		type: "function",
	},
	{
		label: "cos",
		value: "cos(",
		type: "function",
	},
	{
		label: "tan",
		value: "tan(",
		type: "function",
	},

	{
		label: "1",
		value: "1",
		type: "number",
	},
	{
		label: "2",
		value: "2",
		type: "number",
	},
	{
		label: "3",
		value: "3",
		type: "number",
	},
	{
		label: "4",
		value: "4",
		type: "number",
	},
	{
		label: "e",
		value: "e",
		type: "number",
	},
	{
		label: "π",
		value: "pi",
		type: "number",
	},
	{
		label: "x²",
		value: "^2",
		type: "function",
	},
	{
		label: "xʸ",
		value: "^",
		type: "function",
	},

	{
		label: "5",
		value: "5",
		type: "number",
	},
	{
		label: "6",
		value: "6",
		type: "number",
	},
	{
		label: "7",
		value: "7",
		type: "number",
	},
	{
		label: "8",
		value: "8",
		type: "number",
	},

	{
		label: "ln",
		value: "ln(",
		type: "function",
	},
	{
		label: "sinh",
		value: "sinh(",
		type: "function",
	},
	{
		label: "cosh",
		value: "cosh(",
		type: "function",
	},
	{
		label: "tanh",
		value: "tanh(",
		type: "function",
	},
	{
		label: "9",
		value: "9",
		type: "number",
	},
	{
		label: "0",
		value: "0",
		type: "number",
	},
	{
		label: ".",
		value: ".",
		type: "number",
	},
	{
		label: "=",
		value: "=",
		type: "equals",
	},
];

function Froculator() {
	const [expression, setExpression] = useState<string>("");
	const [result, setResult] = useState<string>("");
	const [error, setError] = useState<string>("");

	const handleButtonClick = (value: string) => {
		switch (value) {
			case "=":
				break;

			default:
				setExpression((exp) => exp + value);
				break;
		}
	};

	return (
		<div className="flex flex-col p-4 gap-2 select-none">
			<div className="display bg-foreground p-3 rounded-xl text-right flex flex-col justify-end gap-y-1 min-h-18">
				<p className="text-sm break-all">{expression}</p>
				<p className="text-2xl font-semibold break-all">{result}</p>
			</div>

			<div className="grid grid-cols-8 gap-1.5 flex-1">
				{buttons.map((element, index) => (
					<button
						key={`calculator-button-${element}-${index}`}
						type="button"
						onClick={() => handleButtonClick(element.value)}
						className="rounded-md font-medium text-sm flex justify-center items-center p-1"
					>
						{element.label}
					</button>
				))}
			</div>
		</div>
	);
}

export default Froculator;
