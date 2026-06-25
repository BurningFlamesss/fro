import React from "react";

function Froculator() {
	return (
		<div className="flex flex-col p-4 gap-2 select-none">
			<div className="display bg-foreground p-3 rounded-xl text-right flex flex-col justify-end gap-y-1 min-h-18">
				<p className="text-sm break-all">EXPRESSION</p>
				<p className="text-2xl font-semibold break-all">RESULT</p>
			</div>

			<div className="grid grid-cols-8 gap-1.5 flex-1">
				{Array.from({ length: 48 }).map((element, index) => (
					<button
						key={`calculator-button-${element}-${index}`}
						type="button"
						className="rounded-md font-medium text-sm flex justify-center items-center p-1"
					>
						KEYS
					</button>
				))}
			</div>
		</div>
	);
}

export default Froculator;
