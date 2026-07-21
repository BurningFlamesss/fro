import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface Track {
	id: string;
	title: string;
	artist: string;
	cover: string;
	src: string;
	type: "file" | "url" | "youtube";
	youtubeId?: string;
	originalFileId?: string;
}

interface YouTubePlayerAPI {
	playVideo: () => void;
	pauseVideo: () => void;
	seekTo: (seconds: number, allowSeekAhead: boolean) => void;
	getCurrentTime: () => number;
	getDuration: () => number;
}

interface MusicState {
	tracks: Track[];
	currentIndex: number;
	isPlaying: boolean;
	volume: number;
	muted: boolean;
	repeat: boolean;
	currentTime: number;
	duration: number;
	youTubePlayerAPI: YouTubePlayerAPI | null;

	addTrack: (track: Omit<Track, "id">) => void;
	playTrackById: (trackId: string) => void;
	loadTrack: (index: number) => void;
	togglePlay: () => void;
	setPlaying: (playing: boolean) => void;
	next: () => void;
	previous: () => void;
	seek: (seconds: number) => void;
	setVolume: (volume: number) => void;
	setMuted: (muted: boolean) => void;
	setRepeat: (repeat: boolean) => void;
	setYouTubePlayerAPI: (api: YouTubePlayerAPI | null) => void;
	setAudioElement: (element: HTMLAudioElement | null) => void;

	activate: () => void;
	deactivate: () => void;
	reset: () => void;
}

let audioElement: HTMLAudioElement | null = null;

const initialMusicState = () => ({
	tracks: [] as Track[],
	currentIndex: 0,
	isPlaying: false,
	volume: 1,
	muted: false,
	repeat: false,
	currentTime: 0,
	duration: 0,
	youTubePlayerAPI: null as YouTubePlayerAPI | null,
});

export const useMusicStore = create<MusicState>()(
	immer((set, get) => ({
		...initialMusicState(),

		setAudioElement: (element) => {
			audioElement = element;
		},

		addTrack: (track) =>
			set((state) => {
				const id = crypto.randomUUID();
				state.tracks.push({ ...track, id });
			}),
		playTrackById: (trackId) => {
			const index = get().tracks.findIndex((t) => t.id === trackId);
			if (index !== -1) get().loadTrack(index);
		},

		loadTrack: (index) => {
			const track = get().tracks[index];
			if (!track) return;

			if (track.type !== "youtube") {
				get().youTubePlayerAPI?.pauseVideo();
			}

			if (track.type === "youtube") {
				set((state) => {
					state.currentIndex = index;
					state.currentTime = 0;
					state.duration = 0;
				});
				return;
			}

			const audio = audioElement;
			if (audio) {
				audio.src = track?.src;
				audio.load();
			}
			set((state) => {
				state.currentIndex = index;
				state.currentTime = 0;
				state.duration = 0;
			});
		},

		togglePlay: () => {
			const state = get();
			const track = state.tracks[state.currentIndex];
			if (track?.type === "youtube" && state.youTubePlayerAPI) {
				state.isPlaying
					? state.youTubePlayerAPI.pauseVideo()
					: state.youTubePlayerAPI.playVideo();
			} else if (audioElement) {
				if (state.isPlaying) {
					audioElement.pause();
				} else {
					audioElement.play().catch(() => {});
				}
			}
			set((draft) => {
				draft.isPlaying = !draft.isPlaying;
			});
		},

		setPlaying: (playing) => {
			const state = get();
			const track = state.tracks[state.currentIndex];
			if (track?.type === "youtube" && state.youTubePlayerAPI) {
				playing
					? state.youTubePlayerAPI.playVideo()
					: state.youTubePlayerAPI.pauseVideo();
			} else if (audioElement) {
				playing ? audioElement.play().catch(() => {}) : audioElement.pause();
			}
			set((draft) => {
				draft.isPlaying = playing;
			});
		},

		next: () => {
			const { tracks, currentIndex } = get();
			if (tracks.length === 0) return;
			const nextIndex = (currentIndex + 1) % tracks.length;
			get().loadTrack(nextIndex);
			setTimeout(() => {
				if (get().isPlaying) get().togglePlay();
			}, 0);
		},

		previous: () => {
			const { tracks, currentIndex } = get();
			if (tracks.length === 0) return;
			const previousIndex = (currentIndex - 1 + tracks.length) % tracks.length;
			get().loadTrack(previousIndex);
			setTimeout(() => {
				if (get().isPlaying) get().togglePlay();
			}, 0);
		},

		seek: (seconds) => {
			const state = get();
			const track = state.tracks[state.currentIndex];
			if (track?.type === "youtube" && state.youTubePlayerAPI) {
				state.youTubePlayerAPI.seekTo(seconds, true);
			} else if (audioElement) {
				audioElement.currentTime = seconds;
			}
			set((draft) => {
				draft.currentTime = seconds;
			});
		},

		setVolume: (volume) => {
			if (audioElement) audioElement.volume = volume;
			set((draft) => {
				draft.volume = volume;
				draft.muted = false;
			});
		},

		setMuted: (muted) => {
			const state = get();
			if (audioElement) audioElement.volume = muted ? 0 : state.volume;
			set((draft) => {
				draft.muted = muted;
			});
		},

		setRepeat: (repeat) =>
			set((draft) => {
				draft.repeat = repeat;
			}),

		setYouTubePlayerAPI: (api) =>
			set((draft) => {
				draft.youTubePlayerAPI = api;
			}),

		activate: () => {
			// Engine manages its own listeners
		},

		deactivate: () => {
			if (audioElement) {
				audioElement.pause();
				audioElement.src = "";
			}
			get().youTubePlayerAPI?.pauseVideo();
			get().reset();
		},

		reset: () =>
			set((draft) => {
				Object.assign(draft, initialMusicState());
			}),
	})),
);
