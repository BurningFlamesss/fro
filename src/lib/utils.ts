import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getDateTime() {
	const now = new Date();

	return {
		time: now.toLocaleTimeString("en-GB", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		}),
		date: now.toLocaleDateString("en-GB"),
	};
}

export function formatBytes(bytes: number) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
	return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function normalizeUrl(url: string) {
	if (!/^https?:\/\//i.test(url)) {
		return `https://${url}`;
	}

	return url;
}
