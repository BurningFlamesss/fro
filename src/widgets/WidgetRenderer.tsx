import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuItem,
	ContextMenuTrigger,
} from "#/components/ui/context-menu.tsx";
import { useWidgetStore } from "#/store/widget.tsx";
import { Rnd } from "react-rnd";
import type { WidgetInstance } from "../constants";
import { useState } from "react";
import { cn } from "#/lib/utils.ts";

const MIN_WIDGET_WIDTH = 150;
const MIN_WIDGET_HEIGHT = 100;

function WidgetRenderer({ widget }: { widget: WidgetInstance }) {
	const {
		minimizeWidget,
		restoreWidget,
		hideWidget,
		lockWidget,
		updateWidgetRect,
		removeWidget,
	} = useWidgetStore();

	const { source, name, id, height, hidden, locked, minimized, width, x, y } =
		widget;

	const [isDragging, setIsDragging] = useState(false);

	

	if (hidden) {
		return null;
	}

	const Component = source.type === "component" ? source.code : null;
	const htmlContent = source.type === "html" ? source.code : "";

	return (
		<ContextMenu>
			<ContextMenuTrigger>
				{minimized ? (
					<div
						className="absolute glassmorphism rounded-lg px-3 py-1 cursor-pointer"
						style={{ left: x, top: y, width }}
						onClick={() => restoreWidget(id)}
					>
						<span className="text-xs font-medium text-white">{name}</span>
					</div>
				) : (
					<Rnd
						position={{ x, y }}
						size={{ width, height }}
						minHeight={MIN_WIDGET_HEIGHT}
						minWidth={MIN_WIDGET_WIDTH}
						disableDragging={locked}
						enableResizing={!locked}
						dragHandleClassName="widget_drag_handle"
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
						bounds={"parent"}
						className={cn(
							"absolute backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden",
							locked && "ring-1 ring-yellow-500/50",
						)}
					>
						<div className="w-full h-[calc(100%)] overflow-auto">
							{Component && <Component />}
							{htmlContent && (
								<iframe
									title={name}
									srcDoc={`
									<style>
										body { 
											font-family: 'Manrope', sans-serif; 
											margin:0; 
											padding:8px; 
											color:#fff; 
											background:transparent;
										}
									</style>
									${htmlContent}
								`}
									sandbox="allow-scripts"
									className="w-full h-full border-0"
								/>
							)}
						</div>
					</Rnd>
				)}
			</ContextMenuTrigger>
			<ContextMenuContent className="z-100000002">
				<ContextMenuGroup>
					{minimized ? (
						<ContextMenuItem onClick={() => restoreWidget(id)}>
							Restore
						</ContextMenuItem>
					) : (
						<ContextMenuItem onClick={() => minimizeWidget(id)}>
							Minimize
						</ContextMenuItem>
					)}
					<ContextMenuItem onClick={() => hideWidget(id)}>Hide</ContextMenuItem>
					<ContextMenuItem onClick={() => lockWidget(id, !locked)}>
						{locked ? "Unlock" : "Lock"}
					</ContextMenuItem>
					<ContextMenuItem onClick={() => removeWidget(id)}>
						Remove
					</ContextMenuItem>
				</ContextMenuGroup>
			</ContextMenuContent>
		</ContextMenu>
	);
}

export default WidgetRenderer;
