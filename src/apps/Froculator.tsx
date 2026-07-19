import {
	balanceParentheses,
	cn,
	degree2radian,
	removeLastToken,
} from "#/lib/utils.ts";
import { useCalculatorStore } from "#/store/calculator.tsx";
import { useWindowStore } from "#/store/window.tsx";
import { evaluate } from "mathjs";
import { useCallback, useEffect, useRef, useState } from "react";
import type { WindowInstance } from "../constants";

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

function Froculator({ windowId }: { windowId: string }) {
	const {
		expression: exp,
		mode,
		setCalculatorExpression,
	} = useCalculatorStore();
	const [expression, setExpression] = useState<string>(exp);
	const [result, setResult] = useState<string>("");
	const [error, setError] = useState<string>("");
	const [memory, setMemory] = useState(0);
	const [angleMode, setAngleMode] = useState<"Deg" | "Rad">(mode);
	const skipEvalRef = useRef(false);
	const { windows } = useWindowStore();
	const topWindow = Object.values(windows)
		.filter((win): win is WindowInstance => win !== undefined && !win.minimized)
		.reduce(
			(top, win) => (win.zIndex > (top?.zIndex ?? -1) ? win : top),
			null as WindowInstance | null,
		);

	const evaluateExpression = useCallback(
		(expression: string) => {
			if (!expression) {
				setResult("");
				setError("");
				return;
			}

			try {
				const scope =
					angleMode === "Deg"
						? {
								sin: (x: number) => Math.sin(degree2radian(x)),
								cos: (x: number) => Math.cos(degree2radian(x)),
								tan: (x: number) => Math.tan(degree2radian(x)),
								sinh: (x: number) => Math.sinh(degree2radian(x)),
								cosh: (x: number) => Math.cosh(degree2radian(x)),
								tanh: (x: number) => Math.tanh(degree2radian(x)),
							}
						: {};
				const response = evaluate(balanceParentheses(expression), scope);

				if (typeof response === "number" && Number.isFinite(response)) {
					setResult((+response.toFixed(10))?.toString());
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
		setCalculatorExpression("", "Rad");
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
				setExpression((exp) => removeLastToken(exp));
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
				setExpression((exp) => exp + memory?.toString());
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

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!topWindow) return;
			if (topWindow.id !== windowId) return;

			const { key, shiftKey } = e;

			if (/^[0-9.]$/.test(key)) {
				e.preventDefault();
				handleButtonClick(key);
				return;
			}

			switch (key) {
				case "+":
				case "-":
				case "*":
				case "/":
				case "(":
				case ")":
				case "^":
				case "%":
					e.preventDefault();
					handleButtonClick(key);
					break;
				case "!":
					e.preventDefault();
					handleButtonClick("!");
					break;
				case "Enter":
					e.preventDefault();
					handleButtonClick("=");
					break;
				case "Backspace":
					e.preventDefault();
					handleButtonClick("⌫");
					break;
				case "Escape":
					e.preventDefault();
					handleButtonClick("C");
					break;
				case "e":
					e.preventDefault();
					handleButtonClick("e");
					break;
				case "p":
					e.preventDefault();
					handleButtonClick("pi");
					break;
				case "l":
					e.preventDefault();
					handleButtonClick("log(");
					break;
				case "s":
					e.preventDefault();
					handleButtonClick("sin(");
					break;
				case "c":
					e.preventDefault();
					handleButtonClick("cos(");
					break;
				case "t":
					e.preventDefault();
					handleButtonClick("tan(");
					break;
				case "d":
					e.preventDefault();
					setAngleMode("Deg");
					break;
				case "r":
					e.preventDefault();
					setAngleMode("Rad");
					break;
				default:
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handleButtonClick]);

	return (
		<div className="flex flex-col p-4 gap-2 select-none">
			<div className="display glassmorphism p-3 rounded-xl text-right flex flex-col justify-end gap-y-1 min-h-24">
				<p
					className={cn(
						"text-2xl break-all transition-all ease-in-out duration-75",
						skipEvalRef.current ? "font-semibold text-5xl text-green-400" : "",
					)}
				>
					{expression}
				</p>
				<p className="text-sm font-semibold break-all text-green-400">
					{result}
				</p>
			</div>

			<div className="grid grid-cols-8 gap-1.5 flex-1">
				{buttons.map((element, index) => (
					<button
						key={`calculator-button-${element}-${index}`}
						type="button"
						onClick={() => handleButtonClick(element.value)}
						className={cn(
							"rounded-md font-medium text-sm flex justify-center items-center p-1 glassmorphism cursor-pointer",
							element.label === "Deg" && angleMode === "Deg"
								? "text-green-400"
								: "",
							element.label === "Rad" && angleMode === "Rad"
								? "text-green-400"
								: "",
						)}
					>
						{element.label}
					</button>
				))}
			</div>
		</div>
	);
}

export default Froculator;
