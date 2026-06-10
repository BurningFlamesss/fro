import { Rnd } from "react-rnd";
import { useWindowStore } from "#/store/window.tsx";
import type { AppId, AppInstance, WindowInstance } from "../constants";

function Window({
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
		theme,
	} = win;

	if (minimized) return null;

	const component = apps[appId].component;

	const stopPropagation = (e: React.MouseEvent | React.TouchEvent) =>
		e.stopPropagation();

	return (
		<Rnd
			bounds="parent"
			dragHandleClassName="window-drag-handle"
			position={{
				x: maximized ? 160 : win.x,
				y: maximized ? 0 : win.y,
			}}
			size={{
				width: maximized ? innerWidth : win.width,
				height: maximized ? innerHeight : win.height,
			}}
			style={{ zIndex }}
			onDragStop={(e, d) => {
				if (d.y === 0) {
					maximizeWindow(id)
				} else {
					restoreOriginalPosition(id)
					updateWindowRect(id, { x: d.x, y: d.y, width, height });
				}
			}}
			onResizeStop={(e, direction, ref, delta, position) => {
				if (delta.height !== 0 || delta.width !== 0) {
					restoreOriginalPosition(id)
				}
				updateWindowRect(id, {
					x: position.x,
					y: position.y,
					width: parseInt(ref.style.width),
					height: parseInt(ref.style.height),
				});
			}}
			minWidth={300}
			minHeight={200}
		>
			<div
				onDoubleClick={maximizeWindow.bind(null, id)}
				onClick={focusWindow.bind(null, id)}
				onKeyUp={focusWindow.bind(null, id)}
				className="window-drag-handle flex flex-row items-center justify-between p-2 bg-foreground text-background cursor-grab active:cursor-grabbing"
			>
				<div>
					<img className="w-6 h-6" src={logo} alt="" />
				</div>
				<p>{title}</p>
				<div className="menu flex flex-row items-center">
					<img
						onClick={minimizeWindow.bind(null, id)}
						onKeyUp={minimizeWindow.bind(null, id)}
						onMouseDown={stopPropagation}
						className="w-8 h-8 p-2 transition-colors duration-150 hover:bg-green-400/10 cursor-pointer"
						src="/public/general/Minimize.svg"
						alt="Minimize"
					/>
					<img
						onClick={maximizeWindow.bind(null, id)}
						onKeyUp={maximizeWindow.bind(null, id)}
						onMouseDown={stopPropagation}
						className="w-8 h-8 p-2 transition-colors duration-150 hover:bg-blue-400/10 cursor-pointer"
						src="/public/general/Maximize.svg"
						alt="Maximize"
					/>
					<img
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
				className="w-full h-[calc(100%-2.5rem)] overflow-auto pseudo-glassmorphism"
			>
				{component}
			</div>
		</Rnd>
	);
}

export default Window;
