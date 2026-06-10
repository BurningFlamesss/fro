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
	const { minimizeWindow, closeWindow, updateWindowRect } = useWindowStore();
	const {
		id,
		appId,
		height,
		logo,
		minimized,
		title,
		width,
		x,
		y,
		zIndex,
		theme,
	} = win;

	if (minimized) return null;

	const component = apps[appId].component;

	const stopPropagation = (e: React.MouseEvent | React.TouchEvent) => e.stopPropagation();

	return (
		<Rnd
			bounds="parent"
			dragHandleClassName="window-drag-handle"
			default={{
				x,
				y,
				width,
				height,
			}}
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
			<div className="window-drag-handle flex flex-row items-center justify-between p-2 bg-foreground text-background cursor-grab active:cursor-grabbing">
				<div />
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
						onMouseDown={stopPropagation}
						className="w-8 h-8 p-2 transition-colors duration-150 hover:bg-blue-400/10 cursor-pointer"
						src="/public/general/Maximize.svg"
						alt="Maximize"
					/>
					<img
						onClick={closeWindow.bind(null, id)}
						onKeyUp={minimizeWindow.bind(null, id)}
						onMouseDown={stopPropagation}
						className="w-8 h-8 p-2 transition-colors duration-150 hover:bg-red-400/10 cursor-pointer"
						src="/public/general/Close.svg"
						alt="Close"
					/>
				</div>
			</div>

			<div className="w-full h-[calc(100%-2.5rem)] overflow-auto pseudo-glassmorphism">
				{component}
			</div>
		</Rnd>
	);
}

export default Window;
