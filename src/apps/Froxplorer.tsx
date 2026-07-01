import { useFileSystemStore } from "#/store/fs.tsx";
import { useWindowStore } from "#/store/window.tsx";
import type { WindowInstance } from "../constants";
import { FaArrowUp } from "react-icons/fa6";

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

	const breadcrumb = ""

	return (
		<div className="flex flex-col h-full">
			<div className="flex items-center p-2 gap-2 border-b">
				<button type="button" className="p-1 rounded-full hover:bg-background/10 cursor-pointer">
					<FaArrowUp />
				</button>
				<span className="text-sm opacity-80">{breadcrumb}</span>
			</div>
			
		</div>
	);
}

export default Froxplorer;
