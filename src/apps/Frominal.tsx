import React, { type Ref, useEffect, useRef, useState } from "react";
import { formatBytes, normalizeUrl } from "#/lib/utils.ts";
import { fetchResponse, pingUrl } from "#/server/fetchResponses.tsx";
import { useNoteStore } from "#/store/note.tsx";
import { useWindowStore } from "#/store/window.tsx";
import type { AppInstance, WindowInstance } from "../constants";

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
	const { addTab, tabs, closeTab } = useNoteStore();
	const terminalRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [terminalLines, setTerminalLines] = useState<Array<TerminalLine>>([]);
	const [command, setCommand] = useState<string>("");
	const [isProcessing, setIsProcessing] = useState(false);

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

	const commands: Record<string, CommandHandler> = {
		help: () => "Please read the docs",

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
							{index + 1}. {apps?.[win.appId]?.name}
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
			const equation = params.join(" ");
			if (!equation) {
				openApp("calculator");
				return <p>Opening Calculator...</p>;
			}

			if (!/^[0-9+\-*/().%\s]+$/.test(equation)) {
				openApp("calculator");
				return (
					<>
						<p className="text-red-500">Invalid characters</p>
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
			addTab(`Frominal Note #${params[0]}`, params.join(" "));

			return <p>Added note!</p>;
		},

		"create.do": async (params) => {
			if (!params.length) {
				return (
					<div>
						Please provide the content to create note.
						<p>Here's the currents do's</p>
						<div>{await executeCommand("read.do")}</div>
					</div>
				);
			}

			// TODO: Process via AI

			addTab(`TODO #${params[0]}`, params.join(" "));

			return <p>Added TODO!</p>;
		},

		"read.do": () => {
			const todoTabs = tabs.filter((tab) => tab.title.startsWith("TODO"));

			return (
				<ul>
					{todoTabs.map((tab, index) => (
						<li key={`read-do-${tab.id}`}>
							{index + 1}. {tab.content}
						</li>
					))}
				</ul>
			);
		},

		"done.do": (params) => {
			if (!params.length) {
				return;
			}

			const doneIndex = params.map((param) => +param);
			const doneTodos: Array<{ title: string; content: string }> = [];

			doneIndex.forEach((index) => {
				const tab = tabs[index - 1];

				if (tab) {
					doneTodos.push({
						title: tab.title,
						content: tab.content,
					});
					closeTab(tab.id);
				}
			});

			return (
				<ul className="flex flex-col gap-2">
					{doneTodos.map((tab, index) => (
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
	};

	const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();

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
