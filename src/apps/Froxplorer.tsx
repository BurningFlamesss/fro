import React from "react";
import { useFileSystemStore } from "#/store/fs.tsx";
import { useWindowStore } from "#/store/window.tsx";
import type { WindowInstance } from "../constants";

function Froxplorer({ windowId }: { windowId: WindowInstance["id"] }) {
	const win = useWindowStore((state) => state.windows[windowId]);
	const folderId = win?.folderId ?? "root";
	const {
		nodes,
		addToDesktop,
		createNode,
		deleteNode,
		desktopFolderIds,
		moveNode,
		removeFromDesktop,
		renameNode,
		rootId,
	} = useFileSystemStore();

	return (
		<div>
			<h1>Hello</h1>
		</div>
	);
}

export default Froxplorer;
