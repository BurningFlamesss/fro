import { memo, useCallback, useRef } from "react";
import { Rnd } from "react-rnd";
import { cn } from "#/lib/utils.ts";
import { useWindowStore } from "#/store/window.tsx";
import type { AppId, AppInstance, WindowInstance } from "../constants";

const MIN_VISIBLE_W = 128;
const MIN_VISIBLE_H = 128;

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

const Window = memo(function Window({
	win,
	apps,
}: {
	win: WindowInstance;
	apps: Record<AppId, AppInstance>;
}) {
	const {
		minimizeWindow,
		maximizeWindow,
		restoreOriginalPosition,
		focusWindow,
		closeWindow,
		updateWindowRect,
	} = useWindowStore();

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

	if (minimized) return null;

	const component = apps[appId].component;
	const stopPropagation = (e: React.MouseEvent | React.TouchEvent) =>
		e.stopPropagation();

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
			className="pseudo-glassmorphism"
		>
			<div
				onDoubleClick={maximizeWindow.bind(null, id)}
				onClick={focusWindow.bind(null, id)}
				onKeyUp={focusWindow.bind(null, id)}
				className={cn(
					"window-drag-handle flex flex-row items-center justify-end pl-2 text-background cursor-grab active:cursor-grabbing select-none group",
					maximized ? "cursor-auto active:cursor-auto" : "",
				)}
			>
				{/* <div>
					<img draggable={false} className="w-6 h-6" src={logo} alt="" />
				</div>
				<p>{title}</p> */}
				<div className="menu flex flex-row items-center opacity-0 bg-transparent group-hover:opacity-100 group-hover:bg-black transition-all duration-200">
					<img
						draggable={false}
						onClick={minimizeWindow.bind(null, id)}
						onKeyUp={minimizeWindow.bind(null, id)}
						onMouseDown={stopPropagation}
						className="w-8 h-8 p-2 transition-colors duration-150 hover:bg-green-400/10 cursor-pointer"
						src="/public/general/Minimize.svg"
						alt="Minimize"
					/>
					<img
						draggable={false}
						onClick={maximizeWindow.bind(null, id)}
						onKeyUp={maximizeWindow.bind(null, id)}
						onMouseDown={stopPropagation}
						className="w-8 h-8 p-2 transition-colors duration-150 hover:bg-blue-400/10 cursor-pointer"
						src="/public/general/Maximize.svg"
						alt="Maximize"
					/>
					<img
						draggable={false}
						onClick={closeWindow.bind(null, id)}
						onKeyUp={closeWindow.bind(null, id)}
						onMouseDown={stopPropagation}
						className="w-8 h-8 p-2 transition-colors duration-150 hover:bg-red-400/10 cursor-pointer"
						src="/public/general/Close.svg"
						alt="Close"
					/>
				</div>
			</div>

			<div
				onClick={focusWindow.bind(null, id)}
				onKeyUp={focusWindow.bind(null, id)}
				className="w-full h-[calc(100%-2.5rem)] overflow-auto "
			>
				{component}
			</div>
		</Rnd>
	);
});

export default Window;
