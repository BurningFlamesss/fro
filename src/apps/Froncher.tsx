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
		return <div dangerouslySetInnerHTML={{ __html: source.code }} />;
	}

	return source.code;
}

export default Froncher;
