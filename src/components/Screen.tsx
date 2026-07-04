import { FaPlus } from "react-icons/fa6";
import { IoMdRefresh } from "react-icons/io";
import { RiPushpinLine } from "react-icons/ri";
import {
	cn,
	parseFileName,
	searchFileAssociatesThroughExtension,
} from "#/lib/utils.ts";
import { useFileSystemStore, type FileNode } from "#/store/fs.tsx";
import { findAppWindows, useWindowStore } from "#/store/window.tsx";
import type { AppInstance, WindowInstance } from "../constants";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "./ui/context-menu";
import { useState } from "react";

function Screen() {
	const { apps, openApp, windows, focusWindow, pinApp } = useWindowStore();
	const {
		desktopContainerIds,
		nodes,
		removeFromDesktop,
		createNode,
		addToDesktop,
		renameNode,
	} = useFileSystemStore();
	const [renameTarget, setRenameTarget] = useState<{
		id: string;
		type: "folder" | "file";
	} | null>(null);
	const [newName, setNewName] = useState<string>("");

	const rootFolderID = "root";

	const desktopContainers = desktopContainerIds
		.map((id) => nodes[id])
		.filter(Boolean);

	const handleNewFolder = () => {
		const name = prompt("Enter the folder name");
		if (name) {
			const id = createNode(rootFolderID, name, "folder");
			addToDesktop(id);
		}
	};

	const handleNewFile = () => {
		const name = prompt("Enter the file name");
		if (name) {
			const { name: fileName, extension } = parseFileName(name);

			const id = createNode(
				rootFolderID,
				`${fileName}.${extension ? extension : "frote"}`,
				"file",
			);

			addToDesktop(id);
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
				return;
			}
			const { name: fileName, extension } = parseFileName(newName);
			renameNode(
				renameTarget.id,
				`${fileName}.${extension ? extension : "frote"}`,
			);
			setRenameTarget(null);
		}
	};

	const toggleApp = (app: AppInstance) => {
		const appWindows = findAppWindows(windows, app.id);

		if (appWindows.length === 0) {
			openApp(app.id);
			return;
		}

		if (appWindows.length === 1 && appWindows[0]) {
			const window = appWindows[0];

			if (window.minimized) {
				focusWindow(window.id);
				return;
			}

			const topWindow = Object.values(windows)
				.filter(
					(win): win is WindowInstance => win !== undefined && !win.minimized,
				)
				.reduce(
					(top, win) => (win.zIndex > (top?.zIndex ?? -1) ? win : top),
					null as WindowInstance | null,
				);

			if (topWindow && topWindow.id === window.id) {
			} else {
				focusWindow(window.id);
			}
		} else {
			const lastWin = appWindows.filter(Boolean).pop();
			if (lastWin) focusWindow(lastWin.id);
		}
	};

	return (
		<ContextMenu modal={false}>
			<ContextMenuTrigger>
				<div className="relative z-10 h-[calc(100dvh-76px)] w-full p-2 flex flex-col flex-wrap content-start overflow-y-auto">
					{Object.entries(apps).map(([key, app]) => (
						<ContextMenu key={`screen-app-${key}`}>
							<ContextMenuTrigger>
								<button
									type="button"
									onDoubleClick={() => toggleApp(app)}
									className={cn(
										"w-24 h-24 group p-2 rounded-xl transition-all duration-150 cursor-pointer flex flex-col items-center justify-center shrink-0",
									)}
								>
									<img
										className="w-12 h-12 object-contain opacity-90 group-hover:opacity-100 select-none"
										src={app.logo}
										alt={app.name}
										draggable={false}
									/>
									<p className="text-background glassmorphism py-0.5 px-2 rounded-sm text-xs truncate max-w-full select-none">
										{app.name}
									</p>
								</button>
							</ContextMenuTrigger>

							<ContextMenuContent className="z-100000002">
								<ContextMenuGroup>
									<ContextMenuItem onClick={() => toggleApp(app)}>
										<img
											draggable={false}
											className="h-4 w-4"
											src={app.logo}
											alt=""
										/>{" "}
										Open {app.name}
									</ContextMenuItem>
									<ContextMenuItem onClick={() => openApp(app.id)}>
										<img
											draggable={false}
											className="h-4 w-4"
											src={app.logo}
											alt=""
										/>{" "}
										New Window
									</ContextMenuItem>
									<ContextMenuItem onClick={() => pinApp(app.id)}>
										<RiPushpinLine className="text-background" />
										Pin to taskbar
									</ContextMenuItem>
								</ContextMenuGroup>
							</ContextMenuContent>
						</ContextMenu>
					))}
					{desktopContainers.map((container) => {
						return (
							<ContextMenu key={`desktop-container-${container.id}`}>
								<ContextMenuTrigger>
									<button
										type="button"
										onDoubleClick={() =>
											openApp("file_explorer", undefined, {
												containerId: container.id,
											})
										}
										className={cn(
											"w-24 h-24 group p-2 rounded-xl transition-all duration-150 cursor-pointer flex flex-col items-center justify-center shrink-0",
										)}
									>
										<img
											className="w-12 h-12 object-contain opacity-90 group-hover:opacity-100 select-none"
											src={
												container.type === "folder"
													? "/general/fs/Folder.svg"
													: `/general/fs/File-${searchFileAssociatesThroughExtension(parseFileName(container.name).extension).file_image}.svg`
											}
											alt={container.name}
											draggable={false}
										/>
										{renameTarget && renameTarget.id === container.id ? (
											<input
												autoFocus={true}
												value={newName}
												onDoubleClick={(e) => e.stopPropagation()}
												onChange={(e) => setNewName(e.target.value)}
												onBlur={handleRenameSubmit}
												onKeyDown={(e) =>
													e.key === "Enter" && handleRenameSubmit()
												}
												className="py-0.5 px-2 text-xs text-center bg-white text-black outline-none max-w-full"
												type="text"
											/>
										) : (
											<p className="text-background glassmorphism py-0.5 px-2 rounded-sm text-xs truncate max-w-full select-none">
												{container.name}
											</p>
										)}
									</button>
								</ContextMenuTrigger>
								<ContextMenuContent>
									<ContextMenuItem
										onClick={() =>
											openApp("file_explorer", undefined, {
												containerId: container.id,
											})
										}
									>
										Open
									</ContextMenuItem>
									<ContextMenuItem onClick={() => handleRenameStart(container)}>
										Rename
									</ContextMenuItem>
									<ContextMenuItem
										onClick={() => removeFromDesktop(container.id)}
									>
										Remove from desktop
									</ContextMenuItem>
								</ContextMenuContent>
							</ContextMenu>
						);
					})}
				</div>
			</ContextMenuTrigger>
			<ContextMenuContent className="z-100000002">
				<ContextMenuGroup>
					<ContextMenuItem
						onClick={() => {
							setTimeout(() => {
								window.location.reload();
							}, 200);
						}}
					>
						<IoMdRefresh className="text-background" />
						Refresh
					</ContextMenuItem>
					<ContextMenuSub>
						<ContextMenuSubTrigger>
							<FaPlus className="text-background" />
							New
						</ContextMenuSubTrigger>
						<ContextMenuSubContent className="w-44 z-100000003">
							<ContextMenuItem onClick={() => handleNewFolder()}>
								Folder
							</ContextMenuItem>
							<ContextMenuItem onClick={() => handleNewFile()}>
								File
							</ContextMenuItem>
							<ContextMenuItem>Fro File</ContextMenuItem>
						</ContextMenuSubContent>
					</ContextMenuSub>
				</ContextMenuGroup>
			</ContextMenuContent>
		</ContextMenu>
	);
}

export default Screen;
