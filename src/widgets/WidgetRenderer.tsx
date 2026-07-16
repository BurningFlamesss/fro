import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuItem,
	ContextMenuTrigger,
} from "#/components/ui/context-menu.tsx";
import { useWidgetStore } from "#/store/widget.tsx";
import type { WidgetInstance } from "../constants";

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

	if (hidden) {
		return null;
	}

	const Component = source.type === "component" ? source.code : null;
	const htmlContent = source.type === "html" ? source.code : "";

	return (
		<ContextMenu>
			<ContextMenuTrigger>
				{minimized ? (
					<div></div>
				) : (
					<div>
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
					</div>
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
