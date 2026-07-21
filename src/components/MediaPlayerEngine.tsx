import { useEffect, useRef } from "react";
import YouTube from "react-youtube";
import { useMusicStore } from "#/store/music";
import { useWindowStore } from "#/store/window";

function MediaPlayerEngine() {
	const musicStore = useMusicStore();
	const audioElementRef = useRef<HTMLAudioElement>(null);
	const youTubePlayerRef = useRef<YouTube>(null);
	const timeUpdateIntervalRef = useRef<NodeJS.Timeout>();

	const track = musicStore.tracks[musicStore.currentIndex];
	const isYouTubeTrack = track?.type === "youtube";
	const youTubeVideoId = track?.youtubeId;

	// Pass the real audio element to the store
	useEffect(() => {
		if (audioElementRef.current) {
			musicStore.setAudioElement(audioElementRef.current);
		}
		return () => musicStore.setAudioElement(null);
	}, [musicStore]);

	// Stop playback when no Frosic window remains open
	useEffect(() => {
		const checkForWindows = () => {
			const { windows } = useWindowStore.getState();
			const openMusicWindows = Object.values(windows).filter(
				(window) => window?.appId === "music",
			);
			if (openMusicWindows.length === 0) {
				musicStore.deactivate();
			}
		};

		checkForWindows();
		const unsubscribe = useWindowStore.subscribe(
			(state) => state.windows,
			checkForWindows,
			{ equalityFn: shallow },
		);
		return () => unsubscribe();
	}, [musicStore]);

	// Attach audio element event listeners for time / ended
	useEffect(() => {
		const audio = audioElementRef.current;
		if (!audio || isYouTubeTrack) return;

		const onTimeUpdate = () => {
			useMusicStore.setState((state) => {
				state.currentTime = audio.currentTime;
			});
		};
		const onEnded = () => {
			if (musicStore.repeat) {
				audio.currentTime = 0;
				audio.play().catch(() => {});
			} else {
				musicStore.next();
			}
		};
		const onLoadedMetadata = () => {
			useMusicStore.setState((state) => {
				state.duration = audio.duration;
			});
		};

		audio.addEventListener("timeupdate", onTimeUpdate);
		audio.addEventListener("ended", onEnded);
		audio.addEventListener("loadedmetadata", onLoadedMetadata);
		return () => {
			audio.removeEventListener("timeupdate", onTimeUpdate);
			audio.removeEventListener("ended", onEnded);
			audio.removeEventListener("loadedmetadata", onLoadedMetadata);
		};
	}, [isYouTubeTrack, musicStore.repeat, musicStore.next]);

	// Keep audio element in sync with play/pause state
	useEffect(() => {
		const audio = audioElementRef.current;
		if (!audio || isYouTubeTrack) return;
		if (musicStore.isPlaying) {
			audio.play().catch(() => {});
		} else {
			audio.pause();
		}
	}, [musicStore.isPlaying, isYouTubeTrack]);

	// YouTube time tracking
	useEffect(() => {
		if (!isYouTubeTrack || !youTubePlayerRef.current?.internalPlayer) return;
		timeUpdateIntervalRef.current = setInterval(async () => {
			if (!youTubePlayerRef.current?.internalPlayer) return;
			try {
				const currentTime =
					await youTubePlayerRef.current.internalPlayer.getCurrentTime();
				const duration =
					await youTubePlayerRef.current.internalPlayer.getDuration();
				if (musicStore.isPlaying) {
					useMusicStore.setState((state) => {
						state.currentTime = currentTime;
						state.duration = duration;
					});
				}
			} catch {
				// ignored
			}
		}, 1000);
		return () => clearInterval(timeUpdateIntervalRef.current);
	}, [isYouTubeTrack, musicStore.isPlaying, track?.id]);

	// Volume sync for both players
	useEffect(() => {
		if (isYouTubeTrack && youTubePlayerRef.current?.internalPlayer) {
			youTubePlayerRef.current.internalPlayer.setVolume(
				musicStore.muted ? 0 : musicStore.volume * 100,
			);
		} else if (audioElementRef.current) {
			audioElementRef.current.volume = musicStore.muted ? 0 : musicStore.volume;
		}
	}, [musicStore.volume, musicStore.muted, isYouTubeTrack]);

	return (
		<div
			style={{
				position: "absolute",
				width: 0,
				height: 0,
				overflow: "hidden",
				opacity: 0,
			}}
		>
			<audio ref={audioElementRef} />
			{isYouTubeTrack && youTubeVideoId && (
				<YouTube
					ref={youTubePlayerRef}
					videoId={youTubeVideoId}
					opts={{
						width: 1,
						height: 1,
						playerVars: {
							autoplay: musicStore.isPlaying ? 1 : 0,
							controls: 0,
							disablekb: 1,
							origin: window.location.origin,
							enablejsapi: 1,
						},
					}}
					onReady={(event) => {
						musicStore.setYouTubePlayerAPI({
							playVideo: () => event.target.playVideo(),
							pauseVideo: () => event.target.pauseVideo(),
							seekTo: (seconds, allowSeekAhead) =>
								event.target.seekTo(seconds, allowSeekAhead),
							getCurrentTime: () => event.target.getCurrentTime(),
							getDuration: () => event.target.getDuration(),
						});
						event.target.setVolume(
							musicStore.muted ? 0 : musicStore.volume * 100,
						);
						if (musicStore.isPlaying) event.target.playVideo();
					}}
					onEnd={() => {
						if (musicStore.repeat) {
							youTubePlayerRef.current?.internalPlayer?.seekTo(0);
							youTubePlayerRef.current?.internalPlayer?.playVideo();
						} else {
							musicStore.next();
						}
					}}
					onPlay={() => musicStore.setPlaying(true)}
					onPause={() => musicStore.setPlaying(false)}
				/>
			)}
		</div>
	);
}

function shallow<T>(objA: T, objB: T): boolean {
	if (Object.is(objA, objB)) return true;
	if (
		typeof objA !== "object" ||
		objA === null ||
		typeof objB !== "object" ||
		objB === null
	)
		return false;
	const keysA = Object.keys(objA);
	const keysB = Object.keys(objB);
	if (keysA.length !== keysB.length) return false;
	for (const key of keysA) {
		if (!Object.prototype.hasOwnProperty.call(objB, key)) return false;
		if (
			!Object.is(objA[key as keyof typeof objA], objB[key as keyof typeof objB])
		)
			return false;
	}
	return true;
}

export default MediaPlayerEngine;
