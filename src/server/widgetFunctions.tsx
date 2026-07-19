import { createServerFn } from "@tanstack/react-start";

export const getQuotes = createServerFn({ method: "POST" }).handler(
	async () => {
		try {
			const response = await fetch(
				`https://zenquotes.io/api/random`,
			);
            
			if (!response.ok) {
                return {
                    success: false,
					content: null,
					author: null,
				};
			}
            
			const data = await response.json();            

			return {
				success: true,
				content: data[0].q,
				author: data[0].a,
			};
		} catch (error) {
			return {
				success: false,
				content: null,
				author: null,
			};
		}
	},
);
