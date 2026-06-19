import React, { type Ref, useEffect, useRef, useState } from "react";
import { useWindowStore } from "#/store/window.tsx";
import type { AppInstance, WindowInstance } from "../constants";

type TerminalResponse = React.ReactNode | string;

type CommandHandler = (params: string[]) => TerminalResponse;

type TerminalLine = {
	input: string;
	output: TerminalResponse;
};

function parseCommand(input: string) {
	const [primaryCommand, ...params] = input.trim().split(/\s+/);

	return {
		primaryCommand,
		params,
	};
}

function Frominal() {
	const { apps, openApp, windows, closeWindow, pinApp, unpinApp } =
		useWindowStore();
	const terminalRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [terminalLines, setTerminalLines] = useState<Array<TerminalLine>>([]);
	const [command, setCommand] = useState<string>("");
	const [isProcessing, setIsProcessing] = useState(false);

	const username = "FRO";
	const hostname = "CUS";

	function executeCommand(input: string): TerminalResponse {
		const { primaryCommand, params } = parseCommand(input);

		const handler = commands[primaryCommand];

		if (!handler) {
			return (
				<p className="text-red-500">Command not found: {primaryCommand}</p>
			);
		}

		return handler(params);
	}

	const commands: Record<string, CommandHandler> = {
		help: () => "Please read the docs",

		echo: (params) => params.join(" "),

		clear: () => {
			setTerminalLines([]);
		},

		open: (params) => {
			const response: Array<AppInstance["name"]> = [];

			params.forEach((param) => {
				const search = param.toLowerCase();

				const app = Object.values(apps).find(
					(app) =>
						app.id.toLowerCase() === search ||
						app.name.toLowerCase() === search ||
						app.title.toLowerCase() === search,
				);

				if (app) {
					openApp(app.id);
					response.push(app.name);
				}
			});

			if (!response.length) {
				return <p className="text-red-500">No valid app found</p>;
			}

			return (
				<ul>
					Opened:
					{response.map((app, index) => (
						<li key={`opened-app-${index}-${app}`}>{app}</li>
					))}
				</ul>
			);
		},

		pin: (params) => {
			const response: Array<AppInstance["name"]> = [];

			params.forEach((param) => {
				const search = param.toLowerCase();

				const app = Object.values(apps).find(
					(app) =>
						app.id.toLowerCase() === search ||
						app.name.toLowerCase() === search ||
						app.title.toLowerCase() === search,
				);

				if (app) {
					pinApp(app.id);
					response.push(app.name);
				}
			});

			if (!response.length) {
				return <p className="text-red-500">No valid app found</p>;
			}

			return (
				<ul>
					Pinned:
					{response.map((app, index) => (
						<li key={`pinned-app-${index}-${app}`}>{app}</li>
					))}
				</ul>
			);
		},

		unpin: (params) => {
			const response: Array<AppInstance["name"]> = [];

			params.forEach((param) => {
				const search = param.toLowerCase();

				const app = Object.values(apps).find(
					(app) =>
						app.id.toLowerCase() === search ||
						app.name.toLowerCase() === search ||
						app.title.toLowerCase() === search,
				);

				if (app) {
					unpinApp(app.id);
					response.push(app.name);
				}
			});

			if (!response.length) {
				return <p className="text-red-500">No valid app found</p>;
			}

			return (
				<ul>
					Unpinned:
					{response.map((app, index) => (
						<li key={`unpinned-app-${index}-${app}`}>{app}</li>
					))}
				</ul>
			);
		},

		"process.terminate.all": () => {
			const visibleWindows = Object.values(windows).filter(
				(win): win is WindowInstance => win !== undefined,
			);

			visibleWindows.map((win) => closeWindow(win.id));
		},

		calc: (params) => {
			const equation = params.join(" ");
			if (!equation) {
				return;
			}

			if (!/^[0-9+\-*/().%\s]+$/.test(equation)) {
				return <p className="text-red-500">Invalid characters</p>;
			}
			try {
				const answer = Function(`"use strict"; return (${equation})`)();

				return answer;
			} catch (error) {
				return <p className="text-red-500">Not a valid equation</p>;
			}
		},
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();

			setIsProcessing(true);

			if (command.trim()) {
				const output = executeCommand(command);

				setTerminalLines((lines) => [
					...lines,
					{
						input: command,
						output,
					},
				]);
			}
			setCommand("");

			setTimeout(() => {
				if (inputRef.current) {
					inputRef.current.focus();
					setIsProcessing(false);
				}
			}, 100);
		}
	};

	const generateWelcomeMessage = () => {
		return (
			<div className="text-background">
				Welcome to FRO OS TERMINAL!!!
				<pre className="text-primary">
					╔══════════════════════════════╗ <br />║ Interactive Frominal ║ <br />
					╚══════════════════════════════╝ <br />
				</pre>
				Essential Commands:
				<ul className="text-blue-500">
					<li>help - Usage guide</li>
				</ul>
			</div>
		);
	};

	useEffect(() => {
		if (inputRef.current && !isProcessing) {
			setTimeout(() => {
				if (inputRef.current) {
					inputRef.current.focus();
				}
			}, 100);
		}
	}, [isProcessing]);

	useEffect(() => {
		if (terminalRef.current) {
			terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
		}
	}, [terminalLines]);

	return (
		<div
			className="w-full min-h-full overflow-y-auto bg-foreground text-primary font-mono p-5 box-border m-0"
			ref={terminalRef}
		>
			{generateWelcomeMessage()}

			<div className="p-0 m-0">
				{terminalLines.map((lines, index) => {
					return (
						<div key={`line-${index + 1}-${lines.input}`} className="m-0 p-0">
							<FrominalInputSection
								username={username}
								hostname={hostname}
								inputRef={null}
								command={lines.input}
								setCommand={setCommand}
								handleKeyDown={handleKeyDown}
								isProcessing={isProcessing}
								readonly={true}
							/>

							<div className="m-0 p-0 text-background">{lines.output}</div>
						</div>
					);
				})}

				<FrominalInputSection
					username={username}
					hostname={hostname}
					inputRef={inputRef}
					command={command}
					setCommand={setCommand}
					handleKeyDown={handleKeyDown}
					isProcessing={isProcessing}
					readonly={false}
				/>
			</div>
		</div>
	);
}

export default Frominal;

function FrominalInputSection({
	username,
	hostname,
	inputRef,
	command,
	setCommand,
	handleKeyDown,
	isProcessing,
	readonly,
}: {
	username: string;
	hostname: string;
	inputRef: Ref<HTMLInputElement>;
	command: string;
	setCommand: (value: string) => void;
	handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	isProcessing: boolean;
	readonly: boolean;
}) {
	return (
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
					onKeyDown={(e) => handleKeyDown(e)}
					type="text"
					autoComplete="off"
					spellCheck={false}
					disabled={isProcessing}
					readOnly={readonly}
					placeholder={"Type a command (Tab for autocomplete)"}
					className="bg-transparent caret-primary border-none outline-none font-mono text-inherit flex-1 min-w-0 m-0 p-0 placeholder:text-gray-400"
				/>
			</div>
		</div>
	);
}
