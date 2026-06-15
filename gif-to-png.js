// AI script

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import ffmpegPath from "ffmpeg-static";

const dir = "./public/backgrounds";
const previewDir = "./public/backgrounds/previews";

fs.mkdirSync(previewDir, { recursive: true });

const files = fs.readdirSync(dir);

for (const file of files) {
	if (!file.endsWith(".gif")) continue;

	const input = path.join(dir, file);
	const output = path.join(
		previewDir,
		file.replace(".gif", ".webp"),
	);

	console.log(`Converting: ${file}`);

	execSync(
		`"${ffmpegPath}" -i "${input}" -frames:v 1 "${output}"`,
		{ stdio: "inherit" },
	);
}