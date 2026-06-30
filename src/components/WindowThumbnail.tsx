import { memo } from "react";
import { useWindowStore } from "#/store/window.tsx";
import type { WindowInstance } from "../constants";
import { useMusicStore } from "#/store/music.tsx";

interface Props {
	win: WindowInstance;
}

const THUMB_WIDTH = 160;
const THUMB_HEIGHT = 100;

const WindowThumbnail = memo(function WindowThumbnail({ win }: Props) {
	const { closeWindow, focusWindow, previewCache } = useWindowStore();
	const { deactivate } = useMusicStore();
	if (!win) return null;

	const { id, title, logo } = win;
	const previewUrl = previewCache[id] ?? null;

	const handleThumbnailClick = () => focusWindow(id);
	const handleClose = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (id.startsWith("music_")) {
			deactivate();
		}
		closeWindow(id);
	};

	return (
		<div
			className="shrink-0 rounded-lg overflow-hidden border border-background/10 shadow-lg glassmorphism cursor-pointer hover:border-background/20 transition-all duration-150"
			style={{ width: THUMB_WIDTH }}
			onClick={handleThumbnailClick}
			role="button"
			tabIndex={0}
		>
			<div className="flex items-center justify-between px-2 h-7 bg-foreground/30 backdrop-blur-md">
				<div className="flex items-center gap-1.5 min-w-0">
					<img
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
				>
					<img src="/general/Close.svg" alt="Close" className="w-3 h-3" />
				</button>
			</div>

			<div
				className="relative overflow-hidden bg-foreground/10"
				style={{ width: THUMB_WIDTH, height: THUMB_HEIGHT }}
			>
				{previewUrl ? (
					<img
						src={previewUrl}
						alt=""
						className="w-full h-full object-contain"
						draggable={false}
					/>
				) : (
					<div className="flex items-center justify-center h-full text-background/40 text-xs">
						{title}
					</div>
				)}
			</div>
		</div>
	);
});

export default WindowThumbnail;
