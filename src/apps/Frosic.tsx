import { useEffect, useRef } from "react";
import {
	FaBackwardFast,
	FaForwardFast,
	FaList,
	FaPause,
	FaPlay,
	FaRepeat,
	FaVolumeHigh,
	FaVolumeXmark,
} from "react-icons/fa6";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/components/ui/popover";
import { cn } from "#/lib/utils";
import { useMusicStore } from "#/store/music";
import { useWindowStore } from "#/store/window";

const DEMO_TRACKS = [
	{
		id: "1",
		title: "Spring Flowers",
		artist: "Keys of Moon",
		cover: "/music/cover/Spring-Flowers.jpg",
		src: "/music/Spring-Flowers.mp3",
	},
	{
		id: "2",
		title: "Feel Good",
		artist: "MusicbyAden",
		cover: "/music/cover/Feel-Good.jpg",
		src: "/music/Feel-Good.mp3",
	},
	{
		id: "3",
		title: "A drift",
		artist: "Scott Buckley",
		cover: "/music/cover/adriftamonginfinitestars.jpg",
		src: "/music/adriftamonginfinitestars.mp3",
	},
];

function formatTime(seconds: number): string {
	if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

	const minute = Math.floor(seconds / 60);
	const second = Math.floor(seconds % 60);

	return `${minute}:${second.toString().padStart(2, "0")}`;
}

function Frosic({ windowId }: { windowId: string }) {
	const store = useMusicStore();
	const isSeeking = useRef(false);
	const progressRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		store.init(DEMO_TRACKS);
	}, []);

	useEffect(() => {
		store.activate();

		return () => {
			const { windows } = useWindowStore.getState();
			const musicWindows = Object.values(windows).filter(
				(win) => win?.appId === "music",
			);
			if (musicWindows.length === 0) {
				store.deactivate();
			}
		};
	}, [windowId]);

	const seekToClientX = (clientX: number) => {
		if (!progressRef.current || !store.duration) return;

		const rect = progressRef.current.getBoundingClientRect();
		const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
		const ratio = x / rect.width;
		store.seek(ratio * store.duration);
	};

	const handlePointerDown = (e: React.PointerEvent) => {
		e.preventDefault();
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
		isSeeking.current = true;
		seekToClientX(e.clientX);
	};

	const handlePointerMove = (e: React.PointerEvent) => {
		if (isSeeking.current) seekToClientX(e.clientX);
	};

	const handlePointerUp = () => {
		isSeeking.current = false;
	};

	const track = store.tracks[store.currentIndex] ?? DEMO_TRACKS[0];

	return (
		<main className="flex h-full w-full flex-col overflow-hidden bg-foreground text-background">
			<div className="relative flex-1 min-h-0 flex items-center justify-center p-2">
				<div className="w-full h-full max-w-48 max-h-full aspect-square rounded-2xl overflow-hidden border border-background/10">
					<img
						src={track.cover}
						alt={track.title}
						className="h-full w-full object-cover"
						onError={(e) => {
							(e.target as HTMLImageElement).src = "/music/cover/Spring-Flowers.jpg";
						}}
					/>
				</div>
			</div>

			<div className="px-3 pb-1 text-center">
				<h2 className="text-sm font-semibold truncate">{track.title}</h2>
				<p className="text-xs text-background/60 truncate">{track.artist}</p>
			</div>

			<div className="px-3 pb-1">
				<div
					ref={progressRef}
					className="relative h-2 w-full cursor-pointer rounded-full bg-background/10 group touch-none"
					onPointerDown={handlePointerDown}
					onPointerMove={handlePointerMove}
					onPointerUp={handlePointerUp}
					onPointerCancel={handlePointerUp}
				>
					<div
						className="absolute left-0 top-0 h-full rounded-full bg-background/70"
						style={{
							width: store.duration ? `${(store.currentTime / store.duration) * 100}%` : "0%",
						}}
					/>
					<div
						className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-background rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
						style={{
							left: store.duration ? `calc(${(store.currentTime / store.duration) * 100}% - 6px)`: "0%",
						}}
					/>
				</div>
				<div className="mt-0.5 flex justify-between text-xs text-background/50">
					<span>{formatTime(store.currentTime)}</span>
					<span>{store.duration ? formatTime(store.duration) : "--:--"}</span>
				</div>
			</div>

			<div className="flex items-center justify-between px-3 pb-2">
				<div className="flex items-center gap-1">
					<button
						type="button"
						onClick={() => store.setMuted(!store.muted)}
						className="cursor-pointer text-background/60 hover:text-background"
					>
						{store.muted || store.volume === 0 ? (
							<FaVolumeXmark size={14} />
						) : (
							<FaVolumeHigh size={14} />
						)}
					</button>
					<input
						type="range"
						min="0"
						max="1"
						step="0.05"
						value={store.muted ? 0 : store.volume}
						onChange={(e) => store.setVolume(parseFloat(e.target.value))}
						className="w-12 h-1 accent-background/60 cursor-pointer"
					/>
				</div>

				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => store.previous()}
						className="cursor-pointer text-background/60 hover:text-background"
					>
						<FaBackwardFast size={16} />
					</button>
					<button
						type="button"
						onClick={() => store.togglePlay()}
						className="cursor-pointer rounded-full p-1 bg-background/10 hover:bg-background/20"
					>
						{store.isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
					</button>
					<button
						type="button"
						onClick={() => store.next()}
						className="cursor-pointer text-background/60 hover:text-background"
					>
						<FaForwardFast size={16} />
					</button>
				</div>

				<div className="flex items-center gap-1.5">
					<button
						type="button"
						onClick={() => store.setRepeat(!store.repeat)}
						className={cn(
							"cursor-pointer hover:text-background",
							store.repeat ? "text-background" : "text-background/40",
						)}
					>
						<FaRepeat size={14} />
					</button>

					<Popover>
						<PopoverTrigger asChild>
							<button
								type="button"
								className="cursor-pointer text-background/40 hover:text-background"
							>
								<FaList size={14} />
							</button>
						</PopoverTrigger>
						<PopoverContent
							align="center"
							className="w-48 p-2 bg-foreground border border-background/10 text-background text-xs"
						>
							<div className="max-h-[10.5rem] overflow-y-auto">
								{store.tracks.map((track, idx) => (
									<button
										type="button"
										key={track.id}
										onClick={() => {
											store.loadTrack(idx);
											store.setPlaying(true);
										}}
										className={cn(
											"w-full text-left truncate px-2 py-1.5 rounded cursor-pointer",
											idx === store.currentIndex
												? "bg-background/10 text-background"
												: "text-background/60 hover:bg-background/5",
										)}
									>
										{track.title} - {track.artist}
									</button>
								))}
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</div>
		</main>
	);
}

export default Frosic;
