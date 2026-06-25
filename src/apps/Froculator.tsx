type ButtonType = "number" | "operator" | "equals" | "function" | "clear";

interface CalculatorButton {
	label: string;
	value: string;
	type: ButtonType;
	span?: boolean;
}

const buttons: Array<CalculatorButton> = [
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
		label: "%",
		value: "%",
		type: "operator",
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
		label: "=",
		value: "=",
		type: "equals",
	},
];

function Froculator() {
	return (
		<div className="flex flex-col p-4 gap-2 select-none">
			<div className="display bg-foreground p-3 rounded-xl text-right flex flex-col justify-end gap-y-1 min-h-18">
				<p className="text-sm break-all">EXPRESSION</p>
				<p className="text-2xl font-semibold break-all">RESULT</p>
			</div>

			<div className="grid grid-cols-8 gap-1.5 flex-1">
				{buttons.map((element, index) => (
					<button
						key={`calculator-button-${element}-${index}`}
						type="button"
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
