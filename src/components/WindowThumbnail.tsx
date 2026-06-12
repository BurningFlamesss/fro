import { memo } from "react";
import { useWindowStore } from "#/store/window.tsx";
import type { AppId, AppInstance, WindowInstance } from "../constants";

interface Props {
	win: WindowInstance;
	apps: Record<AppId, AppInstance>;
}

const THUMB_WIDTH = 160;
const THUMB_HEIGHT = 100;

const WindowThumbnail = memo(function WindowThumbnail({ win, apps }: Props) {
	const { closeWindow, focusWindow } = useWindowStore();
	const app = apps[win.appId];
	if (!app) return null;

	const Component = app.component;
	const { id, title, logo, maximized, width, height } = win;

	const displayWidth = maximized ? window.innerWidth : width;
	const displayHeight = maximized ? window.innerHeight : height;

	const scale = Math.min(
		THUMB_WIDTH / displayWidth,
		THUMB_HEIGHT / displayHeight,
	);

	const handleThumbnailClick = () => {
		focusWindow(id);
	};

	const handleClose = (e: React.MouseEvent) => {
		e.stopPropagation();
		closeWindow(id);
	};

	return (
		<div
			className="shrink-0 rounded-lg overflow-hidden border border-background/10 shadow-lg glassmorphism cursor-pointer hover:border-background/20 transition-all duration-150"
			style={{ width: THUMB_WIDTH }}
			onClick={handleThumbnailClick}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === "Enter") handleThumbnailClick();
			}}
		>
			<div className="flex items-center justify-between px-2 h-7 bg-foreground/30 backdrop-blur-md">
				<div className="flex items-center gap-1.5 min-w-0">
					<img
						draggable={false}
						src={logo}
						alt=""
						className="w-3.5 h-3.5 rounded opacity-80 shrink-0"
					/>
					<span className="text-xs font-medium text-background/90 truncate">
						{title}
					</span>
				</div>
				<button
					className="text-background/50 hover:text-red-400 hover:bg-red-400/10 rounded p-1 flex items-center justify-center transition-colors cursor-pointer"
					onClick={handleClose}
					aria-label="Close window"
				>
					<img
						onClick={closeWindow.bind(null, id)}
						onKeyUp={closeWindow.bind(null, id)}
						className="w-3 h-3"
						src="/public/general/Close.svg"
						alt="Close"
						draggable={false}
					/>
				</button>
			</div>

			<div
				className="relative overflow-hidden"
				style={{ width: THUMB_WIDTH, height: THUMB_HEIGHT }}
			>
				<div
					style={{
						width: displayWidth,
						height: displayHeight,
						transform: `scale(${scale})`,
						transformOrigin: "top left",
						pointerEvents: "none",
						userSelect: "none",
					}}
					className="text-background"
				>
					{Component}
				</div>
			</div>
		</div>
	);
});

export default WindowThumbnail;
