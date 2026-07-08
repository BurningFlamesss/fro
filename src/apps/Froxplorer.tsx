import React, { useEffect, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import { FaArrowUp } from "react-icons/fa6";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "#/components/ui/context-menu.tsx";
import {
	parseFileName,
	searchFileAssociatesThroughExtension,
} from "#/lib/utils.ts";
import { type FileNode, useFileSystemStore } from "#/store/fs.tsx";
import { useLauncherStore } from "#/store/launcher.tsx";
import { useNoteStore } from "#/store/note.tsx";
import { useWindowStore } from "#/store/window.tsx";
import { Apps, type WindowInstance } from "../constants";
import { useDrag, useDrop } from "react-dnd";

function Froxplorer({ windowId }: { windowId: string }) {
	const { windows } = useWindowStore();
	const win = Object.values(windows)
		.filter((win): win is WindowInstance => win !== undefined)
		.find((win) => win.id === windowId);

	const folderId = win?.containerId ?? "root";
	const {
		nodes,
		addToDesktop,
		createNode,
		deleteNode,
		desktopContainerIds,
		moveNode,
		removeFromDesktop,
		renameNode,
		rootId,
		getChildren,
		getPath,
	} = useFileSystemStore();
	const { apps, openApp } = useWindowStore();
	const { tabs, selectTab, addTab } = useNoteStore();
	const { launchables, launch } = useLauncherStore();

	const [currentFolderId, setCurrentFolderId] = useState<string>(folderId);
	const [renameTarget, setRenameTarget] = useState<{
		id: string;
		type: "folder" | "file";
	} | null>(null);
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
			const { name, extension } = parseFileName(node.name);
			const { key } = searchFileAssociatesThroughExtension(extension);
			const app = Apps[key];

			if (!app) {
				const launchable = launchables.app_not_found;
				launch(launchable);
				return;
			}

			switch (app.id) {
				case "notes": {
					const tab = tabs.find((tab) => tab.id === node.id);
					if (!tab) {
						addTab(name, node.content, node.id);
					} else {
						selectTab(node.id);
					}
					openApp(app.id);
					break;
				}

				default: {
					const launchable = Object.entries(launchables).find(([key, value]) =>
						value.extension?.includes(extension),
					) || ["app_not_found", launchables.app_not_found];
					launch(launchable?.[1]);
					break;
				}
			}
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
			const { name: fileName, extension } = parseFileName(name);

			createNode(
				currentFolderId,
				`${fileName}.${extension ? extension : "frote"}`,
				"file",
			);
		}
	};

	const handleRenameStart = (node: FileNode) => {
		setRenameTarget({ id: node.id, type: node.type });
		setNewName(node.name);
	};

	const handleRenameSubmit = () => {
		if (renameTarget?.id && newName.trim().length > 0) {
			if (renameTarget.type === "folder") {
				renameNode(renameTarget.id, newName.trim());
			} else if (renameTarget.type === "file") {
				const { name: fileName, extension } = parseFileName(newName);
				renameNode(
					renameTarget.id,
					`${fileName}.${extension ? extension : "frote"}`,
				);
			}
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
						if (!node) {
							return null;
						}
						return (
							<React.Fragment key={`breadcrumb-${id}`}>
								<span>{` ${index ? "/" : ""} `}</span>
								<Breadcrumb
									moveNode={moveNode}
									navigateTo={navigateTo}
									node={node}
								>
									<button
										onClick={() => navigateTo(node.id)}
										type="button"
										className="cursor-pointer"
									>
										{node.name}
									</button>
								</Breadcrumb>
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
					<button
						type="button"
						// onClick={handleNewFile}
						className="text-xs p-1 rounded cursor-pointer"
					>
						Upload
					</button>
				</div>
			</div>

			{/* <Dropzone onDrop={() => {}}>
				{({ getRootProps, getInputProps }) => {
					return ( */}
			<div className="flex-1 overflow-auto p-2">
				{/* <input {...getInputProps()} /> */}
				<div className="grid grid-cols-6 p-4 gap-2">
					{children?.map((node) => (
						<ContextMenu key={`fs-node-${node.id}`}>
							<ContextMenuTrigger>
								{node.type === "folder" ? (
									<DroppableFolder
										moveNode={moveNode}
										navigateTo={navigateTo}
										node={node}
									>
										<DraggableItem node={node}>
											<button
												title={node.name}
												type="button"
												onDoubleClick={() => handleOpen(node)}
												className="flex flex-col items-center p-2 rounded-xl w-full cursor-pointer"
											>
												<img
													className="w-12 h-12 object-contain select-none"
													src={"/general/fs/Folder.svg"}
													alt=""
												/>
												{renameTarget && renameTarget.id === node.id ? (
													<input
														autoFocus={true}
														value={newName}
														onDoubleClick={(e) => e.stopPropagation()}
														onChange={(e) => setNewName(e.target.value)}
														onBlur={handleRenameSubmit}
														onKeyDown={(e) =>
															e.key === "Enter" && handleRenameSubmit()
														}
														className="mt-1 text-xs text-center bg-white text-black outline-none w-18"
														type="text"
													/>
												) : (
													<p className="text-xs text-center mt-1 truncate w-18 select-none">
														{node.name}
													</p>
												)}
											</button>
										</DraggableItem>
									</DroppableFolder>
								) : (
									<DraggableItem node={node}>
										<button
											title={node.name}
											type="button"
											onDoubleClick={() => handleOpen(node)}
											className="flex flex-col items-center p-2 rounded-xl w-full cursor-pointer"
										>
											<img
												className="w-12 h-12 object-contain select-none"
												src={`/general/fs/File-${searchFileAssociatesThroughExtension(parseFileName(node.name).extension).file_image}.svg`}
												alt=""
											/>
											{renameTarget && renameTarget.id === node.id ? (
												<input
													autoFocus={true}
													value={newName}
													onDoubleClick={(e) => e.stopPropagation()}
													onChange={(e) => setNewName(e.target.value)}
													onBlur={handleRenameSubmit}
													onKeyDown={(e) =>
														e.key === "Enter" && handleRenameSubmit()
													}
													className="mt-1 text-xs text-center bg-white text-black outline-none w-18"
													type="text"
												/>
											) : (
												<p className="text-xs text-center mt-1 truncate w-18 select-none">
													{node.name}
												</p>
											)}
										</button>
									</DraggableItem>
								)}
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
			{/* );
				}}
			</Dropzone> */}
		</div>
	);
}

export default Froxplorer;

function useDropTarget(
	folderId: string,
	moveNode: (id: string, newParentId: string) => void,
	navigateTo: (id: string) => void,
	hoverDelay = 600,
) {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [{ isOver }, drop] = useDrop(
		() => ({
			accept: "FS_NODE",
			collect: (monitor) => ({ isOver: monitor.isOver() }),
			hover: () => {
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
				}

				timeoutRef.current = setTimeout(() => {
					navigateTo(folderId);
					timeoutRef.current = null;
				}, hoverDelay);
			},
			drop: (item: { id: string }) => {
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
					timeoutRef.current = null;
				}

				moveNode(item.id, folderId);
			},
		}),
		[folderId, moveNode, navigateTo, hoverDelay],
	);

	useEffect(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
	}, []);

	useEffect(() => {
		if (!isOver && timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	}, [isOver]);

	return { drop, isOver };
}

const DraggableItem = ({
	node,
	children,
}: {
	node: FileNode;
	children: React.ReactNode;
}) => {
	const [{ isDragging }, drag] = useDrag(() => ({
		type: "FS_NODE",
		item: { id: node.id },
		collect: (monitor) => ({ isDragging: monitor.isDragging() }),
	}));
	return (
		<div ref={drag} style={{ opacity: isDragging ? 0.8 : 1 }}>
			{children}
		</div>
	);
};

const DroppableFolder = ({
	node,
	moveNode,
	navigateTo,
	children,
}: {
	node: FileNode;
	moveNode: (id: string, newParentId: string) => void;
	navigateTo: (id: string) => void;
	children: React.ReactNode;
}) => {
	const { drop, isOver } = useDropTarget(node.id, moveNode, navigateTo);

	return (
		<div
			className={`${isOver ? "ring-2 ring-primary/50 rounded-xl" : ""}`}
			ref={drop}
		>
			{children}
		</div>
	);
};

const Breadcrumb = ({
	node,
	moveNode,
	navigateTo,
	children,
}: {
	node: FileNode;
	moveNode: (id: string, newParentId: string) => void;
	navigateTo: (id: string) => void;
	children: React.ReactNode;
}) => {
	const { drop, isOver } = useDropTarget(node.id, moveNode, navigateTo);

	return (
		<span
			className={`${isOver ? "text-primary" : ""}`}
			ref={drop}
		>
			{children}
		</span>
	);
};
