import { useCallback, useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import { FaCircleCheck, FaPenFancy, FaWikipediaW } from "react-icons/fa6";
import {
	PiArrowUpRight,
	PiCompassDuotone,
	PiGlobeDuotone,
	PiMagnifyingGlassDuotone,
	PiMicrophone,
	PiPlus,
	PiShieldWarningDuotone,
	PiSpinnerGap,
	PiWarningOctagonDuotone,
	PiX,
} from "react-icons/pi";
import { SiExcalidraw } from "react-icons/si";
import { TbMathMaxMin } from "react-icons/tb";
import { cn } from "#/lib/utils.ts";
import { checkEmbeddable } from "#/server/checkEmbeddable.tsx";
import { getSearchResults } from "#/server/getSearchResults.tsx";

type TabState =
	| "search"
	| "loading"
	| "results"
	| "surfing"
	| "error"
	| "warning";

interface Tab {
	id: string;
	title: string;
	state: TabState;
	url?: string;
	query?: string;
	searchResponse?: {
		results?: Array<{
			title: string;
			url: string;
			content: string;
			rawContent?: string;
			score: number;
			publishedDate: string;
			favicon?: string;
		}>;
		images?: Array<{
			url: string;
			description?: string;
		}>;
		answer?: string;
	};
}

interface PinnedSite {
	name: string;
	url: string;
	icon: IconType;
	color: string;
}

interface Suggestion {
	icon: IconType;
	text: string;
}

const PINNED_SITES: PinnedSite[] = [
	{
		name: "Wikipedia",
		url: "https://www.wikipedia.org/",
		icon: FaWikipediaW,
		color: "#ffffff",
	},
	{
		name: "Excalidraw",
		url: "https://excalidraw.com/",
		icon: SiExcalidraw,
		color: "#5865f2",
	},
	{
		name: "Desmos",
		url: "https://www.desmos.com/calculator",
		icon: TbMathMaxMin,
		color: "#00ff00",
	},
	{
		name: "Zenpen",
		url: "https://zenpen.io/",
		icon: FaPenFancy,
		color: "#00ffff",
	},
	{
		name: "Pomofocus",
		url: "https://pomofocus.io/",
		icon: FaCircleCheck,
		color: "ff0000",
	},
];

const SUGGESTIONS: Suggestion[] = [
	{ icon: PiGlobeDuotone, text: "frocus.tech" },
	{ icon: PiGlobeDuotone, text: "time.is" },
];

const STATE_META: Record<
	TabState,
	{ icon: IconType; label: string; hint: string; tone: string; spin?: boolean }
> = {
	loading: {
		icon: PiSpinnerGap,
		label: "Loading",
		hint: "Fetching the page",
		tone: "text-background",
		spin: true,
	},
	results: {
		icon: PiMagnifyingGlassDuotone,
		label: "Search results",
		hint: "Results page goes here",
		tone: "text-background",
	},
	search: {
		icon: PiGlobeDuotone,
		label: "Search",
		hint: "Search the web",
		tone: "text-background",
	},
	surfing: {
		icon: PiGlobeDuotone,
		label: "Browsing",
		hint: "The live page would render here",
		tone: "text-background",
	},
	error: {
		icon: PiWarningOctagonDuotone,
		label: "Page not reachable",
		hint: "Something went wrong loading this page",
		tone: "text-red-400",
	},
	warning: {
		icon: PiShieldWarningDuotone,
		label: "Proceed with caution",
		hint: "This site might not be safe",
		tone: "text-amber-400",
	},
};

const isUrlLike = (value: string) =>
	/^https?:\/\//i.test(value) || /^[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(value);

function SearchBar({
	focused,
	setFocused,
	onSubmit,
}: {
	focused: boolean;
	setFocused: (value: boolean) => void;
	onSubmit: (query: string) => void;
}) {
	const [value, setValue] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	const submit = (text: string) => {
		const trimmed = text.trim();
		if (!trimmed) return;
		onSubmit(trimmed);
		setValue("");
		setFocused(false);
		inputRef.current?.blur();
	};

	return (
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
					placeholder="Search the web or enter an address"
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

			{focused && (
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
			)}
		</div>
	);
}

function PinnedSites({ onSelect }: { onSelect: (site: PinnedSite) => void }) {
	return (
		<div className="flex flex-wrap items-start justify-center gap-4 sm:gap-5">
			{PINNED_SITES.map((site) => (
				<button
					key={site.name}
					type="button"
					onClick={() => onSelect(site)}
					className="group flex w-16 cursor-pointer flex-col items-center gap-2"
				>
					<div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-background/10 bg-foreground/80 transition-colors hover:bg-foreground group-hover:bg-foreground/85 sm:h-14 sm:w-14">
						<site.icon size={22} style={{ color: site.color }} />
					</div>
					<span className="w-full truncate text-center text-xs text-background transition-colors">
						{site.name}
					</span>
				</button>
			))}

			<button
				type="button"
				className="group flex w-16 cursor-pointer flex-col items-center gap-2"
			>
				<div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-dashed border-background/15 bg-foreground/80 transition-colors group-hover:bg-foreground sm:h-14 sm:w-14">
					<PiPlus className="text-background" size={20} />
				</div>
				<span className="text-xs text-background">Add</span>
			</button>
		</div>
	);
}

function NewTabView({
	onSearch,
	onNavigate,
}: {
	onSearch: (query: string) => void;
	onNavigate: (site: PinnedSite) => void;
}) {
	const [focused, setFocused] = useState(false);

	return (
		<div className="relative flex flex-1 flex-col items-center overflow-y-auto px-6 py-10 sm:py-14">
			<div className="relative z-20 flex w-full flex-row items-center justify-center px-4">
				<SearchBar
					focused={focused}
					setFocused={setFocused}
					onSubmit={onSearch}
				/>
			</div>

			<div
				className={cn(
					"mt-10 transition-all duration-300 sm:mt-12",
					focused && "blur-sm opacity-40 pointer-events-none",
				)}
			>
				<PinnedSites onSelect={onNavigate} />
			</div>

			{focused && (
				<div
					className="absolute inset-0 z-10"
					aria-hidden="true"
					onClick={() => setFocused(false)}
				/>
			)}
		</div>
	);
}

function ResultsView({
	tab,
	addAndUpdateTab,
	updateTab,
}: {
	tab: Tab;
	addAndUpdateTab: (patch: Partial<Tab>) => void;
	updateTab: (id: string, patch: Partial<Tab>) => void;
}) {
	return (
		<>
			AI answer: {tab.searchResponse?.answer}
			<br />
			<main className="h-full w-full overflow-y-auto flex flex-col justify-start items-start">
				{tab.searchResponse?.results?.map((result) => {
					return (
						<button
							type="button"
							onClick={(e) => {
								e.preventDefault();
								addAndUpdateTab({
									url: result.url,
									state: "surfing",
									title: result.title,
								});
							}}
							className="cursor-pointer text-primary underline"
							key={`result-${result.title}`}
						>
							{result.title}
						</button>
					);
				})}
			</main>
		</>
	);
}

function SurfingView({ tab }: { tab: Tab }) {
	const [canEmbed, setCanEmbed] = useState<boolean>(true);

	useEffect(() => {
		const check = async (url: string) => {
			const embeddable = await checkEmbeddable({
				data: {
					url,
				},
			});
			setCanEmbed(embeddable);
		};

		if (tab.url) {
			check(tab.url);
		} else {
			setCanEmbed(false);
		}
	}, [tab.url]);

	if (!tab.url || !tab.title) {
		return null;
	}

	if (!canEmbed) {
		window.open(tab.url, "_blank", "noopener,noreferrer");
	}

	return (
		<>
			{canEmbed ? (
				<iframe
					className="h-[calc(100%+72px)] w-full"
					src={tab.url}
					title={tab.title}
					frameBorder="0"
					onError={() => setCanEmbed(false)}
				></iframe>
			) : (
				<div className="h-full w-full flex flex-col items-center justify-center gap-y-4">
					<p>This site cannot be reached.</p>

					<a
						className="px-3 py-2 glassmorphism rounded-xl"
						href={tab.url}
						target="_blank"
					>
						Open Site in New Tab
					</a>
				</div>
			)}
		</>
	);
}

function PlaceholderView({
	state,
	tab,
	onReset,
}: {
	state: Exclude<TabState, "search">;
	tab: Tab;
	onReset: () => void;
}) {
	const meta = STATE_META[state];

	return (
		<div className="relative flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
			<div className="flex h-16 w-16 items-center justify-center rounded-3xl">
				<meta.icon
					className={cn(meta.tone, meta.spin && "animate-spin")}
					size={28}
				/>
			</div>
			<div>
				<p className="font-medium text-background">{meta.label}</p>
				<p className="mt-1 max-w-xs text-sm text-background/40">
					{tab.query ?? tab.url ?? meta.hint}
				</p>
			</div>
			{state !== "loading" && (
				<button
					type="button"
					onClick={onReset}
					className="mt-2 cursor-pointer rounded-xl border border-background/10 px-4 py-2 text-sm text-background/70 transition-colors hover:text-background"
				>
					Back to new tab
				</button>
			)}
		</div>
	);
}

function getTabIcon(state: TabState): {
	icon: IconType;
	tone: string;
	spin?: boolean;
} {
	if (state === "search")
		return { icon: PiCompassDuotone, tone: "text-background/35" };

	const meta = STATE_META[state];

	return { icon: meta.icon, tone: meta.tone, spin: meta.spin };
}

function TabBar({
	tabs,
	currentTabId,
	onSelect,
	onClose,
	onAdd,
}: {
	tabs: Tab[];
	currentTabId: string;
	onSelect: (id: string) => void;
	onClose: (id: string) => void;
	onAdd: () => void;
}) {
	return (
		<div className="relative z-30 flex items-end gap-1 px-2 pt-2.5">
			{tabs.map((tab) => {
				const isActive = tab.id === currentTabId;
				const { icon: Icon, tone, spin } = getTabIcon(tab.state);
				return (
					<div
						key={tab.id}
						onClick={() => onSelect(tab.id)}
						className={cn(
							"group relative flex min-w-0 max-w-[180px] cursor-pointer items-center gap-2 rounded-t-xl px-3 py-2 text-xs font-medium transition-colors",
							isActive
								? "bg-background/10 text-background"
								: "text-background/40 hover:bg-background/5 hover:text-background/80",
						)}
					>
						<Icon
							className={cn(
								"shrink-0",
								isActive ? tone : "text-background/25",
								spin && "animate-spin",
							)}
							size={14}
						/>
						<span className="flex-1 truncate">{tab.title}</span>

						{tabs.length > 1 && (
							<button
								type="button"
								aria-label="Close tab"
								onClick={(e) => {
									e.stopPropagation();
									onClose(tab.id);
								}}
								className={cn(
									"flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-background/10",
									!isActive && "opacity-0 group-hover:opacity-100",
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
				onClick={onAdd}
				className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-background/35 transition-colors hover:bg-background/5 hover:text-background/70"
			>
				<PiPlus size={15} />
			</button>
		</div>
	);
}

function Frowser() {
	const [tabs, setTabs] = useState<Tab[]>([
		{ id: "1", title: "New Tab", state: "search" },
	]);
	const [currentTabId, setCurrentTabId] = useState("1");

	const currentTab = tabs.find((tab) => tab.id === currentTabId) ?? tabs[0];

	const updateTab = useCallback((id: string, patch: Partial<Tab>) => {
		setTabs((prev) =>
			prev.map((tab) => (tab.id === id ? { ...tab, ...patch } : tab)),
		);
	}, []);

	const addAndUpdateTab = useCallback((patch: Partial<Tab>) => {
		const id = crypto.randomUUID();
		setTabs((prev) => [...prev, { id, title: "", state: "surfing", ...patch }]); // defaults will eventually get override
		setCurrentTabId(id);
	}, []);

	const addTab = useCallback(() => {
		const id = crypto.randomUUID();
		setTabs((prev) => [...prev, { id, title: "New Tab", state: "search" }]);
		setCurrentTabId(id);
	}, []);

	const closeTab = useCallback(
		(id: string) => {
			setTabs((prev) => {
				if (prev.length === 1) {
					const fresh: Tab = {
						id: crypto.randomUUID(),
						title: "New Tab",
						state: "search",
					};
					setCurrentTabId(fresh.id);
					return [fresh];
				}
				const index = prev.findIndex((tab) => tab.id === id);
				const next = prev.filter((tab) => tab.id !== id);
				if (id === currentTabId) {
					setCurrentTabId((next[index - 1] ?? next[index] ?? next[0]).id);
				}
				return next;
			});
		},
		[currentTabId],
	);

	const handleSearch = useCallback(
		async (query: string) => {
			const id = currentTabId;
			const navigating = isUrlLike(query);

			updateTab(id, {
				title: query,
				query: navigating ? undefined : query,
				url: navigating
					? query.startsWith("http")
						? query
						: `https://${query}`
					: undefined,
				state: "loading",
			});

			if (!navigating) {
				try {
					const { data, status, error } = await getSearchResults({
						data: {
							query,
						},
					});

					if (!status.success) {
						updateTab(id, {
							state: "error",
						});
						return;
					}

					updateTab(id, {
						state: "results",
						searchResponse: {
							answer: data?.answer,
							images: data?.images,
							results: data?.results,
						},
					});

					console.log("Search Responses:", data);
				} catch (error) {
					console.error("Error: ", error);
				}
			} else {
				updateTab(id, {
					state: "surfing",
				});
			}
		},

		[currentTabId, updateTab],
	);

	const handleNavigate = useCallback(
		(site: PinnedSite) => {
			const id = currentTabId;
			updateTab(id, {
				title: site.name,
				url: site.url,
				query: undefined,
				state: "loading",
			});
			setTimeout(() => updateTab(id, { state: "surfing" }), 800);
		},
		[currentTabId, updateTab],
	);

	const resetTab = useCallback(() => {
		updateTab(currentTabId, {
			title: "New Tab",
			state: "search",
			url: undefined,
			query: undefined,
		});
	}, [currentTabId, updateTab]);

	return (
		<div className="relative flex h-full w-full flex-col overflow-hidden text-background">
			<TabBar
				tabs={tabs}
				currentTabId={currentTabId}
				onSelect={setCurrentTabId}
				onClose={closeTab}
				onAdd={addTab}
			/>

			<div className="relative m-2 flex flex-1 flex-col overflow-hidden rounded-2xl">
				{currentTab.state === "search" ? (
					<NewTabView
						key={currentTab.id}
						onSearch={handleSearch}
						onNavigate={handleNavigate}
					/>
				) : currentTab.state === "results" ? (
					<ResultsView
						key={currentTab.id}
						tab={currentTab}
						addAndUpdateTab={addAndUpdateTab}
						updateTab={updateTab}
					/>
				) : currentTab.state === "surfing" ? (
					<SurfingView key={currentTab.id} tab={currentTab} />
				) : (
					<PlaceholderView
						key={currentTab.id}
						state={currentTab.state}
						tab={currentTab}
						onReset={resetTab}
					/>
				)}
			</div>
		</div>
	);
}

export default Frowser;
