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
	const { minimizeWindow, focusWindow, closeWindow, updateWindowRect } =
		useWindowStore();
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
			position={{ x: win.x, y: win.y }}
			size={{ width: win.width, height: win.height }}
			style={{ zIndex }}
			onDragStop={(e, d) => {
				updateWindowRect(id, { x: d.x, y: d.y, width, height });
			}}
			onResizeStop={(e, direction, ref, delta, position) => {
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
				onDoubleClick={() =>
					updateWindowRect(id, {
						x: 160,
						y: 0,
						width: innerWidth,
						height: innerHeight,
					})
				}
				onClick={() => focusWindow(id)}
				onKeyUp={() => focusWindow(id)}
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
						onClick={() =>
							updateWindowRect(id, {
								x: 160,
								y: 0,
								width: innerWidth,
								height: innerHeight,
							})
						}
						onKeyUp={() =>
							updateWindowRect(id, {
								x: 160,
								y: 0,
								width: innerWidth,
								height: innerHeight,
							})
						}
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
				onClick={() => focusWindow(id)}
				onKeyUp={() => focusWindow(id)}
				className="w-full h-[calc(100%-2.5rem)] overflow-auto pseudo-glassmorphism"
			>
				{component}
			</div>
		</Rnd>
	);
}

export default Window;
