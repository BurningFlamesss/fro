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

export const degree2radian = (degree: number) => (degree * Math.PI) / 180;

export const LAST_TOKEN_REGEX =
	/(sin\(|cos\(|tan\(|log\(|ln\(|sinh\(|cosh\(|tanh\(|factorial\(|pi|e|\^2|\^|[-+*/()]|\/100|\d+\.?\d*)$/; // From AI

export function removeLastToken(expression: string): string {
	const match = expression.match(LAST_TOKEN_REGEX);

	if (!match) {
		return expression.slice(0, -1); // When no match is found, the calculator will delete only one character which is the intended behavior as of my brain cells could think of
	}

	const token = match[0];

	return expression.slice(0, expression.length - token.length);
}

export function balanceParentheses(expression: string): string {
	let open = 0;

	for (const character of expression) {
		if (character === "(") {
			open++;
		} else if (character === ")") {
			open--;
		}
	}

	return expression + ")".repeat(Math.max(0, open));
}
