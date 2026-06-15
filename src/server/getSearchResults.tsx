import { createServerFn } from "@tanstack/react-start";
import { tavily } from "@tavily/core";

export const getSearchResults = createServerFn({ method: "POST" })
	.validator((data: { query: string }) => data)
	.handler(async ({ data }) => {
		try {
			const apiKey = process.env.WEB_SEARCH_API_KEY;

			if (!apiKey) {
				throw new Error("WEB_SEARCH_API_KEY missing");
			}

			const client = tavily({
				apiKey,
			});

			const response = await client.search(data.query, {
				searchDepth: "ultra-fast",
                includeAnswer: "basic",
                includeImages: true
			});

			if (!response) {
				throw new Error(`Search API returned: ${response}`);
			}

			return {
				data: {
                    answer: response.answer,
                    results: response.results,
                    images: response.images
                },
				status: {
					success: true,
					code: 200,
				},
				error: null,
			};
		} catch (error) {
			console.error("Error: ", error);
			return {
				data: null,
				status: {
					success: false,
					code: 500,
				},
				error: String(error),
			};
		}
	});
