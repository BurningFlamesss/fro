import { Checkbox } from "#/components/ui/checkbox.tsx";
import { useNoteStore } from "#/store/note.tsx";

export const TASK_TAB_ID = "user-task.todo";
export const COMPLETED_MARKER = "[x]";
export const INCOMPLETE_MARKER = "[ ]";

function Task() {
	const { tabs, addTab, updateContent } = useNoteStore();
	const taskTab = tabs.find((tab) => tab.id === TASK_TAB_ID);
	const content = taskTab?.content ?? "";

	const taskItems = content
		.split("\n")
		.map((line) => {
			const trimmed = line.trim();
			if (trimmed.startsWith(COMPLETED_MARKER)) {
				return {
					text: trimmed.slice(COMPLETED_MARKER.length).trim(),
					completed: true,
				};
			}
			if (trimmed.startsWith(INCOMPLETE_MARKER)) {
				return {
					text: trimmed.slice(INCOMPLETE_MARKER.length).trim(),
					completed: false,
				};
			}
			return { text: trimmed, completed: false };
		})
		.filter((item) => item.text.length > 0);

	const buildContent = (items: typeof taskItems) =>
		items
			.map(
				(item) =>
					`${item.completed ? COMPLETED_MARKER : INCOMPLETE_MARKER} ${item.text}`,
			)
			.join("\n");

	const handleAddTask = (value: string) => {
		const trimmed = value.trim();
		if (!trimmed) return;

		if (!taskTab) {
			addTab("Tasks", `${INCOMPLETE_MARKER} ${trimmed}`, TASK_TAB_ID, "todo");
		} else {
			const newItems = [...taskItems, { text: trimmed, completed: false }];
			const newContent = buildContent(newItems);
			updateContent(TASK_TAB_ID, newContent);
		}
	};

	const toggleTask = (index: number) => {
		if (!taskTab) return;
		const updatedItems = taskItems.map((item, i) =>
			i === index ? { ...item, completed: !item.completed } : item,
		);
		const newContent = buildContent(updatedItems);
		updateContent(TASK_TAB_ID, newContent);
	};

	return (
		<ul className="p-4 min-h-full w-full bg-black/15 backdrop-blur-[20px] backdrop-saturate-150 border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.2)] text-white flex flex-col gap-y-2">
			<input
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						handleAddTask(e.currentTarget.value);
						e.currentTarget.value = "";
					}
				}}
				placeholder="Add your task"
				className="max-h-6 flex-1 bg-transparent text-sm text-white border-b border-b-transparent focus:border-b-white transition-all duration-75 focus:outline-none placeholder:text-white/40"
			/>
			{taskItems.map((task, index) => (
				<li
					key={`widget-task-${index}`}
					className="flex justify-start items-center gap-x-2"
				>
					<Checkbox
						className="cursor-pointer"
						checked={task.completed}
						onCheckedChange={() => toggleTask(index)}
					/>
					<span className={task.completed ? "line-through opacity-60" : ""}>
						{task.text}
					</span>
				</li>
			))}
		</ul>
	);
}

export default Task;
