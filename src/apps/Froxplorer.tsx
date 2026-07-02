import { useState } from "react";
import { FaArrowUp } from "react-icons/fa6";
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
		getChildren,
		getPath,
	} = useFileSystemStore();

	const [currentFolderId, setCurrentFolderId] = useState<string>(folderId);
	const [renameTarget, setRenameTarget] = useState<string | null>(null);
	const [newName, setNewName] = useState<string>("");

	const children = getChildren(currentFolderId);
	const currentFolder = nodes[currentFolderId];

	const pathIds = getPath(currentFolderId);
	const breadcrumb = pathIds?.map((id) => nodes[id].name).join(" / ");

	return (
		<div className="flex flex-col h-full">
			<div className="flex items-center p-2 gap-2 border-b">
				<button
					type="button"
					className="p-1 rounded-full hover:bg-background/10 cursor-pointer"
				>
					<FaArrowUp />
				</button>
				<span className="text-sm opacity-80">{breadcrumb}</span>
			</div>
		</div>
	);
}

export default Froxplorer;
