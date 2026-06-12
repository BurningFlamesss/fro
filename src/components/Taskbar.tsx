import { useEffect, useState } from "react";
import { FaBatteryThreeQuarters, FaWifi } from "react-icons/fa6";
import { HiSpeakerWave } from "react-icons/hi2";
import { MdOutlineClose } from "react-icons/md";
import { PiMagnifyingGlassDuotone } from "react-icons/pi";
import { RiUnpinLine } from "react-icons/ri";
import { cn, getDateTime } from "#/lib/utils.ts";
import { findAppWindows, useWindowStore } from "#/store/window.tsx";
import type { AppInstance, WindowInstance } from "../constants";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuItem,
	ContextMenuTrigger,
} from "./ui/context-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import WindowThumbnail from "./WindowThumbnail";

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
		<footer className="glassmorphism h-16 w-[80dvw] flex items-center justify-between px-4 absolute bottom-3 left-1/2 -translate-x-1/2 rounded-2xl z-100000000">
			<section className="flex items-center gap-4 h-full">
				<div className="relative flex items-center justify-center w-11 h-11 rounded-xl transition-colors duration-150 hover:bg-background/5 cursor-pointer">
					<img
						className="w-8 h-8 object-contain"
						src="/public/logo.png"
						alt="Logo"
					/>
				</div>

				<div className="relative flex items-center">
					<PiMagnifyingGlassDuotone className="absolute left-3 top-1/2 -translate-y-1/2 text-background pointer-events-none" />
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search"
						className="w-52 h-9 pl-10 pr-4 rounded-full bg-background/10 border border-border/30 text-sm text-background/80 placeholder:text-background/50 hover:bg-background/20 focus:outline-none focus:bg-background/20 transition-colors duration-150"
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
											"group p-2 rounded-xl transition-colors duration-150 hover:bg-background/5 cursor-pointer",
											win.length ? "bg-background/5 " : "",
										)}
									>
										{/* --- 2. Make the icon draggable --- */}
										<img
											className="w-7 h-7 object-contain opacity-90 group-hover:opacity-100"
											src={app.logo}
											alt={app.name}
											draggable="true"
											onDragStart={(e) => {
												e.dataTransfer.setData("text/plain", app.id);
												e.dataTransfer.effectAllowed = "move";
												// optional: custom drag image
												const dragImg = new Image();
												dragImg.src = app.logo;
												e.dataTransfer.setDragImage(dragImg, 12, 12);
											}}
											onDragEnd={(e) => {
												// only open if the drop was successful (dropEffect = "move")
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
									<ContextMenuItem onClick={() => openApp(app.id)}>
										<img className="h-4 w-4" src={app.logo} alt="" /> New Window
									</ContextMenuItem>
									<ContextMenuItem onClick={() => unpinApp(app.id)}>
										<RiUnpinLine className="text-background" />
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
				<div className="flex items-center gap-3 text-background text-lg">
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
						<p className="text-sm font-semibold text-background">
							{dateTimeData.time}
						</p>
						<p className="text-xs text-background/90 font-medium">
							{dateTimeData.date}
						</p>
					</div>
				</div>
			</section>
		</footer>
	);
}

export default Taskbar;
