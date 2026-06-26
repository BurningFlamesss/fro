import { cn } from "#/lib/utils.ts";
import { evaluate } from "mathjs";
import { useCallback, useEffect, useRef, useState } from "react";

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
	const [memory, setMemory] = useState(0);
	const [angleMode, setAngleMode] = useState<"Deg" | "Rad">("Rad");
	const skipEvalRef = useRef(false);

	const evaluateExpression = useCallback(
		(expression: string) => {
			if (!expression) {
				setResult("");
				setError("");
				return;
			}

			try {
				const scope = angleMode === "Deg" ? {} : {};
				const response = evaluate(expression, scope);

				if (typeof response === "number" && Number.isFinite(response)) {
					setResult((+response.toFixed(10)).toString());
				} else {
					setResult("");
					setError("Invalid Result");
				}
			} catch (error) {
				setResult("");
				setError("Error");
			}
		},
		[angleMode],
	);

	useEffect(() => {
		if (skipEvalRef.current) {
			skipEvalRef.current = false;
			return;
		}
		evaluateExpression(expression);
	}, [expression, evaluateExpression]);

	const handleButtonClick = (value: string) => {
		setError("");

		switch (value) {
			case "C":
				setExpression("");
				setResult("");
				break;

			case "⌫":
				setExpression((exp) => exp.slice(0, -1));
				break;

			case "=":
				if (result && !error) {
					setExpression(result);
					setResult("");
					skipEvalRef.current = true;
				}
				break;

			case "MC":
				setMemory(0);
				break;

			case "MR":
				setExpression((exp) => exp + memory.toString());
				break;

			case "M+":
				setMemory((mem) => mem + (result ? parseFloat(result) : 0));
				break;

			case "M-":
				setMemory((mem) => mem - (result ? parseFloat(result) : 0));
				break;

			case "%":
				setExpression((exp) => `${exp}/100`);
				break;

			case "Deg":
				setAngleMode("Deg");
				break;

			case "Rad":
				setAngleMode("Rad");
				break;

			case "!":
				setExpression((exp) => {
					if (!exp) {
						return "factorial(0)";
					}

					const match = exp.match(/(\d+\.?\d*|\))$/); // From google
					if (match) {
						const before = exp.slice(0, -match[0].length);
						return `${before}factorial(${match[0]})`;
					}

					return exp;
				});
				break;

			default:
				setExpression((exp) => exp + value);
				break;
		}
	};

	return (
		<div className="flex flex-col p-4 gap-2 select-none">
			<div className="display bg-foreground p-3 rounded-xl text-right flex flex-col justify-end gap-y-1 min-h-24">
				<p
					className={cn(
						"text-2xl break-all transition-all ease-in-out duration-75",
						skipEvalRef.current ? "font-semibold text-5xl text-green-400" : "",
					)}
				>
					{expression}
				</p>
				<p className="text-sm font-semibold break-all text-green-400">{result}</p>
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
