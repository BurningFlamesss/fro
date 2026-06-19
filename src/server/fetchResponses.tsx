import { createServerFn } from "@tanstack/react-start";
import { formatBytes, normalizeUrl } from "#/lib/utils.ts";

export const fetchResponse = createServerFn()
	.validator((params: Array<string>) => params)
	.handler(async ({ data }) => {
		return await Promise.all(
			data.map(async (url) => {
				const start = performance.now();

				const normalizedUrl = normalizeUrl(url);
				const response = await fetch(normalizedUrl);

				const duration = performance.now() - start;

				const contentType = response.headers.get("content-type") ?? "unknown";

				const text = await response.clone().text();

				const size = new Blob([text]).size;

				return {
					url,
					status: response.status,
					type: contentType,
					size: formatBytes(size),
					time: `${duration.toFixed(2)} ms`,
					data: text,
				};
			}),
		);
	});

export const pingUrl = createServerFn()
	.validator((url: string) => url)
	.handler(async ({ data }) => {
		const start = performance.now();

		const response = await fetch(data, {
			method: "GET",
		});

		const duration = performance.now() - start;

		return {
			status: response.status,
			statusText: response.statusText,
			time: duration,
		};
	});
