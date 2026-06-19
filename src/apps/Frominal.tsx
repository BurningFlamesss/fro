import React, { useRef } from "react";

function Frominal() {
	const terminalRef = useRef(null);

	const username = "FRO";
	const hostname = "CUS";

	const generateWelcomeMessage = () => {
		return (
			<div>
				Welcome to FRO OS TERMINAL!!! 
        <pre>
        ╔══════════════════════════════╗ <br/>
        ║     Interactive Frominal     ║ <br/>
        ╚══════════════════════════════╝ <br/>
        </pre>
        Essential Commands: 
        <ul>
          <li>help - Usage guide</li>
        </ul>
        
			</div>
		);
	};
	return (
		<div
			className="w-full min-h-full overflow-y-auto bg-gray-900 text-primary font-mono p-5 box-border m-0"
			ref={terminalRef}
		>
			{generateWelcomeMessage()}
			<div className="p-0 m-0">
				<div className="my-4 p-0 wrap-break-word leading-none block w-full">
					<div className="flex items-baseline flex-nowrap my-4 p-0 w-full">
						<span className="shrink-0 mr-0">
							<span className="text-primary font-bold">{username}</span>
							<span className="text-background">@</span>
							<span className="text-primary font-bold">{hostname}</span>
							<span className="text-background">:</span>
							<span className="text-blue-500">~</span>
						</span>
						<input
							type="text"
							className="bg-transparent caret-primary border-none outline-none font-mono text-inherit flex-1 min-w-0 m-0 p-0"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Frominal;
