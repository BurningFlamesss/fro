import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface Track {
	id: string;
	title: string;
	artist: string;
	cover: string;
	src: string;
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

	init: (tracks: Track[]) => void;
	loadTrack: (index: number) => void;
	togglePlay: () => void;
	setPlaying: (value: boolean) => void;
	next: () => void;
	previous: () => void;
	seek: (time: number) => void;
	setVolume: (vol: number) => void;
	setMuted: (muted: boolean) => void;
	setRepeat: (repeat: boolean) => void;

	activate: () => void;
	deactivate: () => void;
	reset: () => void;
}

const audio = new Audio();
let isActivated = false;
let initialized = false;

const getInitialState = () => ({
	tracks: [] as Track[],
	currentIndex: 0,
	isPlaying: false,
	volume: 1,
	muted: false,
	repeat: false,
	currentTime: 0,
	duration: 0,
});

export const useMusicStore = create<MusicState>()(
	immer((set, get) => ({
		...getInitialState(),

		init: (tracks) => {
			if (initialized) return;
			initialized = true;
			set((state) => {
				state.tracks = tracks;
			});
			if (tracks.length > 0) {
				get().loadTrack(0);
			}
		},

		loadTrack: (index) => {
			const { tracks } = get();
			const track = tracks[index];
			if (!track) return;
			audio.src = track.src;
			audio.load();
			set((state) => {
				state.currentIndex = index;
				state.currentTime = 0;
				state.duration = 0;
			});
		},

		togglePlay: () => {
			const { isPlaying } = get();
			if (isPlaying) {
				audio.pause();
			} else {
				audio.play().catch(() => {});
			}
			set((state) => {
				state.isPlaying = !isPlaying;
			});
		},

		setPlaying: (value) => {
			if (value) {
				audio.play().catch(() => {});
			} else {
				audio.pause();
			}
			set((state) => {
				state.isPlaying = value;
			});
		},

		next: () => {
			const { tracks, currentIndex } = get();
			if (tracks.length === 0) return;
			const nextIndex = (currentIndex + 1) % tracks.length;
			get().loadTrack(nextIndex);
			setTimeout(() => {
				if (get().isPlaying) audio.play().catch(() => {});
			}, 0);
		},

		previous: () => {
			const { tracks, currentIndex } = get();
			if (tracks.length === 0) return;
			const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
			get().loadTrack(prevIndex);
			setTimeout(() => {
				if (get().isPlaying) audio.play().catch(() => {});
			}, 0);
		},

		seek: (time) => {
			audio.currentTime = time;
			set((state) => {
				state.currentTime = time;
			});
		},

		setVolume: (vol) => {
			audio.volume = vol;
			set((state) => {
				state.volume = vol;
				state.muted = false;
			});
		},

		setMuted: (muted) => {
			audio.volume = muted ? 0 : get().volume;
			set((state) => {
				state.muted = muted;
			});
		},

		setRepeat: (repeat) =>
			set((state) => {
				state.repeat = repeat;
			}),

		activate: () => {
			if (isActivated) return;
			isActivated = true;

			const onTimeUpdate = () =>
				set((state) => {
					state.currentTime = audio.currentTime;
				});
			const onEnded = () => {
				if (get().repeat) {
					audio.currentTime = 0;
					audio.play();
				} else {
					get().next();
				}
			};
			const onLoadedMetadata = () =>
				set((state) => {
					state.duration = audio.duration;
				});

			audio.addEventListener("timeupdate", onTimeUpdate);
			audio.addEventListener("ended", onEnded);
			audio.addEventListener("loadedmetadata", onLoadedMetadata);

			if (!audio.paused) {
				set((state) => {
					state.isPlaying = true;
				});
			}
		},

		deactivate: () => {
			if (!isActivated) return;

			audio.pause();
			audio.src = "";
			audio.removeEventListener("timeupdate", () => {});
			audio.removeEventListener("ended", () => {});
			audio.removeEventListener("loadedmetadata", () => {});

			get().reset();
			isActivated = false;
			initialized = false;
		},

		reset: () =>
			set((state) => {
				Object.assign(state, getInitialState());
			}),
	})),
);
