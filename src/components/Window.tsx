import { toPng } from "html-to-image";
import { Activity, useCallback, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import { cn } from "#/lib/utils.ts";
import { useWindowStore } from "#/store/window.tsx";
import type { WindowInstance } from "../constants";

const MIN_VISIBLE_W = 128;
const MIN_VISIBLE_H = 128;
const CAPTURE_DELAY = 500;
const PIXEL_RATIO = 0.4;

const clampPosition = (x: number, y: number, w: number, h: number) => {
	const maxX = window.innerWidth - MIN_VISIBLE_W;
	const minX = -w + MIN_VISIBLE_W;
	const maxY = window.innerHeight - MIN_VISIBLE_H;
	const minY = 0;

	return {
		x: Math.min(maxX, Math.max(minX, x)),
		y: Math.min(maxY, Math.max(minY, y)),
	};
};

const Window = function Window({ win }: { win: WindowInstance }) {
	const {
		minimizeWindow,
		maximizeWindow,
		restoreOriginalPosition,
		focusWindow,
		closeWindow,
		updateWindowRect,
		setPreview,
	} = useWindowStore();

	const contentRef = useRef<HTMLDivElement>(null);
	const debounceTimer = useRef<ReturnType<typeof setTimeout>>();
	const rndRef = useRef<Rnd>(null);
	const lastClampedPos = useRef({ x: win.x, y: win.y });

	const {
		id,
		appId,
		height,
		logo,
		minimized,
		maximized,
		title,
		width,
		x,
		y,
		zIndex,
	} = win;

	useEffect(() => {
		const element = contentRef.current;
		if (!element) return;

		const capture = async () => {
			try {
				const dataUrl = await toPng(element, {
					width: element.scrollWidth,
					height: element.scrollHeight,
					pixelRatio: PIXEL_RATIO,
					cacheBust: true,
				});
				setPreview(id, dataUrl);
			} catch (err) {
				// ignore
			}
		};

		const observer = new MutationObserver(() => {
			clearTimeout(debounceTimer.current);
			debounceTimer.current = setTimeout(capture, CAPTURE_DELAY);
		});

		observer.observe(element, {
			childList: true,
			subtree: true,
			characterData: true,
		});

		capture();

		return () => {
			observer.disconnect();
			clearTimeout(debounceTimer.current);
		};
	}, [id, setPreview]);

	const component = win.component;
	const stopPropagation = (e: React.MouseEvent | React.TouchEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrag = useCallback(
		(e: any, d: { x: number; y: number }) => {
			const { x: newX, y: newY } = d;
			const clamped = clampPosition(newX, newY, width, height);

			if (
				clamped.x !== lastClampedPos.current.x ||
				clamped.y !== lastClampedPos.current.y
			) {
				lastClampedPos.current = clamped;
				rndRef.current?.updatePosition(clamped);
			}
		},
		[width, height],
	);

	const handleDragStop = useCallback(
		(e: any, d: { x: number; y: number }) => {
			const { x: newX, y: newY } = d;
			const clamped = clampPosition(newX, newY, width, height);

			if (clamped.y === 0 && !maximized) {
				maximizeWindow(id);
			} else {
				restoreOriginalPosition(id);
				updateWindowRect(id, { x: clamped.x, y: clamped.y, width, height });
			}
			lastClampedPos.current = clamped;
		},
		[
			id,
			width,
			height,
			maximized,
			maximizeWindow,
			restoreOriginalPosition,
			updateWindowRect,
		],
	);

	const handleResizeStop = useCallback(
		(
			e: any,
			direction: any,
			ref: any,
			delta: any,
			position: { x: number; y: number },
		) => {
			const newWidth = parseInt(ref.style.width);
			const newHeight = parseInt(ref.style.height);
			const { x: newX, y: newY } = position;
			const clamped = clampPosition(newX, newY, newWidth, newHeight);

			if (delta.height !== 0 || delta.width !== 0) {
				restoreOriginalPosition(id);
			}
			updateWindowRect(id, {
				x: clamped.x,
				y: clamped.y,
				width: newWidth,
				height: newHeight,
			});
		},
		[id, restoreOriginalPosition, updateWindowRect],
	);

	return (
		<Activity mode={minimized ? "hidden" : "visible"}>
			<Rnd
				ref={rndRef}
				dragHandleClassName="window-drag-handle"
				position={{ x: maximized ? 0 : x, y: maximized ? 0 : y }}
				size={{
					width: maximized ? window.innerWidth : width,
					height: maximized ? window.innerHeight : height,
				}}
				style={{ zIndex }}
				disableDragging={maximized}
				enableResizing={!maximized}
				onDrag={handleDrag}
				onDragStop={handleDragStop}
				onResizeStop={handleResizeStop}
				minWidth={300}
				minHeight={200}
				resizeHandleStyles={{
					top: { cursor: "ns-resize" },
					bottom: { cursor: "ns-resize" },
					left: { cursor: "ew-resize" },
					right: { cursor: "ew-resize" },
					topLeft: { cursor: "nwse-resize" },
					topRight: { cursor: "nesw-resize" },
					bottomLeft: { cursor: "nesw-resize" },
					bottomRight: { cursor: "nwse-resize" },
				}}
				className={cn(
					"overflow-hidden border backdrop-blur-3xl",
					"shadow-2xl shadow-black/30 transition-shadow duration-200",
					"border-white/10 shadow-white/5",
					maximized ? "rounded-none" : "rounded-xl ",
					minimized ? "hidden" : "",
				)}
			>
				<div
					type="button"
					onDoubleClick={maximizeWindow.bind(null, id)}
					onClick={focusWindow.bind(null, id)}
					onKeyUp={focusWindow.bind(null, id)}
					className={cn(
						"window-drag-handle flex items-center justify-between h-10 pl-3 w-full",
						"bg-black/20 backdrop-blur-md border-b border-white/5",
						"select-none cursor-grab active:cursor-grabbing",
						maximized && "cursor-auto active:cursor-auto",
					)}
				>
					<div className="flex items-center gap-2 min-w-0">
						<img
							draggable={false}
							src={logo}
							alt=""
							className="w-5 h-5 rounded opacity-80"
						/>
						<span className="text-sm font-medium text-white/90 truncate">
							{title}
						</span>
					</div>

					<div
						type="button"
						className="menu flex flex-row items-center h-full pr-3 cursor-auto"
						onMouseDown={stopPropagation}
						onClick={stopPropagation}
					>
						<img
							onClick={minimizeWindow.bind(null, id)}
							onKeyUp={minimizeWindow.bind(null, id)}
							className="w-8 h-8 p-2 transition-colors duration-150 hover:bg-green-400/10 cursor-pointer"
							src="/general/Minimize.svg"
							alt="Minimize"
							draggable={false}
						/>
						<img
							onClick={maximizeWindow.bind(null, id)}
							onKeyUp={maximizeWindow.bind(null, id)}
							className="w-8 h-8 p-2 transition-colors duration-150 hover:bg-blue-400/10 cursor-pointer"
							src="/general/Maximize.svg"
							alt="Maximize"
							draggable={false}
						/>
						<img
							onClick={closeWindow.bind(null, id)}
							onKeyUp={closeWindow.bind(null, id)}
							className="w-8 h-8 p-2 transition-colors duration-150 hover:bg-red-400/10 cursor-pointer"
							src="/general/Close.svg"
							alt="Close"
							draggable={false}
						/>
					</div>
				</div>

				<div
					type="button"
					onClick={focusWindow.bind(null, id)}
					onKeyUp={focusWindow.bind(null, id)}
					className="w-full h-[calc(100%-2.5rem)] overflow-auto text-background"
					ref={contentRef}
				>
					{component}
				</div>
			</Rnd>
		</Activity>
	);
};

export default Window;
