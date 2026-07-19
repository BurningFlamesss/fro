import React from "react";
import { parseFileName } from "#/lib/utils.ts";
import { useFileSystemStore } from "#/store/fs.tsx";

function Task() {
	const { nodes } = useFileSystemStore();
	const tasks = Object.entries(nodes).filter(([key, value]) => {
		const { extension } = parseFileName(value.name);
		return ["todo", "task"].includes(extension.toLowerCase());
	});
	return (
		<ul>
			{tasks.map((tab, index) => (
				<li key={`widget-task-pending-to-do-${tab[0]}`}>
					{index + 1}. {tab[1].content}
				</li>
			))}
		</ul>
	);
}

export default Task;
