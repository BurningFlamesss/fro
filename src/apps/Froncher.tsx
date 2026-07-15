import type { ComponentType } from "react";
import FroncherExplore from "#/components/FroncherExplore.tsx";
import type { LaunchProps } from "#/store/launcher.tsx";
import { useWindowStore } from "#/store/window.tsx";
import type { WindowInstance } from "../constants";

export interface LaunchSpecification {
	name: string;
	source:
		| {
				type: "ftml";
				code: string;
		  }
		| {
				type: "fromponent";
				code: ComponentType<LaunchProps>;
		  };
}

const WINDOW_SYSTEM_KEYS = [
	"id",
	"appId",
	"title",
	"theme",
	"logo",
	"minimized",
	"maximized",
	"zIndex",
	"component",
	"x",
	"y",
	"width",
	"height",
	"containerId",
	"launchSpecification",
] as const;

function Froncher({ windowId }: { windowId: string }) {
	const { windows } = useWindowStore();
	const win = Object.values(windows)
		.filter((win): win is WindowInstance => win !== undefined)
		.find((win) => win.id === windowId);

	const { name, source } = win?.launchSpecification ?? {
		name: "search",
		source: {
			type: "fromponent",
			code: FroncherExplore,
		},
	};

	if (source.type === "ftml" && typeof source.code === "string") {
		const injectableCode = `
		<style>
			body {
				font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif;
			}
		</style>
		<main>
			${source.code}
		</main>
		`;

		return (
			<iframe
				srcDoc={injectableCode}
				title={name}
				className="w-full h-full border-0"
				sandbox="allow-scripts allow-forms allow-modals allow-popups"
			/>
		);
	}

	const customProps = win
		? Object.fromEntries(
				Object.entries(win).filter(
					([key]) => !(WINDOW_SYSTEM_KEYS as readonly string[]).includes(key),
				),
			)
		: {};

	const Component = source.code;
	return <Component windowId={windowId} {...customProps} />;
}

export default Froncher;
