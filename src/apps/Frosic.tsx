import { useCallback, useEffect, useRef, useState } from "react";
import {
	FaBackwardFast,
	FaForwardFast,
	FaList,
	FaPause,
	FaPlay,
	FaPlus,
	FaRepeat,
	FaUpload,
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

function extractYouTubeId(url: string): string | null {
	const patterns = [
		/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
		/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
		/(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
	];
	for (const pattern of patterns) {
		const match = url.match(pattern);
		if (match) return match[1];
	}
	return null;
}

function formatTime(totalSeconds: number): string {
	if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = Math.floor(totalSeconds % 60);
	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function Frosic() {
	const musicStore = useMusicStore();
	const [coverImageSource, setCoverImageSource] = useState("");
	const isSeeking = useRef(false);
	const progressBarRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const track = musicStore.tracks[musicStore.currentIndex];

	useEffect(() => {
		if (track) {
			setCoverImageSource(track.cover);
		} else {
			setCoverImageSource("/apps/Music.svg");
		}
	}, [track?.cover, track?.id]);

	// Additional safety: if this window was the last one, stop music on unmount
	useEffect(() => {
		return () => {
			const { windows } = useWindowStore.getState();
			const openMusicWindows = Object.values(windows).filter(
				(windowInstance) => windowInstance?.appId === "music",
			);
			if (openMusicWindows.length === 0) {
				useMusicStore.getState().deactivate();
			}
		};
	}, []);

	const handleFileDrop = useCallback(
		(acceptedFiles: File[]) => {
			for (const file of acceptedFiles) {
				if (file.type.startsWith("audio/")) {
					const objectUrl = URL.createObjectURL(file);
					musicStore.addTrack({
						title: file.name.replace(/\.[^/.]+$/, ""),
						artist: "Local File",
						cover: "/music/cover/default.jpg",
						src: objectUrl,
						type: "file",
					});
				}
			}
		},
		[musicStore],
	);

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			handleFileDrop(Array.from(event.target.files));
			event.target.value = "";
		}
	};

	const handleAddUrl = () => {
		const url = prompt("Enter audio URL or YouTube link:");
		if (!url) return;
		const youtubeId = extractYouTubeId(url);
		if (youtubeId) {
			musicStore.addTrack({
				title: url,
				artist: "YouTube",
				cover: `https://img.youtube.com/vi/${youtubeId}/default.jpg`,
				src: "",
				type: "youtube",
				youtubeId,
			});
		} else {
			musicStore.addTrack({
				title: url,
				artist: "Online Stream",
				cover: "/music/cover/default.jpg",
				src: url,
				type: "url",
			});
		}
	};

	const seekToClientX = (clientX: number) => {
		if (!progressBarRef.current || !track) return;
		const totalDuration = musicStore.duration;
		if (!totalDuration) return;
		const rectangle = progressBarRef.current.getBoundingClientRect();
		const relativeX = Math.min(
			Math.max(clientX - rectangle.left, 0),
			rectangle.width,
		);
		const ratio = relativeX / rectangle.width;
		musicStore.seek(ratio * totalDuration);
	};

	const handlePointerDown = (event: React.PointerEvent) => {
		event.preventDefault();
		(event.target as HTMLElement).setPointerCapture(event.pointerId);
		isSeeking.current = true;
		seekToClientX(event.clientX);
	};

	const handlePointerMove = (event: React.PointerEvent) => {
		if (isSeeking.current) {
			seekToClientX(event.clientX);
		}
	};

	const handlePointerUp = () => {
		isSeeking.current = false;
	};

	if (!track) {
		return (
			<main className="flex h-full w-full flex-col items-center justify-center bg-foreground text-background">
				<p className="text-sm opacity-60">No tracks yet</p>
				<p className="text-xs mt-1 opacity-40">
					Drop audio files, paste a URL, or add a YouTube link
				</p>
				<div className="flex gap-2 mt-3">
					<button
						onClick={handleAddUrl}
						className="px-3 py-1 bg-background/10 rounded cursor-pointer text-xs"
					>
						Add Link
					</button>
					<button
						onClick={() => fileInputRef.current?.click()}
						className="px-3 py-1 bg-background/10 rounded cursor-pointer text-xs"
					>
						Upload File
					</button>
					<input
						type="file"
						ref={fileInputRef}
						className="hidden"
						accept="audio/*"
						multiple
						onChange={handleFileSelect}
					/>
				</div>
			</main>
		);
	}

	return (
		<main className="flex h-full w-full flex-col overflow-hidden bg-foreground text-background">
			<div
				onDrop={(event) => {
					event.preventDefault();
					const files = Array.from(event.dataTransfer.files);
					handleFileDrop(files);
				}}
				onDragOver={(event) => event.preventDefault()}
				className="relative flex-1 min-h-0 flex items-center justify-center p-2"
			>
				<div className="w-full h-full max-w-48 max-h-full aspect-square rounded-2xl overflow-hidden border border-background/10 bg-black/30">
					<img
						src={coverImageSource}
						alt={track.title}
						className="h-full w-full object-cover"
						onError={() => {
							setCoverImageSource("/music/cover/default.jpg");
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
					ref={progressBarRef}
					className="relative h-2 w-full cursor-pointer rounded-full bg-background/10 group touch-none"
					onPointerDown={handlePointerDown}
					onPointerMove={handlePointerMove}
					onPointerUp={handlePointerUp}
					onPointerCancel={handlePointerUp}
				>
					<div
						className="absolute left-0 top-0 h-full rounded-full bg-background/70"
						style={{
							width: musicStore.duration
								? `${(musicStore.currentTime / musicStore.duration) * 100}%`
								: "0%",
						}}
					/>
					<div
						className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-background rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
						style={{
							left: musicStore.duration
								? `calc(${(musicStore.currentTime / musicStore.duration) * 100}% - 6px)`
								: "0%",
						}}
					/>
				</div>
				<div className="mt-0.5 flex justify-between text-xs text-background/50">
					<span>{formatTime(musicStore.currentTime)}</span>
					<span>
						{musicStore.duration ? formatTime(musicStore.duration) : "--:--"}
					</span>
				</div>
			</div>

			<div className="flex items-center justify-between px-3 pb-2">
				<div className="flex items-center gap-1">
					<button
						onClick={() => musicStore.setMuted(!musicStore.muted)}
						className="cursor-pointer text-background/60 hover:text-background"
					>
						{musicStore.muted || musicStore.volume === 0 ? (
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
						value={musicStore.muted ? 0 : musicStore.volume}
						onChange={(event) =>
							musicStore.setVolume(parseFloat(event.target.value))
						}
						className="w-12 h-1 accent-background/60 cursor-pointer"
					/>
				</div>

				<div className="flex items-center gap-2">
					<button
						onClick={() => musicStore.previous()}
						className="cursor-pointer text-background/60 hover:text-background"
					>
						<FaBackwardFast size={16} />
					</button>
					<button
						onClick={() => musicStore.togglePlay()}
						className="cursor-pointer rounded-full p-1 bg-background/10 hover:bg-background/20"
					>
						{musicStore.isPlaying ? (
							<FaPause size={16} />
						) : (
							<FaPlay size={16} />
						)}
					</button>
					<button
						onClick={() => musicStore.next()}
						className="cursor-pointer text-background/60 hover:text-background"
					>
						<FaForwardFast size={16} />
					</button>
				</div>

				<div className="flex items-center gap-1.5">
					<button
						onClick={() => musicStore.setRepeat(!musicStore.repeat)}
						className={cn(
							"cursor-pointer hover:text-background",
							musicStore.repeat ? "text-background" : "text-background/40",
						)}
					>
						<FaRepeat size={14} />
					</button>

					<Popover>
						<PopoverTrigger asChild>
							<button className="cursor-pointer text-background/40 hover:text-background">
								<FaList size={14} />
							</button>
						</PopoverTrigger>
						<PopoverContent
							align="center"
							className="w-48 p-2 bg-foreground border border-background/10 text-background text-xs"
						>
							<div className="max-h-32 overflow-y-auto">
								{musicStore.tracks.map((singleTrack, index) => (
									<button
										key={singleTrack.id}
										onClick={() => {
											musicStore.loadTrack(index);
											musicStore.setPlaying(true);
										}}
										className={cn(
											"w-full text-left truncate px-2 py-1.5 rounded cursor-pointer",
											index === musicStore.currentIndex
												? "bg-background/10 text-background"
												: "text-background/60 hover:bg-background/5",
										)}
									>
										{singleTrack.title} - {singleTrack.artist}
									</button>
								))}
							</div>
						</PopoverContent>
					</Popover>

					<button
						onClick={handleAddUrl}
						className="cursor-pointer text-background/40 hover:text-background"
						title="Add URL or YouTube link"
					>
						<FaPlus size={14} />
					</button>
					<button
						onClick={() => fileInputRef.current?.click()}
						className="cursor-pointer text-background/40 hover:text-background"
						title="Upload audio files"
					>
						<FaUpload size={14} />
					</button>
					<input
						type="file"
						ref={fileInputRef}
						className="hidden"
						accept="audio/*"
						multiple
						onChange={handleFileSelect}
					/>
				</div>
			</div>
		</main>
	);
}

export default Frosic;
