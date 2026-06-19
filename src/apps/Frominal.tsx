import React, { useRef, useState } from "react";

type TerminalResponse = React.ReactNode | string;

type CommandHandler = (params: string[]) => TerminalResponse;

const commands: Record<string, CommandHandler> = {
	help: () => "Please read the docs",

	echo: (params) => params.join(" "),
};

function parseCommand(input: string) {
	const [primaryCommand, ...params] = input.trim().split(/\s+/);

	return {
		primaryCommand,
		params,
	};
}

function executeCommand(input: string): TerminalResponse {
	const { primaryCommand, params } = parseCommand(input);

	const handler = commands[primaryCommand];

	if (!handler) {
		return `Command not found: ${primaryCommand}`;
	}

	return handler(params);
}

type TerminalLine = {
	input: string;
	output: TerminalResponse;
};

function Frominal() {
	const terminalRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [terminalLines, setTerminalLines] = useState<Array<TerminalLine>>([]);
	const [command, setCommand] = useState<string>("");

	const username = "FRO";
	const hostname = "CUS";

	const generateWelcomeMessage = () => {
		return (
			<div className="text-background">
				Welcome to FRO OS TERMINAL!!!
				<pre className="text-primary">
					╔══════════════════════════════╗ <br />
          ║ Interactive Frominal         ║ <br />
					╚══════════════════════════════╝ <br />
				</pre>
				Essential Commands:
				<ul className="text-blue-500">
					<li>help - Usage guide</li>
				</ul>
			</div>
		);
	};
	return (
		<div
			className="w-full min-h-full overflow-y-auto bg-foreground text-primary font-mono p-5 box-border m-0"
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
							ref={inputRef}
							value={command}
							onChange={(e) => setCommand(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();

									if (command.trim()) {
										setTerminalLines((lines) => [
											...lines,
											{
												input: command,
												output: executeCommand(command),
											},
										]);
									}
									setCommand("");

									setTimeout(() => {
										if (inputRef.current) {
											inputRef.current.focus();
										}
									}, 100);
								}
							}}
							type="text"
							autoComplete="off"
							spellCheck={false}
							placeholder={"Type a command (Tab for autocomplete)"}
							className="bg-transparent caret-primary border-none outline-none font-mono text-inherit flex-1 min-w-0 m-0 p-0 placeholder:text-gray-400"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Frominal;
