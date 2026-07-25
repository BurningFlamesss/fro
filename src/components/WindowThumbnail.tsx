import { memo } from "react";
import { useMusicStore } from "#/store/music.tsx";
import { useWindowStore } from "#/store/window.tsx";
import type { WindowInstance } from "../constants/apps";

interface Props {
	win: WindowInstance;
}

const THUMB_WIDTH = 160;
const THUMB_HEIGHT = 100;

const WindowThumbnail = memo(function WindowThumbnail({ win }: Props) {
	const { closeWindow, focusWindow, previewCache } = useWindowStore();
	const { stopPlayback } = useMusicStore();
	if (!win) return null;

	const { id, title, logo } = win;
	const previewUrl = previewCache[id] ?? null;

	const handleThumbnailClick = () => focusWindow(id);
	const handleClose = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (id.startsWith("music_")) {
			stopPlayback();
		}
		closeWindow(id);
	};

	return (
		<div
			className="shrink-0 rounded-lg overflow-hidden border border-white/10 shadow-lg bg-black/15 backdrop-blur-[20px] backdrop-saturate-150 border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.2)] text-white cursor-pointer hover:border-white/20 transition-all duration-150"
			style={{ width: THUMB_WIDTH }}
			onClick={handleThumbnailClick}
			role="button"
			tabIndex={0}
		>
			<div className="flex items-center justify-between px-2 h-7 bg-black/30 backdrop-blur-md">
				<div className="flex items-center gap-1.5 min-w-0">
					<img
						src={logo}
						alt=""
						className="w-3.5 h-3.5 rounded opacity-80 shrink-0"
					/>
					<span className="text-xs font-medium text-white/90 truncate">
						{title}
					</span>
				</div>
				<button
					className="text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded p-1 flex items-center justify-center transition-colors cursor-pointer"
					onClick={handleClose}
				>
					<img src="/general/Close.svg" alt="Close" className="w-3 h-3" />
				</button>
			</div>

			<div
				className="relative overflow-hidden bg-black/10"
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
					<div className="flex items-center justify-center h-full text-white/40 text-xs">
						{title}
					</div>
				)}
			</div>
		</div>
	);
});

export default WindowThumbnail;
