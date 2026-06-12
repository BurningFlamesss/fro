import { createFileRoute } from "@tanstack/react-router";
import Screen from "#/components/Screen.tsx";
import Taskbar from "#/components/Taskbar.tsx";
import WindowOverlays from "#/components/WindowOverlays.tsx";
import { useSettingStore } from "#/store/setting.tsx";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const { backgroundImage }  = useSettingStore()
	return (
		<div className="os-container" style={{
			backgroundImage: `url(${backgroundImage})`
		}}>
			<Screen />
			<WindowOverlays />
			<Taskbar />
		</div>
	);
}
