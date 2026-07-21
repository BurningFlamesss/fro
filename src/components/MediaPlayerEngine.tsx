import { useEffect, useRef } from "react";
import YouTube from "react-youtube";
import { useMusicStore } from "#/store/music";
import { useWindowStore } from "#/store/window";

function MediaPlayerEngine() {
	const audioElementRef = useRef<HTMLAudioElement>(null);
	const youTubePlayerRef = useRef<YouTube>(null);
	const timeUpdateIntervalRef = useRef<NodeJS.Timeout>();
	const previousMusicWindowCountRef = useRef(0);

	const track = useMusicStore((state) => state.tracks[state.currentIndex]);
	const isYouTubeTrack = track?.type === "youtube";
	const youTubeVideoId = track?.youtubeId;
	const isPlaying = useMusicStore((state) => state.isPlaying);
	const volume = useMusicStore((state) => state.volume);
	const muted = useMusicStore((state) => state.muted);
	const repeat = useMusicStore((state) => state.repeat);
	const nextTrack = useMusicStore((state) => state.next);
	const setPlaying = useMusicStore((state) => state.setPlaying);
	const setYouTubePlayerAPI = useMusicStore(
		(state) => state.setYouTubePlayerAPI,
	);
	const setAudioElement = useMusicStore((state) => state.setAudioElement);
	const deactivateMusic = useMusicStore((state) => state.deactivate);

	useEffect(() => {
		if (audioElementRef.current) {
			setAudioElement(audioElementRef.current);
		}
		return () => setAudioElement(null);
	}, [setAudioElement]);

	useEffect(() => {
		const checkAndStopIfNoWindows = () => {
			const { windows } = useWindowStore.getState();
			const openMusicWindows = Object.values(windows).filter(
				(windowInstance) => windowInstance?.appId === "music",
			);
			const currentCount = openMusicWindows.length;

			if (currentCount === 0 && previousMusicWindowCountRef.current > 0) {
				deactivateMusic();
			}
			previousMusicWindowCountRef.current = currentCount;
		};

		checkAndStopIfNoWindows();
		const unsubscribe = useWindowStore.subscribe(
			(state) => state.windows,
			checkAndStopIfNoWindows,
		);
		return () => unsubscribe();
	}, [deactivateMusic]);

	useEffect(() => {
		const audio = audioElementRef.current;
		if (!audio || isYouTubeTrack) return;

		const onTimeUpdate = () => {
			useMusicStore.setState((state) => {
				state.currentTime = audio.currentTime;
			});
		};
		const onEnded = () => {
			if (repeat) {
				audio.currentTime = 0;
				audio.play().catch(() => {});
			} else {
				nextTrack();
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
	}, [isYouTubeTrack, repeat, nextTrack]);

	useEffect(() => {
		const audio = audioElementRef.current;
		if (!audio || isYouTubeTrack) return;
		if (isPlaying) {
			audio.play().catch(() => {});
		} else {
			audio.pause();
		}
	}, [isPlaying, isYouTubeTrack]);

	useEffect(() => {
		if (!isYouTubeTrack || !youTubePlayerRef.current?.internalPlayer) return;
		timeUpdateIntervalRef.current = setInterval(async () => {
			if (!youTubePlayerRef.current?.internalPlayer) return;
			try {
				const currentTime =
					await youTubePlayerRef.current.internalPlayer.getCurrentTime();
				const duration =
					await youTubePlayerRef.current.internalPlayer.getDuration();
				if (isPlaying) {
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
	}, [isYouTubeTrack, isPlaying, track?.id]);

	useEffect(() => {
		if (isYouTubeTrack && youTubePlayerRef.current?.internalPlayer) {
			youTubePlayerRef.current.internalPlayer.setVolume(
				muted ? 0 : volume * 100,
			);
		} else if (audioElementRef.current) {
			audioElementRef.current.volume = muted ? 0 : volume;
		}
	}, [volume, muted, isYouTubeTrack]);

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
							autoplay: isPlaying ? 1 : 0,
							controls: 0,
							disablekb: 1,
							origin: window.location.origin,
							enablejsapi: 1,
						},
					}}
					onReady={(event) => {
						setYouTubePlayerAPI({
							playVideo: () => event.target.playVideo(),
							pauseVideo: () => event.target.pauseVideo(),
							seekTo: (seconds, allowSeekAhead) =>
								event.target.seekTo(seconds, allowSeekAhead),
							getCurrentTime: () => event.target.getCurrentTime(),
							getDuration: () => event.target.getDuration(),
						});
						event.target.setVolume(muted ? 0 : volume * 100);
						if (isPlaying) event.target.playVideo();
					}}
					onEnd={() => {
						if (repeat) {
							youTubePlayerRef.current?.internalPlayer?.seekTo(0);
							youTubePlayerRef.current?.internalPlayer?.playVideo();
						} else {
							nextTrack();
						}
					}}
					onPlay={() => setPlaying(true)}
					onPause={() => setPlaying(false)}
				/>
			)}
		</div>
	);
}

export default MediaPlayerEngine;
