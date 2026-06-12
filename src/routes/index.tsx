import { createFileRoute } from "@tanstack/react-router";
import Screen from "#/components/Screen.tsx";
import Taskbar from "#/components/Taskbar.tsx";
import WindowOverlays from "#/components/WindowOverlays.tsx";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div className="os-container">
			<Screen />
			<WindowOverlays />
			<Taskbar />
		</div>
	);
}
