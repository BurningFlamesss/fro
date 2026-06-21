import React, { useEffect, useRef, useState } from "react";
import { PiEye, PiPencil, PiPlus, PiX } from "react-icons/pi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "#/lib/utils.ts";
import { useNoteStore } from "#/store/note.tsx";

function Frotes() {
	const {
		tabs,
		activeTabId,
		addTab,
		closeTab,
		selectTab,
		updateContent,
		renameTab,
	} = useNoteStore();
	const [preview, setPreview] = useState<boolean>(false);
	const activeTab = tabs.find((tab) => tab.id === activeTabId);
	const [content, setContent] = useState<string>("");
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const saveTimer = useRef<ReturnType<typeof setTimeout>>(null);

	
	useEffect(() => {
		setContent(activeTab?.content ?? "");
	}, [activeTab]);

	useEffect(() => {
		if (activeTab && activeTab.title === "Untitled" && content.trim()) {
			const firstLine = content.trim().split("\n")[0]?.trim();

			if (firstLine) renameTab(activeTab.id, firstLine.slice(0, 30));
		}
	}, [activeTab, content, renameTab]);

	const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = e.target.value;
		setContent(newValue);

		setIsSaving(true);

		clearTimeout(saveTimer.current);

		saveTimer.current = setTimeout(() => {
			setIsSaving(false)
			updateContent(activeTabId, newValue);
		}, 1000);
	};

	return (
		<div className="flex flex-col bg-foreground text-background w-full h-full">
			<div className="flex items-end gap-1 px-2 pt-2.5 border-b border-background/5">
				{tabs?.map((tab) => {
					return (
						<div
							className={cn(
								"group flex min-w-0 max-w-40 cursor-pointer items-center gap-2 rounded-t-xl px-3 py-2 text-xs",
								tab.id === activeTabId
									? "bg-background/10 text-background"
									: "text-background/40 hover:bg-background/5",
							)}
							onClick={() => selectTab(tab.id)}
							key={`tab-${tab.id}`}
						>
							<span className="truncate">{tab.title}</span>
							{tabs.length > 1 && (
								<button
									type="button"
									aria-label="Close tab"
									onClick={(e) => {
										e.stopPropagation();
										closeTab(tab.id);
									}}
									disabled={isSaving}
									className={cn(
										"shrink-0 opacity-0 group-hover:opacity-100 text-background/50 hover:text-background cursor-pointer",
									)}
								>
									<PiX size={11} />
								</button>
							)}
						</div>
					);
				})}
				<button
					type="button"
					aria-label="New tab"
					onClick={addTab}
					className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-background/35 transition-colors hover:bg-background/5 hover:text-background/70"
				>
					<PiPlus size={15} />
				</button>
				<button
					type="button"
					aria-label="Toggle preview"
					onClick={() => setPreview(!preview)}
					className="ml-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-background/35 transition-colors hover:bg-background/5 hover:text-background/70"
				>
					{preview ? <PiPencil size={14} /> : <PiEye size={14} />}
				</button>
			</div>

			<div className="flex-1 overflow-auto">
				{preview ? (
					<div className="p-4 prose prose-invert max-w-none">
						<ReactMarkdown remarkPlugins={[remarkGfm]}>
							{activeTab?.content}
						</ReactMarkdown>
					</div>
				) : (
					<textarea
						value={content}
						onChange={handleContentChange}
						placeholder="Start writing..."
						className="w-full h-full resize-none bg-transparent p-4 outline-none text-sm"
						name="note"
						id="note"
					/>
				)}
			</div>
		</div>
	);
}

export default Frotes;
