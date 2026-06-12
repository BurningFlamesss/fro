import { useWindowStore } from "#/store/window.tsx";
import type { WindowInstance } from "../constants";
import Window from "./Window";

function WindowOverlays() {
	const { windows } = useWindowStore();

	const visibleWindows = Object.values(windows).filter(
		(win): win is WindowInstance => win !== undefined,
	);

	return (
		<main className="absolute inset-0 overflow-hidden">
			{visibleWindows.map((win) => (
				<Window
					key={win.id}
					win={win}
				/>
			))}
		</main>
	);
}

export default WindowOverlays;