import { useEffect, useState } from "react";
import { FaBatteryThreeQuarters, FaWifi } from "react-icons/fa6";
import { HiSpeakerWave } from "react-icons/hi2";
import { PiMagnifyingGlassDuotone } from "react-icons/pi";
import { getDateTime } from "#/lib/utils.ts";
import { findAppWindows, useWindowStore } from "#/store/window.tsx";
import type { AppInstance } from "../constants";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

function BottomBar() {
	const { apps, windows, openApp, focusWindow, closeWindow, nextZIndex } = useWindowStore();
	const [dateTimeData, setDateTimeData] = useState(() => getDateTime());
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		const timer = setInterval(() => {
			setDateTimeData(getDateTime());
		}, 60_000);
		return () => clearInterval(timer);
	}, []);

	const toggleApp = (app: AppInstance) => {
		const app_window = findAppWindows(windows, app.id)
		if (app_window.length) {
			if (app_window.length === 1 && app_window[0]) {
				app_window[0].focused = true
				app_window[0].zIndex = nextZIndex
			} else {
				// Handle operation to show multiple options to open a window
			}
		} else {
			openApp(app.id)
		}
		
		console.log("Windows: ", windows)
	}

	return (
		<footer className="glassmorphism h-16 w-[80dvw] flex items-center justify-between px-4 absolute bottom-3 left-1/2 -translate-x-1/2 rounded-2xl">
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
				{Object.entries(apps).map(([key, app]) => (
					<Tooltip key={key}>
						<TooltipTrigger
							type="button"
							onClick={() => toggleApp(app)}
							className="group p-2 rounded-xl transition-colors duration-150 hover:bg-background/5 cursor-pointer"
						>
							<img
								className="w-7 h-7 object-contain opacity-90 group-hover:opacity-100"
								src={app.logo}
								alt={app.name}
							/>
						</TooltipTrigger>
						<TooltipContent className="">
							<p>{app.name}</p>
						</TooltipContent>
					</Tooltip>
				))}
			</section>

			<section className="flex items-center gap-5 h-full">
				<div className="flex items-center gap-3 text-background text-lg">
					<Tooltip>
						<TooltipTrigger className="cursor-default">
							<FaWifi className="" />
						</TooltipTrigger>
						<TooltipContent>Wi-Fi</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger className="cursor-default">
							<HiSpeakerWave className="" />
						</TooltipTrigger>
						<TooltipContent>Volume</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger className="cursor-default">
							<FaBatteryThreeQuarters className="" />
						</TooltipTrigger>
						<TooltipContent>Battery</TooltipContent>
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

export default BottomBar;
