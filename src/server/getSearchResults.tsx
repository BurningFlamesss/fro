import { createServerFn } from "@tanstack/react-start";

export const getSearchResults = createServerFn({ method: "POST" })
	.validator((data: { query: string }) => data)
	.handler(async ({ data }) => {
		try {
			const apiKey = process.env.WEB_SEARCH_API_KEY;

			if (!apiKey) {
				throw new Error("WEB_SEARCH_API_KEY missing");
			}

            const searchQuery = encodeURIComponent(data.query)
            console.log("Search query: ", searchQuery)

			const response = await fetch(
				`https://search.hackclub.com/res/v1/web/search?q=${searchQuery}`,
				{
					headers: {
						Authorization: `Bearer ${apiKey}`,
                        'x-subscription-token': apiKey
					},
				},
			);

			if (!response.ok) {
				throw new Error(`Search API returned ${response.status}`);
			}

			const searchResults = await response.json();

			return {
				data: searchResults,
				status: {
					success: true,
					code: 200,
				},
				error: null,
			};
		} catch (error) {
            console.error("Error: ", error)
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
