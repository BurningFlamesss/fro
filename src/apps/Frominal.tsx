import { formatDate, formatRelative } from "date-fns";
import React, { type Ref, useEffect, useRef, useState } from "react";
import {
	formatBytes,
	formatEventRange,
	matchFlag,
	normalizeUrl,
	parseDate,
	parseDuration,
	parseFileName,
	searchFileAssociatesThroughExtension,
	splitEvent,
} from "#/lib/utils.ts";
import { fetchResponse, pingUrl } from "#/server/fetchResponses.tsx";
import { useCalculatorStore } from "#/store/calculator.tsx";
import { useCalendarStore } from "#/store/calendar.tsx";
import { useNoteStore } from "#/store/note.tsx";
import { useWindowStore } from "#/store/window.tsx";
import type { AppInstance, WindowInstance } from "../constants";
import { EVENT_COLORS } from "./Frolendar";
import { useFileSystemStore } from "#/store/fs.tsx";
import { FILE_ASSOCIATIONS } from "#/lib/fileAssociates.ts";
import { useTerminalStore } from "#/store/terminal.tsx";

type TerminalResponse = React.ReactNode | string;

type CommandHandler = (
	params: string[],
) => TerminalResponse | Promise<TerminalResponse>;

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
	const { commandExpression, setCommandExpression } = useTerminalStore();
	const terminalRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [terminalLines, setTerminalLines] = useState<Array<TerminalLine>>([]);
	const [command, setCommand] = useState<string>(commandExpression);
	const [isProcessing, setIsProcessing] = useState(false);
	const { addTab, tabs, closeTab } = useNoteStore();
	const { createNode, updateNode, deleteNode, nodes } = useFileSystemStore();
	const { setCalculatorExpression } = useCalculatorStore();
	const { events, addEvent } = useCalendarStore();

	const username = "FRO";
	const hostname = "CUS";

	async function executeCommand(input: string): Promise<TerminalResponse> {
		const { primaryCommand, params } = parseCommand(input);

		const handler = commands[primaryCommand];

		if (!handler) {
			return (
				<p className="text-red-500">Command not found: {primaryCommand}</p>
			);
		}

		return await handler(params);
	}

	const helpRegistry: Record<string, string> = {
		help: "Display all available command with their usage.",
		echo: "Print text to the terminal. Usage: `echo <TEXT>`",
		ping: "Measure response time of the URL. Usage: `ping <URL>`",
		clear: "Clear terminal history",
		open: "Open one or more apps. Usage `open <*APPS>`",
		pin: "Pin one or more apps to dock. Usage `pin <*APPS>`",
		unpin: "Unpin one or more apps from dock. Usage `unpin <*APPS>`",
		mem: "Show application statistics",
		ps: "List running window and processes",
		"process.terminate.all": "Terminates all the running processes",
		"!!": "Re-run the previous command",
		base64: "Encode text as Base64. Usage: `base64 <TEXT>`",
		decode64: "Decode Base64 text. Usage: `decode64 <BASE64>`",
		hash: "Generate a hash. Usage: `hash [--sha1 | --sha256 | --sha384 | --sha512] [--lenN, e.g. --len32] <TEXT>`",
		calc: "Evaluate a mathematical expression. Usage `calc <MATHEXP>`",
		random:
			"Generate random number. Usage `random` | `random <END>` | `random <START> <END>`",
		fetch: "Fetch URL contents and metadata. Usage: `fetch <*URLS>`",
		note: "Create quick note. Usage: `note <TEXT>`",
		refresh: "Refresh the OS",
		geo: "Get latitude & longitude. Usage: `geo [--copy | --map]`",
		clipboard: "Read and display the content in the clipboard",
		"task.create": "Create a TASK. Usage: `task.create <TASK>`",
		"task.read": "List all the TASK items",
		"task.done": "Mark TASK as completed. Usage: `task.done <*INDICES>`",
	};

	const commands: Record<string, CommandHandler> = {
		help: () => {
			return (
				<>
					<p className="text-yellow-500 pb-4">
						Any &lt;*Param&gt; are meant to be separate by `space ( )` for
						multiple inputs.
					</p>
					<table className="border-collapse">
						<thead>
							<tr>
								<th className="text-left pr-8 pb-2 text-yellow-500">Command</th>
								<th className="text-left pb-2 text-yellow-500">Description</th>
							</tr>
						</thead>

						<tbody>
							{Object.entries(commands).map(([command]) => (
								<tr key={command}>
									<td className="pr-8 py-1 text-blue-400">{command}</td>

									<td className="py-1">
										{helpRegistry[command] ?? "No help available"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</>
			);
		},

		echo: (params) => params.join(" "),

		ping: async (params) => {
			if (!params.length) {
				return <p className="text-yellow-500">Please provide one URL</p>;
			}

			const url = normalizeUrl(params[0]);

			try {
				const response = await pingUrl({
					data: url,
				});

				return (
					<div>
						<p>PONG {url}</p>
						<p>Status: {response.status}</p>
						<p>Time: {response.time.toFixed(2)} ms</p>
					</div>
				);
			} catch {
				return <p className="text-red-500">Request failed</p>;
			}
		},

		clear: () => {
			setTerminalLines([]);
			return null;
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

		mem: () => {
			const visibleWindows = Object.values(windows).filter(
				(win): win is WindowInstance => win !== undefined,
			);

			const openedApps = new Set(visibleWindows.map((win) => win.appId));

			const pinnedApps = Object.entries(apps).filter(
				([key, value]) => value.isPinned,
			);

			return (
				<div>
					<p>Apps: {Object.values(apps).length}</p>
					<p>Opened Windows: {visibleWindows.length}</p>
					<p>Opened Apps: {openedApps.size}</p>
					<p>Pinned Apps: {pinnedApps.length}</p>
				</div>
			);
		},

		ps: () => {
			const visibleWindows = Object.values(windows).filter(
				(win): win is WindowInstance => win !== undefined,
			);

			return (
				<ul>
					<li>PID APPS</li>
					{visibleWindows.map((win, index) => (
						<li key={`PID-apps-${win.id}`}>
							{index + 1}. {apps?.[win.appId]?.name} - ({win.id})
						</li>
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

		"!!": async () => {
			if (!terminalLines.length) {
				return;
			}
			const lastLine = terminalLines[terminalLines.length - 1];

			if (!lastLine.input.startsWith("!!")) {
				return (
					<>
						<p>&gt; {lastLine.input}</p>
						{await executeCommand(lastLine.input)}
					</>
				);
			}
		},

		base64: (params) => {
			return btoa(unescape(encodeURIComponent(params.join(" "))));
		},

		decode64: (params) => {
			return atob(escape(encodeURIComponent(params.join(" "))));
		},

		hash: async (params) => {
			if (!params.length) {
				return <p className="text-yellow-500">Please provide text to hash</p>;
			}

			const algorithmMap: Record<string, AlgorithmIdentifier> = {
				"--sha1": "SHA-1",
				"--sha256": "SHA-256",
				"--sha384": "SHA-384",
				"--sha512": "SHA-512",
			};

			let algorithm: AlgorithmIdentifier = "SHA-256";
			let length: number = Infinity;

			const content: Array<string> = [];

			for (const param of params) {
				const lower = param.toLowerCase();

				if (lower.startsWith("--len")) {
					length = +lower.replace("--len", "");
					continue;
				}

				if (lower in algorithmMap) {
					algorithm = algorithmMap[lower];
					continue;
				}

				content.push(param);
			}

			if (!content.length) {
				return <p className="text-yellow-500">No text provided to hash</p>;
			}

			const text = content.join(" ");

			const buffer = await crypto.subtle.digest(
				algorithm,
				new TextEncoder().encode(text),
			);

			const hashHex = Array.from(new Uint8Array(buffer))
				.map((byte) => byte.toString(16).padStart(2, "0"))
				.join("");

			const result = hashHex.slice(0, length);

			return (
				<div>
					<p>
						Algorithm:{" "}
						<span className="text-blue-400">{String(algorithm)}</span>
					</p>

					<p>
						Length:{" "}
						<span className="text-blue-400">{hashHex.length * 4} bits</span>
					</p>

					<pre className="whitespace-pre-wrap break-all text-green-400">
						{result}
					</pre>
				</div>
			);
		},

		calc: (params) => {
			let equation: string = "";
			let mode: "Deg" | "Rad" = "Rad";

			for (const param of params) {
				switch (param) {
					case "--deg":
						mode = "Deg";
						break;
					case "--rad":
						mode = "Rad";
						break;

					default:
						equation = `${equation} ${param}`;
						break;
				}
			}

			if (!equation) {
				openApp("calculator");
				return <p>Opening Calculator...</p>;
			}

			if (!/^[0-9+\-*/().%\s]+$/.test(equation)) {
				setCalculatorExpression(equation, mode);
				openApp("calculator");
				return (
					<>
						<p className="text-red-500">Beyond the capability of frominal!</p>
						<p>Opening Calculator...</p>
					</>
				);
			}
			try {
				const answer = Function(`"use strict"; return (${equation})`)();

				return answer;
			} catch (error) {
				return <p className="text-red-500">Not a valid equation</p>;
			}
		},

		random: (params) => {
			if (!params.length) {
				return Math.random();
			}

			if (params.length === 1) {
				return Math.floor(Math.random() * Number(params[0]));
			}

			const min = Number(params[0]);
			const max = Number(params[1]);

			return Math.floor(Math.random() * (max - min + 1)) + min;
		},

		fetch: async (params) => {
			if (!params.length) {
				return (
					<p className="text-yellow-500">Please provide at least one URL</p>
				);
			}

			try {
				const results = await fetchResponse({
					data: params,
				});

				return (
					<div>
						{results.map((result) => (
							<div
								key={result.url}
								className="mb-6 overflow-auto whitespace-pre-wrap wrap-break-word"
							>
								<p>URL: {result.url}</p>
								<p>Status: {result.status}</p>
								<p>Type: {result.type}</p>
								<p>Size: {result.size}</p>
								<p>Time: {result.time}</p>

								<pre className="overflow-auto whitespace-pre-wrap wrap-break-word mt-2">
									{result.type === "text/html; charset=utf-8"
										? `${result.data.trim().slice(0, 500)}...`
										: result.data.trim()}
								</pre>
							</div>
						))}
					</div>
				);
			} catch {
				return <p className="text-red-500">Failed to fetch resources</p>;
			}
		},

		note: (params) => {
			if (!params.length) {
				return;
			}
			addTab(`Frote #${params[0]}`, params.join(" "));

			return <p>Added note!</p>;
		},

		refresh: () => {
			setTimeout(() => {
				window.location.reload();
			}, 200);

			return <p>Refreshing the page...</p>;
		},

		geo: async (params) => {
			try {
				const position = await new Promise<GeolocationPosition>(
					(resolve, reject) =>
						navigator.geolocation.getCurrentPosition(resolve, reject),
				);

				const flags = {
					"--copy": async () =>
						await navigator.clipboard.writeText(
							`lat: ${position.coords.latitude}, lng: ${position.coords.longitude}`,
						),
					"--map": () =>
						window.open(
							`https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}`,
							"_blank",
							"noopener,noreferrer",
						),
				};

				for (const param of params) {
					if (param === "--copy") {
						await flags["--copy"]();
					}

					if (param === "--map") {
						await flags["--map"]();
					}
				}

				return (
					<div>
						<p>Latitude: {position.coords.latitude}</p>
						<p>Longitude: {position.coords.longitude}</p>
						<p>Accuracy: {position.coords.accuracy}m</p>
					</div>
				);
			} catch {
				return <p className="text-red-500">Location permission denied</p>;
			}
		},

		clipboard: async () => {
			try {
				const text = await navigator.clipboard.readText();

				return (
					<div>
						<p>Clipboard Content:</p>
						<pre>{text || "(empty)"}</pre>
					</div>
				);
			} catch {
				return <p className="text-red-500">Could not access clipboard</p>;
			}
		},

		"task.add": async (params) => {
			if (!params.length) {
				return (
					<div>
						Please provide the content to create note.
						<p>Here's the currents do's</p>
						<div>{await executeCommand("task.read")}</div>
					</div>
				);
			}

			// TASK: Process via AI

			const id = createNode(
				"notes",
				`TASK-${params[0]}.task`,
				"file",
				params.join(" "),
			);
			addTab(`TASK #${params[0]}`, params.join(" "), id);

			return <p>Added TASK!</p>;
		},

		"task.read": () => {
			const taskTabs = Object.entries(nodes).filter(([key, value]) => {
				const { extension } = parseFileName(value.name);
				return ["todo", "task"].includes(extension.toLowerCase());
			});

			return (
				<ul>
					{taskTabs.map((tab, index) => (
						<li key={`read-do-${tab[0]}`}>
							{index + 1}. {tab[1].content}
						</li>
					))}
				</ul>
			);
		},

		"task.done": (params) => {
			if (!params.length) {
				return;
			}

			const doneIndex = params.map((param) => +param);
			const doneTasks: Array<{ title: string; content: string }> = [];

			doneIndex.forEach((index) => {
				const tab = tabs[index - 1];

				if (tab) {
					doneTasks.push({
						title: tab.title,
						content: tab.content,
					});
					closeTab(tab.id);
					deleteNode(tab.id);
				}
			});

			return (
				<ul className="flex flex-col gap-2">
					{doneTasks.map((tab, index) => (
						<li key={`Done-do-${tab.title}`}>
							<p>
								{index + 1}. {tab.title}
							</p>
							<p>{tab.content}</p>
						</li>
					))}
				</ul>
			);
		},

		"event.add": async (params) => {
			if (!params.length) {
				return (
					<div>
						Please provide an event.
						<p>Current events:</p>
						<div>{await executeCommand("event.read")}</div>
					</div>
				);
			}

			const titleParts: string[] = [];

			let startInput = "";
			let endInput = "";
			let durationInput = "";

			let current: "title" | "start" | "end" | "dur" = "title";

			for (const param of params) {
				const match = matchFlag(param);

				if (match) {
					current = match.flag;

					switch (match.flag) {
						case "start":
							startInput = match.value;
							break;

						case "end":
							endInput = match.value;
							break;

						case "dur":
							durationInput = match.value;
							break;
					}

					continue;
				}

				switch (current) {
					case "title":
						titleParts.push(param);
						break;

					case "start":
						startInput += (startInput ? " " : "") + param;
						break;

					case "end":
						endInput += (endInput ? " " : "") + param;
						break;

					case "dur":
						durationInput += (durationInput ? " " : "") + param;
						break;
				}
			}

			const title = titleParts.join(" ");

			const duration = parseDuration(durationInput);

			const start = parseDate(startInput);
			const end = parseDate(endInput);

			let finalStart: Date;
			let finalEnd: Date;

			if (start && end) {
				finalStart = start;
				finalEnd = end;
			} else if (start) {
				finalStart = start;
				finalEnd = new Date(start.getTime() + duration);
			} else if (end) {
				finalEnd = end;
				finalStart = new Date(end.getTime() - duration);
			} else {
				finalStart = new Date();
				finalEnd = new Date(finalStart.getTime() + duration);
			}

			if (finalEnd <= finalStart) {
				return (
					<p className="text-red-500">End time must be after the start time.</p>
				);
			}

			const color =
				EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)];

			const events = splitEvent(
				title || "Untitled Event",
				finalStart,
				finalEnd,
				color,
			);

			events.forEach(addEvent);

			return (
				<div>
					<p>
						Added <strong>{title || "Untitled Event"}</strong>
					</p>

					<p>
						{finalStart.toLocaleString()} &rarr; {finalEnd.toLocaleString()}
					</p>
				</div>
			);
		},

		"event.read": async () => {
			const eventsTab = events.filter((tab) => tab.title);

			return (
				<ul>
					{eventsTab.map((tab, index) => (
						<li key={tab.id}>
							{index + 1}. {tab.title}
							<br />
							<span className="text-muted-foreground text-sm">
								{formatEventRange(tab.start, tab.end)}
							</span>
						</li>
					))}
				</ul>
			);
		},
	};

	const handleKeyDown = async (
		e?: React.KeyboardEvent<HTMLInputElement>,
		bypass?: boolean,
	) => {
		if (e?.key === "Enter" || bypass) {
			e?.preventDefault();

			setIsProcessing(true);

			if (command.trim()) {
				const output = await executeCommand(command);

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
					╔══════════════════════════════╗ <br />
					║-----Interactive Frominal-----║ <br />
					╚══════════════════════════════╝ <br />
				</pre>
				Essential Commands:
				<ul className="text-blue-400">
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

	useEffect(() => {
		handleKeyDown(undefined, true);
	}, [commandExpression]);

	return (
		<div
			className="w-full min-h-full overflow-y-auto bg-foreground text-primary font-mono p-5 box-border m-0 selection:bg-green-800 selection:text-white"
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
					<span className="text-green-400 font-bold">{username}</span>
					<span className="text-background">@</span>
					<span className="text-blue-400 font-bold">{hostname}</span>
					<span className="text-background">:</span>
					<span className="text-yellow-400">~</span>
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
