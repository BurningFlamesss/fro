import { toPng } from "html-to-image";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useWindowStore } from "#/store/window.tsx";
import type { WindowInstance } from "../constants";

interface Props {
	win: WindowInstance;
}

const THUMB_WIDTH = 160;
const THUMB_HEIGHT = 100;
const CAPTURE_DELAY = 5000;
const PIXEL_RATIO = 0.1;

const WindowThumbnail = memo(function WindowThumbnail({ win }: Props) {

	const { closeWindow, focusWindow } = useWindowStore();
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const { id, title, logo, component } = win;

	const contentRef = useRef<HTMLElement | null>(null);
	const observerRef = useRef<MutationObserver | null>(null);
	const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const capturePreview = useCallback(async () => {
		const element = contentRef.current;
		if (!element) return;
		try {
			const dataUrl = await toPng(element, {
				width: element.scrollWidth,
				height: element.scrollHeight,
				pixelRatio: PIXEL_RATIO,
				cacheBust: true,
			});
			setPreviewUrl(dataUrl);
		} catch (error) {
			console.error("Thumbnail capture failed", error);
		}
	}, []);

	useEffect(() => {
		const target = document.getElementById(`window-content-${id}`);
		if (!target) return;

		contentRef.current = target;

		const observer = new MutationObserver(() => {
			if (debounceTimer.current) clearTimeout(debounceTimer.current);
			debounceTimer.current = setTimeout(() => {
				capturePreview();
			}, CAPTURE_DELAY);
		});

		observer.observe(target, {
			childList: true,
			subtree: true,
			characterData: true,
			attributes: false,
		});

		capturePreview();

		observerRef.current = observer;

		return () => {
			observer.disconnect();
			if (debounceTimer.current) clearTimeout(debounceTimer.current);
		};
	}, [id, capturePreview]);

	const handleThumbnailClick = () => focusWindow(id);

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
						src="/public/general/Close.svg"
						alt="Close"
						className="w-3 h-3"
					/>
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
					<div className="w-full h-full overflow-auto text-background">
						{component}
					</div>
				)}
			</div>
		</div>
	);
});

export default WindowThumbnail;
