import { useState } from "react";
import { FaArrowUp } from "react-icons/fa6";
import {
	ContextMenu,
	ContextMenuTrigger,
} from "#/components/ui/context-menu.tsx";
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
			<div className="flex items-center p-2 gap-2">
				<button
					type="button"
					className="p-1 rounded-full hover:bg-background/10 cursor-pointer"
				>
					<FaArrowUp />
				</button>
				<span className="text-sm opacity-80">{breadcrumb}</span>
			</div>

			<div className="flex-1 overflow-auto p-2">
				<div className="grid grid-cols-4 p-4">
					{children?.map((node) => (
						<ContextMenu key={`fs-node-${node.id}`}>
							<ContextMenuTrigger>
								<button type="button" onDoubleClick={() => {}} className="">
									<img
										className="w-12 h-12 object-contain"
										src={
											node.type === "folder"
												? "/apps/Opened-Folder.svg"
												: "/apps/Notepad.svg"
										}
										alt=""
									/>
								</button>
							</ContextMenuTrigger>
						</ContextMenu>
					))}
				</div>
			</div>
		</div>
	);
}

export default Froxplorer;
