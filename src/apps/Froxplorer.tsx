import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
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
import { Apps, type AppId, type WindowInstance } from "../constants";
import { useCalculatorStore } from "#/store/calculator.tsx";
import { FILE_ASSOCIATIONS } from "#/lib/fileAssociates.ts";
import { useTerminalStore } from "#/store/terminal.tsx";
import { useBrowserStore } from "#/store/browser.tsx";

function useHoverNavigate(onNavigate: () => void, delay = 600) {
	const timeoutReference = useRef<NodeJS.Timeout | null>(null);
	const [isHovering, setIsHovering] = useState(false);

	const onDragOverHandler = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault();
			if (!timeoutReference.current) {
				setIsHovering(true);
				timeoutReference.current = setTimeout(() => {
					onNavigate();
					timeoutReference.current = null;
					setIsHovering(false);
				}, delay);
			}
		},
		[onNavigate, delay],
	);

	const onDragLeaveHandler = useCallback((event: React.DragEvent) => {
		setIsHovering(false);
		if (timeoutReference.current) {
			clearTimeout(timeoutReference.current);
			timeoutReference.current = null;
		}
	}, []);

	const onDropHandler = useCallback((event: React.DragEvent) => {
		setIsHovering(false);
		if (timeoutReference.current) {
			clearTimeout(timeoutReference.current);
			timeoutReference.current = null;
		}
	}, []);

	useEffect(() => {
		return () => {
			if (timeoutReference.current) clearTimeout(timeoutReference.current);
		};
	}, []);

	return {
		isHovering,
		onDragOver: onDragOverHandler,
		onDragLeave: onDragLeaveHandler,
		onDrop: onDropHandler,
	};
}

const DraggableItem = ({
	node,
	onDragStart,
	children,
}: {
	node: FileNode;
	onDragStart: (nodeId: string) => void;
	children: React.ReactNode;
}) => {
	const handleDragStart = (event: React.DragEvent) => {
		event.dataTransfer.setData("text/plain", node.id);
		onDragStart(node.id);

		const emptyImage = new Image();
		emptyImage.src = "/logo.png";
		event.dataTransfer.setDragImage(emptyImage, 0, 0);
	};

	return (
		<div draggable onDragStart={handleDragStart} style={{ cursor: "grab" }}>
			{children}
		</div>
	);
};

const DroppableFolder = ({
	node,
	moveNode,
	onNavigate,
	draggedNodeId,
	children,
}: {
	node: FileNode;
	moveNode: (id: string, newParentId: string) => void;
	onNavigate: () => void;
	draggedNodeId: string | null;
	children: React.ReactNode;
}) => {
	const { isHovering, onDragOver, onDragLeave, onDrop } =
		useHoverNavigate(onNavigate);

	const handleDrop = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault();
			event.stopPropagation();
			const nodeId = draggedNodeId || event.dataTransfer.getData("text/plain");
			if (nodeId) {
				moveNode(nodeId, node.id);
			}
			onDrop(event);
		},
		[node.id, moveNode, draggedNodeId, onDrop],
	);

	return (
		<div
			onDragOver={onDragOver}
			onDragLeave={onDragLeave}
			onDrop={handleDrop}
			className={isHovering ? "ring-2 ring-primary/50 rounded-xl" : ""}
		>
			{children}
		</div>
	);
};

const BreadcrumbDropTarget = ({
	node,
	moveNode,
	onNavigate,
	draggedNodeId,
	children,
}: {
	node: FileNode;
	moveNode: (id: string, newParentId: string) => void;
	onNavigate: () => void;
	draggedNodeId: string | null;
	children: React.ReactNode;
}) => {
	const { isHovering, onDragOver, onDragLeave, onDrop } =
		useHoverNavigate(onNavigate);

	const handleDrop = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault();
			event.stopPropagation();
			const nodeId = draggedNodeId || event.dataTransfer.getData("text/plain");
			if (nodeId) {
				moveNode(nodeId, node.id);
			}
			onDrop(event);
		},
		[node.id, moveNode, draggedNodeId, onDrop],
	);

	return (
		<span
			onDragOver={onDragOver}
			onDragLeave={onDragLeave}
			onDrop={handleDrop}
			className={isHovering ? "bg-primary" : ""}
		>
			{children}
		</span>
	);
};

function Froxplorer({ windowId }: { windowId: string }) {
	const { windows } = useWindowStore();
	const win = windows[windowId];

	const folderId = win?.containerId ?? "root";
	const {
		nodes,
		addToDesktop,
		createNode,
		deleteNode,
		moveNode,
		removeFromDesktop,
		renameNode,
		getChildren,
		getPath,
	} = useFileSystemStore();
	const { openApp } = useWindowStore();
	const { tabs, selectTab, addTab } = useNoteStore();
	const { launchables, launch } = useLauncherStore();
	const { setCalculatorExpression } = useCalculatorStore();
	const { setCommandExpression } = useTerminalStore();
	const { editTabs } = useBrowserStore()

	const [currentFolderId, setCurrentFolderId] = useState<string>(folderId);
	const [renameTarget, setRenameTarget] = useState<{
		id: string;
		type: "folder" | "file";
	} | null>(null);
	const [newName, setNewName] = useState<string>("");

	const children = getChildren(currentFolderId);
	const currentFolder = nodes[currentFolderId];

	const navigateTo = useCallback((id: string) => setCurrentFolderId(id), []);

	const goUp = () => {
		if (currentFolder.parentId) navigateTo(currentFolder.parentId);
	};

	const handleOpen = async (node: FileNode, openId?: AppId) => {
		await new Promise((resolve, reject) => setTimeout(() => resolve(null), 20)); // Awaiting so that the context menu gets in original position and the z-index order isnot disturbed

		const { name, extension } = parseFileName(node.name);

		if (openId) {
			const tab = tabs.find((tab) => tab.id === node.id);

			if (!tab) addTab(name, node.content, node.id);
			else selectTab(node.id);

			openApp(openId);

			return;
		}

		if (node.type === "folder") {
			navigateTo(node.id);
		} else {
			const { key } = searchFileAssociatesThroughExtension(extension, {
				...FILE_ASSOCIATIONS,
				app_view: {
					file_image: "view",
					extension: ["png", "jpg", "jpeg", "svg"],
				},
			});

			switch (key) {
				case "notes": {
					const tab = tabs.find((tab) => tab.id === node.id);

					if (!tab) addTab(name, node.content, node.id);
					else selectTab(node.id);

					openApp(key);

					break;
				}
				case "calculator": {
					setCalculatorExpression(node.content ?? "");
					openApp(key);

					break;
				}
				case "terminal": {
					setCommandExpression(node.content ?? "");
					openApp(key);

					break;
				}
				case "browser": {
					editTabs("1", {
						query: node.content ?? ""
					})
					openApp(key)


					break;
				}
				case "app_view": {
					launch({
						id: "app_froview",
						name: "App_froview",
						source: {
							type: "fromponent",
							code: (
								<>
									<img src={node.content} alt="" />
								</>
							),
						},
						logo: "/apps/Game.svg",
						showInCollections: true,
					});
					break;
				}
				default: {
					const launchable = Object.entries(launchables).find(([, value]) =>
						value.extension?.includes(extension),
					) || ["app_not_found", launchables.app_not_found];

					launch(launchable[1]);
				}
			}

			if (!key) {
				launch(launchables.app_not_found);
				return;
			}
		}
	};

	const draggedNodeIdReference = useRef<string | null>(null);
	const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

	const handleDragStart = useCallback((nodeId: string) => {
		draggedNodeIdReference.current = nodeId;
		setDraggedNodeId(nodeId);
	}, []);

	useEffect(() => {
		const onDragEnd = () => {
			draggedNodeIdReference.current = null;
			setDraggedNodeId(null);
		};
		window.addEventListener("dragend", onDragEnd);
		return () => window.removeEventListener("dragend", onDragEnd);
	}, []);

	const readFileContent = async (file: File): Promise<string> => {
		const isText =
			file.type.startsWith("text/") ||
			[
				"application/json",
				"application/javascript",
				"application/xml",
			].includes(file.type);
		if (isText) return file.text();
		return new Promise<string>((resolve) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.readAsDataURL(file);
		});
	};

	const handleDirectoryUpload = async (
		entry: FileSystemDirectoryEntry,
		parentId: string,
	) => {
		const folderId = createNode(parentId, entry.name, "folder");
		if (!folderId) return;
		const reader = entry.createReader();
		const readAllEntries = (): Promise<FileSystemEntry[]> =>
			new Promise((resolve) => reader.readEntries(resolve));
		const entries = await readAllEntries();
		for (const child of entries) {
			if (child.isDirectory) {
				await handleDirectoryUpload(
					child as FileSystemDirectoryEntry,
					folderId,
				);
			} else {
				const fileEntry = child as FileSystemFileEntry;
				const file = await new Promise<File>((resolve) =>
					fileEntry.file(resolve),
				);
				const content = await readFileContent(file);
				createNode(folderId, file.name, "file", content);
			}
		}
	};

	const onDropExternal = useCallback(
		async (acceptedFiles: File[]) => {
			for (const file of acceptedFiles) {
				if ((file as any).webkitGetAsEntry) {
					const entry = (file as any).webkitGetAsEntry();
					if (entry?.isDirectory) {
						await handleDirectoryUpload(entry, currentFolderId);
						continue;
					}
				}
				const content = await readFileContent(file);
				createNode(currentFolderId, file.name, "file", content);
			}
		},
		[currentFolderId, createNode],
	);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop: onDropExternal,
		noClick: true,
		noKeyboard: true,
	});

	const rootProps = getRootProps();
	const containerReference = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerReference.current;
		if (!container) return;

		const onContainerDragOver = (event: DragEvent) => {
			event.preventDefault();
		};

		const onContainerDrop = (event: DragEvent) => {
			if (event.dataTransfer?.files && event.dataTransfer.files.length > 0)
				return;

			event.preventDefault();
			const nodeId =
				draggedNodeIdReference.current ||
				event.dataTransfer?.getData("text/plain");
			if (nodeId) {
				moveNode(nodeId, currentFolderId);
				draggedNodeIdReference.current = null;
				setDraggedNodeId(null);
			}
		};

		container.addEventListener("dragover", onContainerDragOver);
		container.addEventListener("drop", onContainerDrop);

		return () => {
			container.removeEventListener("dragover", onContainerDragOver);
			container.removeEventListener("drop", onContainerDrop);
		};
	}, [currentFolderId, moveNode]);

	const pathIds = getPath(currentFolderId);

	const handleNewFolder = () => {
		const name = prompt("Enter the folder name");
		if (name) createNode(currentFolderId, name, "folder");
	};

	const handleNewFile = () => {
		const name = prompt("Enter the file name");
		if (name) {
			const { name: fileName, extension } = parseFileName(name);
			createNode(
				currentFolderId,
				`${fileName}.${extension || "frote"}`,
				"file",
			);
		}
	};

	const handleRenameStart = (node: FileNode) => {
		setRenameTarget({ id: node.id, type: node.type });
		setNewName(node.name);
	};

	const handleRenameSubmit = () => {
		if (renameTarget?.id && newName.trim()) {
			if (renameTarget.type === "folder") {
				renameNode(renameTarget.id, newName.trim());
			} else {
				const { name: fileName, extension } = parseFileName(newName);
				renameNode(renameTarget.id, `${fileName}.${extension || "frote"}`);
			}
			setRenameTarget(null);
		}
	};

	return (
		<div className="flex flex-col h-full">
			<div className="flex items-center p-2 gap-2 select-none">
				<button
					type="button"
					onClick={goUp}
					disabled={!currentFolder.parentId}
					className="p-1 rounded-full hover:bg-background/10 cursor-pointer"
				>
					<FaArrowUp />
				</button>
				<span className="text-sm opacity-80">
					{pathIds.map((id, index) => {
						const node = nodes[id];
						if (!node) return null;
						return (
							<React.Fragment key={`breadcrumb-${id}`}>
								<span>{index ? " / " : ""}</span>
								<BreadcrumbDropTarget
									node={node}
									moveNode={moveNode}
									onNavigate={() => navigateTo(node.id)}
									draggedNodeId={draggedNodeId}
								>
									<button
										type="button"
										onClick={() => navigateTo(node.id)}
										className="cursor-pointer"
									>
										{node.name}
									</button>
								</BreadcrumbDropTarget>
							</React.Fragment>
						);
					})}
				</span>
				<div className="flex ml-auto gap-2">
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
						onClick={() => document.getElementById("upload-input")?.click()}
						className="text-xs p-1 rounded cursor-pointer"
					>
						Upload
					</button>
				</div>
			</div>

			<div
				{...rootProps}
				ref={containerReference}
				className="flex-1 overflow-auto p-2"
			>
				<input {...getInputProps()} id="upload-input" className="hidden" />
				<div className="grid grid-cols-6 p-4 gap-2">
					{children.map((node) => {
						const { key, extension, file_image } =
							searchFileAssociatesThroughExtension(
								parseFileName(node.name).extension,
							);

						return (
							<ContextMenu key={`fs-node-${node.id}`}>
								<ContextMenuTrigger>
									{node.type === "folder" ? (
										<DroppableFolder
											node={node}
											moveNode={moveNode}
											onNavigate={() => navigateTo(node.id)}
											draggedNodeId={draggedNodeId}
										>
											<DraggableItem node={node} onDragStart={handleDragStart}>
												<button
													title={node.name}
													type="button"
													onDoubleClick={() => handleOpen(node)}
													className="flex flex-col items-center p-2 rounded-xl w-full cursor-pointer"
												>
													<img
														className="w-12 h-12 object-contain select-none"
														src="/general/fs/Folder.svg"
														alt=""
														draggable={false}
													/>
													{renameTarget?.id === node.id ? (
														<input
															autoFocus
															value={newName}
															onDoubleClick={(e) => e.stopPropagation()}
															onChange={(e) => setNewName(e.target.value)}
															onBlur={handleRenameSubmit}
															onKeyDown={(e) =>
																e.key === "Enter" && handleRenameSubmit()
															}
															className="mt-1 text-xs text-center bg-white text-black outline-none w-18"
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
										<DraggableItem node={node} onDragStart={handleDragStart}>
											<button
												title={node.name}
												type="button"
												onDoubleClick={() => handleOpen(node)}
												className="flex flex-col items-center p-2 rounded-xl w-full cursor-pointer"
											>
												<img
													className="w-12 h-12 object-contain select-none"
													src={`/general/fs/File-${file_image}.svg`}
													alt=""
													draggable={false}
												/>
												{renameTarget?.id === node.id ? (
													<input
														autoFocus
														value={newName}
														onDoubleClick={(e) => e.stopPropagation()}
														onChange={(e) => setNewName(e.target.value)}
														onBlur={handleRenameSubmit}
														onKeyDown={(e) =>
															e.key === "Enter" && handleRenameSubmit()
														}
														className="mt-1 text-xs text-center bg-white text-black outline-none w-18"
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
									{node.type === "file" && key ? (
										<ContextMenuItem onClick={() => handleOpen(node, "notes")}>
											Edit in Frotes
										</ContextMenuItem>
									) : null}
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
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default Froxplorer;
