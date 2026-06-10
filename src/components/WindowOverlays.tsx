import { useWindowStore } from "#/store/window.tsx";
import type { WindowInstance } from "../constants";
import Window from "./Window";

function WindowOverlays() {
	const { windows, apps } = useWindowStore();

	const visibleWindows = Object.values(windows).filter(
		(win): win is WindowInstance => win !== undefined,
	);

	return (
		<main className="absolute top-0 -bottom-20 -left-40 -right-40">
			{visibleWindows.map((win) => (
				<Window
					key={win.id}
					win={win}
					apps={apps}
				/>
			))}
		</main>
	);
}

export default WindowOverlays;
