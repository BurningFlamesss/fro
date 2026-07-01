import { useRef, useState } from "react";
import { PiMagnifyingGlassDuotone, PiMicrophone, PiX } from "react-icons/pi";
import { cn } from "#/lib/utils.ts";

function Frotore() {
	const [value, setValue] = useState("");
	const [focused, setFocused] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const submit = (text: string) => {
		const trimmed = text.trim();
		if (!trimmed) return;

		// TODO: handleSubmit

		setValue("");
		setFocused(false);
		inputRef.current?.blur();
	};

	return (
		<div className="p-4">
			<div className="relative z-20 flex w-full flex-row items-center justify-center px-4 py-10">
				<div
					className={cn(
						"relative w-full transition-all duration-300",
						focused ? "max-w-2xl" : "max-w-xl",
					)}
				>
					<div
						onClick={() => inputRef.current?.focus()}
						className={cn(
							"relative flex items-center gap-3 rounded-2xl border transition-all duration-300",
							"border-background/10",
							focused ? "h-14 px-5 ring-2 ring-background/20" : "h-12 px-4",
						)}
					>
						<PiMagnifyingGlassDuotone
							className="shrink-0 text-background/40"
							size={focused ? 20 : 18}
						/>

						<input
							ref={inputRef}
							value={value}
							onChange={(e) => setValue(e.target.value)}
							onFocus={() => setFocused(true)}
							onKeyDown={(e) => {
								if (e.key === "Enter") submit(value);
								if (e.key === "Escape") {
									setFocused(false);
									inputRef.current?.blur();
								}
							}}
							placeholder="Search for an application or widget or game"
							className="flex-1 bg-transparent text-sm text-background outline-none placeholder:text-background/40"
						/>

						{value && (
							<button
								type="button"
								aria-label="Clear search"
								onClick={(e) => {
									e.stopPropagation();
									setValue("");
								}}
								className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-background/40 transition-colors hover:bg-background/10 hover:text-background/70"
							>
								<PiX size={12} />
							</button>
						)}

						<div className="h-5 w-px shrink-0 bg-background/10" />

						<button
							type="button"
							aria-label="Search by voice"
							onClick={(e) => e.stopPropagation()}
							className="flex shrink-0 cursor-pointer items-center justify-center text-background/30 transition-colors hover:text-background/60"
						>
							<PiMicrophone size={18} />
						</button>
					</div>

					{/* {focused && (
					<div className="absolute inset-x-0 top-full mt-2 overflow-hidden rounded-2xl border border-background/10 bg-foreground p-2 opacity-100">
						<ul className="flex flex-col gap-0.5">
							{SUGGESTIONS.map((suggestion) => (
								<li key={suggestion.text}>
									<button
										type="button"
										onClick={() => submit(suggestion.text)}
										className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-background/60 transition-colors hover:bg-background/5 hover:text-background"
									>
										<suggestion.icon
											className="shrink-0 text-background/40"
											size={16}
										/>
										<span className="truncate">{suggestion.text}</span>
										<PiArrowUpRight
											className="ml-auto shrink-0 text-background/20"
											size={14}
										/>
									</button>
								</li>
							))}
						</ul>
					</div>
				)} */}
				</div>
			</div>
			{focused && (
				<div
					className="absolute inset-0 z-10"
					aria-hidden="true"
					onClick={() => setFocused(false)}
				/>
			)}
			<h2 className="mb-4 text-lg font-semibold">Discover</h2>
			<div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
				<div className="flex flex-col items-center justify-center gap-y-1">
					<button
						type="button"
						className={cn(
							"group relative overflow-hidden rounded-xl transition-all cursor-pointer",
						)}
					>
						<img
							src={"/public/apps/Game.svg"}
							alt={""}
							loading="lazy"
							className="h-full w-full object-cover"
						/>
					</button>
					<div className="">
						<p className="truncate text-xs font-medium text-background">
							Froncher
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Frotore;
