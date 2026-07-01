import type { AppId } from "../constants";

export const FILE_ASSOCIATIONS: Record<AppId, Array<string>> = {
	browser: ["html", "htm"],
	calculator: ["calc"],
	calendar: [],
	file_explorer: [],
	launcher: ["frocus", "fro"],
	music: ["mp3", "wav"],
	notes: ["md", "txt"],
	settings: [],
	store: [],
	terminal: [],
};

export const DEFAULT_APP_FOR_UNKNOWN_TYPE: AppId | null = null;
