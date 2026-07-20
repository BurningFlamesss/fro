import { parseFileName } from "#/lib/utils.ts";
import { useFileSystemStore } from "#/store/fs.tsx";

function Task() {
	const { nodes } = useFileSystemStore();
	const tasks = Object.entries(nodes).filter(([key, value]) => {
		const { extension } = parseFileName(value.name);
		return ["todo", "task"].includes(extension.toLowerCase());
	});
	return (
		<ul className="p-4 min-h-full w-full glassmorphism">
			{tasks.length > 0 ? tasks.map((tab, index) => (
				<li key={`widget-task-pending-to-do-${tab[0]}`}>
					{index + 1}. {tab[1].content}
				</li>
			)) : <li className="h-full w-full flex flex-row items-center justify-center">No Any Tasks</li>}
		</ul>
	);
}

export default Task;
