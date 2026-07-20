import { type ComponentType, useMemo, useRef, useState } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { cn, generateTypingParagraph } from "#/lib/utils.ts";
import { useWindowStore } from "./window";

export type LaunchProps = {
	windowId?: string;
	params?: Array<string>;
	[key: string]: unknown;
};

export interface Launchable {
	id: string;
	name: string;
	source:
		| {
				type: "ftml";
				code: string;
		  }
		| {
				type: "fromponent";
				code: ComponentType<LaunchProps>;
		  };
	shortcut?:
		| {
				name: string;
		  }
		| false;
	logo: string;
	showInCollections?: boolean;
	extension?: Array<string>;
}

interface LauncherStore {
	launchables: Record<string, Launchable>;
	recentLaunches: Map<string, number>;
	launch: (data: Launchable, props?: Record<string, unknown>) => void;
}

export const useLauncherStore = create<LauncherStore>()(
	immer((set) => {
		return {
			launchables: {
				app_not_found: {
					id: "app_not_found",
					name: "App not found",
					source: {
						type: "fromponent",
						code: AppNotFound,
					},
					logo: "/apps/Game.svg",
					showInCollections: true,
				},
				app_fypemaster: {
					id: "app_fypemaster",
					name: "Fypemaster",
					logo: "/public/apps/FypeMaster.svg",
					source: {
						type: "fromponent",
						code: FypeMaster,
					},
					showInCollections: true,
				},
			},
			recentLaunches: new Map<string, number>(),
			launch: (data, props) =>
				set((state) => {
					state.launchables[data.id] = data;
					state.recentLaunches.set(data.id, Date.now());

					useWindowStore.getState().openApp("launcher", undefined, {
						launchSpecification: {
							name: data.name,
							source: data.source,
						},
						title: data.name,
						logo: data.logo,
						...props,
					});
				}),
		};
	}),
);

function AppNotFound() {
	return (
		<main className="min-h-full w-full flex flex-col items-center justify-center overflow-hidden">
			<div className="min-h-full w-full flex flex-row items-center justify-center text-8xl font-black tracking-tight text-[#69C242]">
				4<img src="/logo.png" className="w-32 h-32" alt="" />4
			</div>
			<p className="text-xl font-semibold text-primary">
				Are you f*#king kidding me?
			</p>
			<p>
				Uh-oh! App not found. (*I meant*{" "}
				<span className="text-primary font-semibold">"Froking"</span>)
			</p>
		</main>
	);
}

function FypeMaster({ params }: LaunchProps) {
	const requestedLength = Number(params?.[0]);

	const typingParagraphLength =
		Number.isFinite(requestedLength) && requestedLength > 0
			? requestedLength
			: 100;

	const [typingParagraph, setTypingParagraph] = useState(() =>
		generateTypingParagraph(typingParagraphLength),
	);

	const characters = useMemo(() => [...typingParagraph], [typingParagraph]);

	const startedAt = useRef<number | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const [typedText, setTypedText] = useState("");

	const [stats, setStats] = useState<{
		wpm: number;
		accuracy: number;
		time: number;
		correct: number;
		incorrect: number;
	} | null>(null);

	const completed = stats !== null;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (completed) return;

		const value = e.target.value;

		if (value.length > typingParagraph.length) {
			return;
		}

		if (startedAt.current === null && value.length > 0) {
			startedAt.current = performance.now();
		}

		setTypedText(value);

		if (value.length !== typingParagraph.length) {
			return;
		}

		const endedAt = performance.now();

		const elapsedMinutes = (endedAt - startedAt.current!) / 60000;

		let correct = 0;

		for (let i = 0; i < value.length; i++) {
			if (value[i] === typingParagraph[i]) {
				correct++;
			}
		}

		const incorrect = value.length - correct;

		setStats({
			time: elapsedMinutes * 60,
			wpm: correct / 5 / elapsedMinutes,
			accuracy: (correct / value.length) * 100,
			correct,
			incorrect,
		});
	};

	if (completed) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="w-120 rounded-xl p-6">
					<h1 className="text-3xl font-bold">Typing Complete</h1>

					<div className="mt-8 grid grid-cols-2 gap-6">
						<div>
							<p className="text-muted-foreground">Speed</p>
							<p className="text-3xl font-bold">{stats.wpm.toFixed(1)}</p>
							<p>WPM</p>
						</div>

						<div>
							<p className="text-muted-foreground">Accuracy</p>
							<p className="text-3xl font-bold">{stats.accuracy.toFixed(1)}%</p>
						</div>

						<div>
							<p className="text-muted-foreground">Time</p>
							<p className="text-3xl font-bold">{stats.time.toFixed(2)}s</p>
						</div>

						<div>
							<p className="text-muted-foreground">Mistakes</p>
							<p className="text-3xl font-bold">{stats.incorrect}</p>
						</div>
					</div>

					<div className="mt-8 flex justify-end gap-3">
						<button
							type="button"
							onClick={() => {
								setStats(null);
								setTypedText("");
								startedAt.current = null;

								setTypingParagraph(
									generateTypingParagraph(typingParagraphLength),
								);

								inputRef.current?.focus();
							}}
							className="rounded-md bg-primary px-4 py-2 text-primary-foreground cursor-pointer"
						>
							Restart
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className="relative h-full w-full p-8 flex items-center justify-center"
			onClick={() => inputRef?.current?.focus()}
		>
			<input
				ref={inputRef}
				autoFocus
				spellCheck={false}
				autoCorrect="off"
				autoCapitalize="off"
				className="absolute pointer-events-none opacity-0"
				value={typedText}
				onChange={handleChange}
			/>

			<p className="font-mono text-2xl leading-relaxed whitespace-pre-wrap wrap-break-word select-none">
				{characters.map((char, index) => {
					const typed = typedText[index];

					let className = "text-gray-300";

					if (typed !== undefined) {
						className = typed === char ? "text-green-500" : "text-red-500";
					}

					const isCurrent = index === typedText.length;

					return (
						<span
							key={`typed-character-${index}-${char}`}
							className={cn("relative inline-block", className)}
						>
							{isCurrent && (
								<span className="absolute left-0 top-2 bottom-0 h-6 w-0.5 bg-primary animate-caret-blink delay-100" />
							)}

							{char === " " ? "\u00A0" : char}
						</span>
					);
				})}
			</p>
		</div>
	);
}
