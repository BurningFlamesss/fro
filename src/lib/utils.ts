import * as chrono from "chrono-node";
import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { format, isSameDay, isSameYear, isToday, isTomorrow } from "date-fns";
import ms from "ms";
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

export const DEFAULT_DURATION = 30 * 60 * 1000;

export function parseDate(input?: string): Date | null {
	if (!input) return null;

	const date = chrono.parseDate(input, new Date());

	return date ?? null;
}

export function parseDuration(input?: string): number {
	if (!input) return DEFAULT_DURATION;

	try {
		const duration = ms(input as ms.StringValue);

		return typeof duration === "number" ? duration : DEFAULT_DURATION;
	} catch {
		return DEFAULT_DURATION;
	}
}

export function splitEvent(
	title: string,
	start: Date,
	end: Date,
	color: string,
) {
	const events = [];

	let current = new Date(start);

	while (current < end) {
		const dayEnd = new Date(current);
		dayEnd.setHours(23, 59, 59, 999);

		const eventEnd = dayEnd < end ? dayEnd : end;

		events.push({
			id: crypto.randomUUID(),
			title,
			start: current.toISOString(),
			end: eventEnd.toISOString(),
			color,
		});

		if (eventEnd.getTime() === end.getTime()) {
			break;
		}

		current = new Date(eventEnd);
		current.setDate(current.getDate() + 1);
		current.setHours(0, 0, 0, 0);
	}

	return events;
}

const FLAG_ALIASES = {
	start: ["--start@", "-start@", "--start", "-start", "@"],
	end: ["--end@", "-end@", "--end", "-end"],
	dur: ["--dur@", "-dur@", "--dur", "-dur", "+"],
} as const;

export function matchFlag(param: string) {
	for (const [flag, aliases] of Object.entries(FLAG_ALIASES)) {
		for (const alias of [...aliases].sort((a, b) => b.length - a.length)) {
			if (param.startsWith(alias)) {
				return {
					flag: flag as "start" | "end" | "dur",
					value: param.slice(alias.length).trim(),
				};
			}
		}
	}

	return null;
}

export function formatEventRange(
	start: Date | string,
	end: Date | string,
): string {
	const s = new Date(start);
	const e = new Date(end);

	const time = (date: Date) => format(date, "h:mm a");

	if (isToday(s) && isSameDay(s, e)) {
		return `Today at ${time(s)} to ${time(e)}`;
	}

	if (isTomorrow(s) && isSameDay(s, e)) {
		return `Tomorrow at ${time(s)} to ${time(e)}`;
	}

	if (isSameDay(s, e)) {
		if (isSameYear(s, new Date())) {
			return `${format(s, "EEE, MMM d")} at ${time(s)} to ${time(e)}`;
		}

		return `${format(s, "EEE, MMM d, yyyy")} at ${time(s)} to ${time(e)}`;
	}

	if (isSameYear(s, e) && isSameYear(s, new Date())) {
		return `${format(s, "EEE, MMM d, h:mm a")} to ${format(
			e,
			"EEE, MMM d, h:mm a",
		)}`;
	}

	return `${format(s, "EEE, MMM d, yyyy, h:mm a")} to ${format(
		e,
		"EEE, MMM d, yyyy, h:mm a",
	)}`;
}
