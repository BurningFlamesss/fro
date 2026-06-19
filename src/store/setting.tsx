import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface SettingStore {
	backgroundImage: Record<"url" | "position", string>;
	setBackgroundImage: (imageUrl: string, position: string) => void;
}

export const useSettingStore = create<SettingStore>()(
	immer((set) => ({
		backgroundImage: {
			url: window
				? (localStorage?.getItem("backgroundImage:url") ??
					"/backgrounds/forest.gif")
				: "/backgrounds/forest.gif",
			position: window
				? (localStorage?.getItem("backgroundImage:position") ?? "center")
				: "center",
		},

		setBackgroundImage: (imageUrl, position) =>
			set((state) => {
				state.backgroundImage.url = imageUrl;
				state.backgroundImage.position = position;
				localStorage?.setItem("backgroundImage:url", imageUrl);
				localStorage?.setItem("backgroundImage:position", position);
			}),
	})),
);
