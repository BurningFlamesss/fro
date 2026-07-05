import type { AppId } from "../constants";

export const FILE_ASSOCIATIONS: Record<
	AppId,
	{ file_image: string; extension: Array<string> }
> = {
	browser: {
		file_image: "frowse",
		extension: ["html", "htm"],
	},
	calculator: {
		file_image: "froculate",
		extension: ["calc"],
	},
	calendar: {
		file_image: "frolend",
		extension: [],
	},
	file_explorer: {
		file_image: "froxplore",
		extension: [],
	},
	launcher: {
		file_image: "fronch",
		extension: ["frocus", "fro"],
	},
	music: {
		file_image: "frosic",
		extension: ["mp3", "wav", "frosic"],
	},
	notes: {
		file_image: "frote",
		extension: ["md", "txt", "frote"],
	},
	settings: {
		file_image: "frotting",
		extension: [],
	},
	store: {
		file_image: "frotore",
		extension: [],
	},
	terminal: {
		file_image: "fromine",
		extension: [],
	},
	not_found: {
		file_image: "default",
		extension: [],
	},
};

export const DEFAULT_APP_FOR_UNKNOWN_TYPE: AppId = "not_found";
