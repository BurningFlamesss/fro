import { RiPushpinLine } from "react-icons/ri";
import { cn } from "#/lib/utils.ts";
import { findAppWindows, useWindowStore } from "#/store/window.tsx";
import type { AppInstance, WindowInstance } from "../constants";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuItem,
	ContextMenuTrigger,
} from "./ui/context-menu";

function Screen() {
	const { apps, openApp, windows, focusWindow, pinApp } = useWindowStore();

	const toggleApp = (app: AppInstance) => {
		console.log("Clicked", app.name);
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
			} else {
				focusWindow(window.id);
			}
		} else {
			const lastWin = appWindows.filter(Boolean).pop();
			if (lastWin) focusWindow(lastWin.id);
		}
	};

	return (
		<div className="relative z-10 h-[calc(100dvh-76px)] w-dvw p-2">
			{Object.entries(apps).map(([key, app]) => (
				<ContextMenu key={`screen-app-${key}`}>
					<ContextMenuTrigger>
						<button
							type="button"
							onClick={() => toggleApp(app)}
							className={cn(
								"w-24 h-24 group p-2 rounded-xl transition-all duration-150 cursor-pointer flex flex-col items-center justify-center flex-1 grow shrink-0",
							)}
						>
							<img
								className="w-12 h-12 object-contain opacity-90 group-hover:opacity-100"
								src={app.logo}
								alt={app.name}
								draggable={false}
							/>
							<p className="text-background glassmorphism py-0.5 px-2 rounded-sm">{app.name}</p>
						</button>
					</ContextMenuTrigger>

					<ContextMenuContent className="z-100000002">
						<ContextMenuGroup>
							<ContextMenuItem onClick={() => toggleApp(app)}>
								<img className="h-4 w-4" src={app.logo} alt="" /> Open {app.name}
							</ContextMenuItem>
							<ContextMenuItem onClick={() => openApp(app.id)}>
								<img className="h-4 w-4" src={app.logo} alt="" /> New Window
							</ContextMenuItem>
							<ContextMenuItem onClick={() => pinApp(app.id)}>
								<RiPushpinLine className="text-background" />
								Pin to taskbar
							</ContextMenuItem>
						</ContextMenuGroup>
					</ContextMenuContent>
				</ContextMenu>
			))}
		</div>
	);
}

export default Screen;
