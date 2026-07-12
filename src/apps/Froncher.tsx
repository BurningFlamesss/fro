import type React from "react";
import FroncherExplore from "#/components/FroncherExplore.tsx";
import { useWindowStore } from "#/store/window.tsx";
import type { WindowInstance } from "../constants";

export interface LaunchSpecification {
	name: string;
	source: { type: "ftml" | "fromponent"; code: string | React.ReactNode };
}

function Froncher({ windowId }: { windowId: string }) {
	const { windows } = useWindowStore();
	const win = Object.values(windows)
		.filter((win): win is WindowInstance => win !== undefined)
		.find((win) => win.id === windowId);

	const { name, source } = win?.launchSpecification ?? {
		name: "search",
		source: {
			type: "fromponent",
			code: <FroncherExplore />,
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

	return source.code as React.ReactNode;
}

export default Froncher;
