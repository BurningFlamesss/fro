import { useEffect, useRef, useState } from "react";
import { FaBatteryThreeQuarters, FaWifi } from "react-icons/fa6";
import { HiSpeakerWave } from "react-icons/hi2";
import { MdOutlineClose } from "react-icons/md";
import { PiMagnifyingGlassDuotone } from "react-icons/pi";
import { RiUnpinLine } from "react-icons/ri";
import {
	cn,
	getDateTime,
	parseFileName,
	searchFileAssociatesThroughExtension,
} from "#/lib/utils.ts";
import { findAppWindows, useWindowStore } from "#/store/window.tsx";
import type { AppId, AppInstance, WindowInstance } from "../constants/apps";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuItem,
	ContextMenuTrigger,
} from "./ui/context-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import WindowThumbnail from "./WindowThumbnail";
import { useFileSystemStore, type FileNode } from "#/store/fs.tsx";
import { useNoteStore } from "#/store/note.tsx";
import { useLauncherStore } from "#/store/launcher.tsx";
import { useCalculatorStore } from "#/store/calculator.tsx";
import { useBrowserStore } from "#/store/browser.tsx";
import { useTerminalStore } from "#/store/terminal.tsx";
import { useMusicStore } from "#/store/music.tsx";
import { FILE_ASSOCIATIONS } from "#/lib/fileAssociates.ts";

function SearchPanel({ onClose }: { onClose: () => void }) {
	const [query, setQuery] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	const { apps, openApp } = useWindowStore();
	const { nodes } = useFileSystemStore();
	const { tabs, selectTab, addTab } = useNoteStore();
	const { launchables, launch } = useLauncherStore();
	const { setCalculatorExpression } = useCalculatorStore();
	const { setCommandExpression } = useTerminalStore();

	const { addAndUpdateTab } = useBrowserStore();
	const { addTrack } = useMusicStore();

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [onClose]);

	const filteredApps = Object.values(apps).filter(
		(app) =>
			app.name.toLowerCase().includes(query.toLowerCase()) ||
			app.title.toLowerCase().includes(query.toLowerCase()),
	);

	const filteredFiles = query
		? Object.values(nodes).filter(
				(node) =>
					node.type === "file" &&
					node.name.toLowerCase().includes(query.toLowerCase()),
			)
		: [];

	const openFile = async (node: FileNode, openAppId?: AppId) => {
		const { name, extension } = parseFileName(node.name);
		if (openAppId) {
			const tab = tabs.find((tab) => tab.id === node.id);
			if (!tab) addTab(name, node.content ?? "", node.id);
			else selectTab(node.id);
			openApp(openAppId);
			return;
		}

		if (node.type === "folder") {
			openApp("file_explorer", undefined, { containerId: node.id });
			return;
		}

		const { key } = searchFileAssociatesThroughExtension(extension, {
			...FILE_ASSOCIATIONS,
		});
		switch (key) {
			case "notes": {
				const tab = tabs.find((tab) => tab.id === node.id);
				if (!tab) addTab(name, node.content ?? "", node.id);
				else selectTab(node.id);
				openApp(key);
				break;
			}
			case "calculator": {
				setCalculatorExpression(node.content ?? "");
				openApp(key);
				break;
			}
			case "terminal": {
				setCommandExpression(node.content ?? "");
				openApp(key);
				break;
			}
			case "browser": {
				const content = node?.content ?? "";
				const queries = content.split("\n").filter(Boolean);
				queries.forEach((q) => addAndUpdateTab({ query: q }));
				openApp(key);
				break;
			}
			case "music": {
				addTrack({
					title: node.name,
					src: node.content ?? "",
					type: "file",
					cover: "/apps/Music.svg",
					artist: "Local File",
				});
				openApp("music");
				break;
			}
			case "app_view":
			case "app_web_view": {
				launch(
					key === "app_view"
						? {
								id: "app_froview",
								name: "App_froview",
								source: {
									type: "fromponent",
									code: function View() {
										return <img src={node.content} alt="" />;
									},
								},
								logo: "/apps/Game.svg",
								showInCollections: true,
							}
						: {
								id: "app_froview",
								name: "App_froview",
								source: { type: "ftml", code: node.content ?? "" },
								logo: "/apps/Game.svg",
								showInCollections: true,
							},
				);
				break;
			}
			default: {
				const launchable = Object.entries(launchables).find(([, value]) =>
					value.extension?.includes(extension),
				) || ["app_not_found", launchables.app_not_found];
				launch(launchable[1]);
			}
		}
	};

	return (
		<div
			className="fixed inset-0 pt-8 pl-[calc(10vw)] pb-[82px] z-[100000002] flex"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className="w-120 bg-black/15 backdrop-blur-[20px] backdrop-saturate-150 border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-2xl overflow-hidden">
				<div className="flex items-center px-4 py-3 border-b border-white/10">
					<PiMagnifyingGlassDuotone className="text-white/60 mr-2" />
					<input
						ref={inputRef}
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Type to search apps, files..."
						className="flex-1 bg-transparent text-white outline-none placeholder:text-white/40"
					/>
					<button
						type="button"
						onClick={onClose}
						className="text-white/40 hover:text-white ml-2 cursor-pointer"
					>
						<MdOutlineClose size={18} />
					</button>
				</div>

				<div className="max-h-full overflow-y-auto p-2">
					{!query && (
						<p className="text-white/40 text-center text-sm py-4">
							Start typing to search
						</p>
					)}

					{query && filteredApps.length === 0 && filteredFiles.length === 0 && (
						<p className="text-white/40 text-center text-sm py-4">
							No results found
						</p>
					)}

					{filteredApps.length > 0 && (
						<div className="mb-2">
							<h3 className="text-xs font-semibold text-white/50 uppercase mb-1 px-2">
								Apps
							</h3>
							{filteredApps.map((app) => (
								<button
									type="button"
									key={app.id}
									onClick={() => {
										openApp(app.id);
										onClose();
									}}
									className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-white/10 text-left text-sm text-white cursor-pointer"
								>
									<img src={app.logo} alt="" className="w-5 h-5" />
									{app.name}
								</button>
							))}
						</div>
					)}

					{filteredFiles.length > 0 && (
						<div>
							<h3 className="text-xs font-semibold text-white/50 uppercase mb-1 px-2">
								Files
							</h3>
							{filteredFiles.map((node) => (
								<button
									type="button"
									key={node.id}
									onClick={() => {
										openFile(node);
										onClose();
									}}
									className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-white/10 text-left text-sm text-white cursor-pointer"
								>
									<img
										src={
											node.type === "folder"
												? "/general/fs/Folder.svg"
												: `/general/fs/File-${searchFileAssociatesThroughExtension(parseFileName(node.name).extension).file_image}.svg`
										}
										alt=""
										className="w-5 h-5"
									/>
									<span className="truncate">{node.name}</span>
								</button>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function Taskbar() {
	const {
		apps,
		windows,
		openApp,
		focusWindow,
		minimizeWindow,
		closeWindow,
		unpinApp,
	} = useWindowStore();
	const [dateTimeData, setDateTimeData] = useState(() => getDateTime());
	const [searchTriggered, setSearchTriggered] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		const timer = setInterval(() => {
			setDateTimeData(getDateTime());
		}, 60_000);
		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		const handleDragOver = (e: DragEvent) => {
			e.preventDefault();
			if (e.dataTransfer) {
				e.dataTransfer.dropEffect = "move";
			}
		};
		document.body.addEventListener("dragover", handleDragOver);
		return () => document.body.removeEventListener("dragover", handleDragOver);
	}, []);

	const toggleApp = (app: AppInstance) => {
		const appWindows = findAppWindows(windows, app.id);

		if (appWindows.length === 0) {
			openApp(app.id);
			return;
		}

		if (appWindows.length === 1 && appWindows[0]) {
			const window = appWindows[0];

			if (window.minimized) {
				focusWindow(window.id);
				return;
			}

			const topWindow = Object.values(windows)
				.filter(
					(win): win is WindowInstance => win !== undefined && !win.minimized,
				)
				.reduce(
					(top, win) => (win.zIndex > (top?.zIndex ?? -1) ? win : top),
					null as WindowInstance | null,
				);

			if (topWindow && topWindow.id === window.id) {
				minimizeWindow(window.id);
			} else {
				focusWindow(window.id);
			}
		} else {
			// Handle operation to show multiple options to open a window
			// const visible = appWindows.filter(
			// 	(win): win is WindowInstance => win !== undefined && !win.minimized,
			// );
			// if (visible.length > 0) {
			// 	const top = visible.sort((a, b) => b.zIndex - a.zIndex)[0];
			// 	focusWindow(top.id);
			// } else {
			// 	if (appWindows[0]) {
			// 		focusWindow(appWindows[0].id);
			// 	}
			// }
		}
	};

	return (
		<>
			{searchTriggered && (
				<SearchPanel onClose={() => setSearchTriggered(false)} />
			)}
			<footer className="bg-black/15 backdrop-blur-[20px] backdrop-saturate-150 border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.2)] text-white h-16 w-[80dvw] flex items-center justify-between px-4 absolute bottom-3 left-1/2 -translate-x-1/2 rounded-2xl z-100000000">
				<section className="flex items-center gap-4 h-full">
					<button
						type="button"
						onClick={() => {
							Object.entries(windows).forEach(([key, value]) => {
								if (value) {
									minimizeWindow(value.id);
								}
							});
						}}
						className="relative flex items-center justify-center w-11 h-11 rounded-xl transition-colors duration-150 hover:bg-white/5 cursor-pointer"
					>
						<img
							className="w-8 h-8 object-contain"
							src="/logo.png"
							alt="Logo"
						/>
					</button>

					<div
						onClick={() => setSearchTriggered((prev) => !prev)}
						className="relative flex items-center"
					>
						<PiMagnifyingGlassDuotone className="absolute left-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search"
							className="w-52 h-9 pl-10 pr-4 rounded-full bg-white/10 border border-border/30 text-sm text-white/80 placeholder:text-white/50 hover:bg-white/20 focus:outline-none focus:bg-white/20 transition-colors duration-150"
						/>
					</div>
				</section>

				<section className="flex items-center gap-1">
					{Object.entries(apps).map(([key, app]) => {
						const win = findAppWindows(windows, app.id);
						const activeWin = win.filter((w) => !w?.minimized);

						if (!win.length && !activeWin.length && !app.isPinned) {
							return null;
						}

						return (
							<ContextMenu key={key}>
								<ContextMenuTrigger>
									<Tooltip>
										<TooltipTrigger
											type="button"
											onClick={() => toggleApp(app)}
											className={cn(
												"group p-2 rounded-xl transition-colors duration-150 hover:bg-white/5 cursor-pointer",
												win.length ? "bg-white/5 " : "",
											)}
										>
											<img
												className="w-7 h-7 object-contain opacity-90 group-hover:opacity-100"
												src={app.logo}
												alt={app.name}
												draggable="true"
												onDragStart={(e) => {
													e.dataTransfer.setData("text/plain", app.id);
													e.dataTransfer.effectAllowed = "move";
													const dragImg = new Image();
													dragImg.src = app.logo;
													e.dataTransfer.setDragImage(dragImg, 12, 12);
												}}
												onDragEnd={(e) => {
													if (e.dataTransfer.dropEffect === "move") {
														const winWidth = 600;
														const winHeight = 400;
														const x = Math.max(
															0,
															Math.min(
																e.clientX - winWidth / 2,
																window.innerWidth - winWidth,
															),
														);
														const y = Math.max(
															0,
															Math.min(
																e.clientY - winHeight / 2,
																window.innerHeight - winHeight,
															),
														);
														openApp(app.id, {
															x,
															y,
															width: winWidth,
															height: winHeight,
														});
													}
												}}
											/>
										</TooltipTrigger>
										<TooltipContent
											className={cn(
												"z-100000001",
												win.length
													? "translate-y-[calc(-10%-2px)]"
													: "px-3 py-1.5",
											)}
										>
											{win.length ? (
												<div className="flex gap-2 p-2 max-w-90 overflow-x-auto no-scrollbar">
													{win.map(
														(w) => w && <WindowThumbnail key={w.id} win={w} />,
													)}
												</div>
											) : (
												<p>{app.name}</p>
											)}
										</TooltipContent>
									</Tooltip>
								</ContextMenuTrigger>
								<ContextMenuContent className="z-100000002 -translate-x-1/2 translate-y-[-78%]">
									<ContextMenuGroup>
										{app.singleInstance ? null : (
											<ContextMenuItem onClick={() => openApp(app.id)}>
												<img
													draggable={false}
													className="h-4 w-4"
													src={app.logo}
													alt=""
												/>{" "}
												New Window
											</ContextMenuItem>
										)}
										<ContextMenuItem onClick={() => unpinApp(app.id)}>
											<RiUnpinLine className="text-white" />
											Unpin from taskbar
										</ContextMenuItem>
										<ContextMenuItem
											onClick={() => win.map((w) => w && closeWindow(w.id))}
										>
											<MdOutlineClose className="text-destructive" />
											Close all windows
										</ContextMenuItem>
									</ContextMenuGroup>
								</ContextMenuContent>
							</ContextMenu>
						);
					})}
				</section>

				<section className="flex items-center gap-5 h-full">
					<div className="flex items-center gap-3 text-white text-lg">
						<Tooltip>
							<TooltipTrigger className="cursor-default">
								<FaWifi className="" />
							</TooltipTrigger>
							<TooltipContent className="px-3 py-1.5">Wi-Fi</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger className="cursor-default">
								<HiSpeakerWave className="" />
							</TooltipTrigger>
							<TooltipContent className="px-3 py-1.5">Volume</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger className="cursor-default">
								<FaBatteryThreeQuarters className="" />
							</TooltipTrigger>
							<TooltipContent className="px-3 py-1.5">Battery</TooltipContent>
						</Tooltip>
					</div>

					<div className="flex items-center gap-3 pl-3 border-l border-border/30">
						<div className="flex flex-col items-end leading-tight">
							<p className="text-sm font-semibold text-white">
								{dateTimeData.time}
							</p>
							<p className="text-xs text-white/90 font-medium">
								{dateTimeData.date}
							</p>
						</div>
					</div>
				</section>
			</footer>
		</>
	);
}

export default Taskbar;
