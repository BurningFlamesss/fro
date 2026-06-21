import { useState } from "react";
import { PiEye, PiPencil, PiPlus, PiX } from "react-icons/pi";
import { cn } from "#/lib/utils.ts";
import { useNoteStore } from "#/store/note.tsx";

function Frotes() {
	const { tabs, activeTabId } = useNoteStore();
	const [preview, setPreview] = useState<boolean>(false);
	const activeTab = tabs.find((tab) => tab.id === activeTabId);

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
							key={`tab-${tab.id}`}
						>
							<span className="truncate">{tab.title}</span>
							{tabs.length > 1 && (
								<button
									type="button"
									aria-label="Close tab"
									onClick={(e) => {
										e.stopPropagation();
									}}
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
		</div>
	);
}

export default Frotes;
