import React, { useState } from "react";
import { FaArrowUp } from "react-icons/fa6";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "#/components/ui/context-menu.tsx";
import { type FileNode, useFileSystemStore } from "#/store/fs.tsx";
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

	const navigateTo = (id: string) => setCurrentFolderId(id);

	const goUp = () => {
		if (currentFolder.parentId) {
			navigateTo(currentFolder.parentId);
		}
	};

	const handleOpen = (node: FileNode) => {
		if (node.type === "folder") {
			navigateTo(node.id);
		} else {
			alert(`Opening file...`);
		}
	};

	const handleNewFolder = () => {
		const name = prompt("Enter the folder name");
		if (name) {
			createNode(currentFolderId, name, "folder");
		}
	};

	const handleNewFile = () => {
		const name = prompt("Enter the file name");
		if (name) {
			createNode(currentFolderId, name, "file");
		}
	};

	const handleRenameStart = (node: FileNode) => {
		setRenameTarget(node.id);
		setNewName(node.name);
	};

	const handleRenameSubmit = () => {
		if (renameTarget && newName.trim().length > 0) {
			renameNode(renameTarget, newName);
			setRenameTarget(null);
		}
	};

	const pathIds = getPath(currentFolderId);

	return (
		<div className="flex flex-col h-full">
			<div className="flex items-center p-2 gap-2">
				<button
					type="button"
					onClick={goUp}
					disabled={!currentFolder.parentId}
					className="p-1 rounded-full hover:bg-background/10 cursor-pointer"
				>
					<FaArrowUp />
				</button>
				<span className="text-sm opacity-80">
					{pathIds?.map((id, index) => {
						const node = nodes[id];
						return (
							<React.Fragment key={`breadcrumb-${id}`}>
								<span>{` ${index ? "/" : ""} `}</span>
								<button
									onClick={() => navigateTo(node.id)}
									type="button"
									className="cursor-pointer"
								>
									{node.name}
								</button>
							</React.Fragment>
						);
					})}
				</span>
				<div className="flex ml-auto p-2 gap-2">
					<button
						type="button"
						onClick={handleNewFolder}
						className="text-xs p-1 rounded cursor-pointer"
					>
						New Folder
					</button>
					<button
						type="button"
						onClick={handleNewFile}
						className="text-xs p-1 rounded cursor-pointer"
					>
						New File
					</button>
				</div>
			</div>

			<div className="flex-1 overflow-auto p-2">
				<div className="grid grid-cols-6 p-4">
					{children?.map((node) => (
						<ContextMenu key={`fs-node-${node.id}`}>
							<ContextMenuTrigger>
								<button
									title={node.name}
									type="button"
									onDoubleClick={() => handleOpen(node)}
									className="flex flex-col items-center p-2 rounded-xl w-full cursor-pointer"
								>
									<img
										className="w-12 h-12 object-contain select-none"
										src={
											node.type === "folder"
												? "/apps/Opened-Folder.svg"
												: "/apps/Notepad.svg"
										}
										alt=""
									/>
									{renameTarget === node.id ? (
										<input
											value={newName}
											onChange={(e) => setNewName(e.target.value)}
											onBlur={handleRenameSubmit}
											onKeyDown={(e) =>
												e.key === "Enter" && handleRenameSubmit()
											}
											className="mt-1 text-xs text-center bg-white text-black outline-none w-16"
											type="text"
										/>
									) : (
										<p className="text-xs text-center mt-1 truncate w-16 select-none">
											{node.name}
										</p>
									)}
								</button>
							</ContextMenuTrigger>
							<ContextMenuContent className="z-100000002">
								<ContextMenuItem onClick={() => handleOpen(node)}>
									Open
								</ContextMenuItem>
								<ContextMenuItem onClick={() => handleRenameStart(node)}>
									Rename
								</ContextMenuItem>
								<ContextMenuItem onClick={() => addToDesktop(node.id)}>
									Add to desktop
								</ContextMenuItem>
								<ContextMenuItem onClick={() => removeFromDesktop(node.id)}>
									Remove from desktop
								</ContextMenuItem>
								<ContextMenuItem onClick={() => deleteNode(node.id)}>
									Delete
								</ContextMenuItem>
							</ContextMenuContent>
						</ContextMenu>
					))}
				</div>
			</div>
		</div>
	);
}

export default Froxplorer;
