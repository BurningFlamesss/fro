import type { AppId } from "../constants";

export const FILE_ASSOCIATIONS: Record<
	AppId,
	{ file_image: string; extension: Array<string> }
> = {
	browser: {
		file_image: "frowse",
		extension: ["frowse"],
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
		extension: ["md", "txt", "frote", "task", "todo"],
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
		extension: ["script", "fromine", "brainfrok"],
	},
	app_not_found: {
		file_image: "default",
		extension: [],
	},

	// Miscellaneous Apps that is launched in launcher

	app_view: {
		file_image: "froview",
		extension: ["png", "jpg", "jpeg", "svg"],
	},
	app_web_view: {
		file_image: "frowebview",
		extension: ["ftml", "ftm", "htm", "html"],
	}
};

export const DEFAULT_APP_FOR_UNKNOWN_TYPE: AppId = "app_not_found";
