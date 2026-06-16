import { createServerFn } from "@tanstack/react-start";

export const checkEmbeddable = createServerFn()
.validator((data: { url: string }) => data)
.handler(async ({ data }) => {
	try {
		const response = await fetch(data.url, {
			method: "HEAD",
		});

		const xFrame = response.headers.get("x-frame-options");
		const csp = response.headers.get("content-security-policy");

		if (xFrame) {
			const value = xFrame.toUpperCase();

			if (value.includes("DENY") || value.includes("SAMEORIGIN")) {
				return false;
			}
		}

		if (csp) {
			const lower = csp.toLowerCase();

			if (
				lower.includes("frame-ancestors 'none'") ||
				lower.includes("frame-ancestors 'self'")
			) {
				return false;
			}
		}

		return true;
	} catch (error) {
        console.log("[EMBED CHECK] Error: ", error)
		return false;
	}
})
