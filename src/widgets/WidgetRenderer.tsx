import { useCallback, useRef } from "react";
import { Rnd } from "react-rnd";
import { cn } from "#/lib/utils.ts";
import { useWidgetStore } from "#/store/widget.tsx";
import type { WidgetInstance } from "../constants";
import {
	FaLock,
	FaLockOpen,
	FaRegWindowMinimize,
	FaXmark,
} from "react-icons/fa6";

const MIN_VISIBLE_W = 100;
const MIN_VISIBLE_H = 40;
const MIN_WIDGET_W = 150;
const MIN_WIDGET_H = 100;

const clampPosition = (
	x: number,
	y: number,
	w: number,
	h: number,
	containerW: number,
	containerH: number,
) => {
	const maxX = containerW - MIN_VISIBLE_W;
	const minX = -w + MIN_VISIBLE_W;
	const maxY = containerH - MIN_VISIBLE_H;
	const minY = 0;
	return {
		x: Math.min(maxX, Math.max(minX, x)),
		y: Math.min(maxY, Math.max(minY, y)),
	};
};

const getCanvasRect = (): DOMRect | null => {
	const el = document.getElementById("widget-canvas");
	return el ? el.getBoundingClientRect() : null;
};

export default function WidgetRenderer({ widget }: { widget: WidgetInstance }) {
	const {
		minimizeWidget,
		restoreWidget,
		hideWidget,
		lockWidget,
		updateWidgetRect,
		removeWidget,
	} = useWidgetStore();

	const { id, name, x, y, width, height, minimized, hidden, locked, source } =
		widget;

	if (hidden) return null;

	const rndRef = useRef<Rnd>(null);
	const lastClampedPos = useRef({ x, y });

	const handleDrag = useCallback(
		(_e: any, d: { x: number; y: number }) => {
			const container = getCanvasRect();
			if (!container) return;
			const clamped = clampPosition(
				d.x,
				d.y,
				width,
				height,
				container.width,
				container.height,
			);
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
		(_e: any, d: { x: number; y: number }) => {
			const container = getCanvasRect();
			if (!container) return;
			const clamped = clampPosition(
				d.x,
				d.y,
				width,
				height,
				container.width,
				container.height,
			);
			updateWidgetRect(id, {
				x: clamped.x,
				y: clamped.y,
				width,
				height,
			});
			lastClampedPos.current = clamped;
		},
		[id, width, height, updateWidgetRect],
	);

	const handleResizeStop = useCallback(
		(
			_e: any,
			_dir: any,
			ref: any,
			_delta: any,
			position: { x: number; y: number },
		) => {
			const container = getCanvasRect();
			if (!container) return;
			const newWidth = parseInt(ref.style.width);
			const newHeight = parseInt(ref.style.height);
			const clamped = clampPosition(
				position.x,
				position.y,
				newWidth,
				newHeight,
				container.width,
				container.height,
			);
			updateWidgetRect(id, {
				x: clamped.x,
				y: clamped.y,
				width: newWidth,
				height: newHeight,
			});
		},
		[id, updateWidgetRect],
	);

	const stopPropagation = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	if (minimized) {
		return (
			<div
				className="absolute glassmorphism px-3 py-1 cursor-pointer"
				style={{ left: x, top: y }}
				onClick={() => restoreWidget(id)}
			>
				<span className="text-xs font-medium text-background">{name}</span>
			</div>
		);
	}

	return (
		<Rnd
			ref={rndRef}
			dragHandleClassName="widget-drag-handle"
			position={{ x, y }}
			size={{ width, height }}
			minWidth={MIN_WIDGET_W}
			minHeight={MIN_WIDGET_H}
			disableDragging={locked}
			enableResizing={!locked}
			bounds={document.getElementById("widget-canvas") ? "parent" : undefined}
			onDrag={handleDrag}
			onDragStop={handleDragStop}
			onResizeStop={handleResizeStop}
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
			className={cn("absolute overflow-hidden group")}
		>
			<div
				className={cn(
					"group-hover:opacity-100 opacity-0 transition-all duration-75 widget-drag-handle flex items-center justify-between h-8",
					"select-none cursor-grab active:cursor-grabbing",
					locked && "cursor-auto active:cursor-auto",
				)}
			>
				<div
					className="flex items-center gap-1 cursor-auto glassmorphism"
					onMouseDown={stopPropagation}
					onClick={stopPropagation}
				>
					<button
						type="button"
						onClick={() => minimizeWidget(id)}
						className="w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-green-400/20 text-background/60 hover:text-background text-sm"
						title="Minimize"
					>
						<FaRegWindowMinimize />
					</button>
					<button
						type="button"
						onClick={() => lockWidget(id, !locked)}
						className={`w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-yellow-400/20 ${
							locked
								? "text-yellow-400"
								: "text-background/60 hover:text-background"
						} text-sm`}
						title={locked ? "Unlock" : "Lock"}
					>
						{locked ? <FaLock /> : <FaLockOpen />}
					</button>
					<button
						type="button"
						onClick={() => removeWidget(id)}
						className="w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-red-400/20 text-background/60 hover:text-background text-sm"
						title="Remove"
					>
						<FaXmark />
					</button>
				</div>
			</div>

			<div className="w-full h-[calc(100%-2rem)] overflow-auto glassmorphism">
				{source.type === "component" && source.code ? (
					<source.code />
				) : source.type === "html" ? (
					<iframe
						srcDoc={`
						<style>
							body { font-family: 'Manrope', sans-serif; margin:0; padding:8px; color:#fff; background:transparent; }
						</style>
						${source.code}
						`}
						title={name}
						className="w-full h-full border-0"
						sandbox="allow-scripts"
					/>
				) : null}
			</div>
		</Rnd>
	);
}
