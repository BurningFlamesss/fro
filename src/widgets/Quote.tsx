import { useEffect, useState } from "react";
import { getQuotes } from "#/server/widgetFunctions";

export function Quote() {
	const [quote, setQuote] = useState<string>("");
	const [author, setAuthor] = useState<string>("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchQuote = async () => {
			setLoading(true);

			try {
				const { content, author, success } = await getQuotes();

				if (success && content) {
					setQuote(content);

					if (author) setAuthor(author);
				}
			} catch (err) {
			} finally {
				setLoading(false);
			}
		};

		fetchQuote();
	}, []);

	return (
		<div className="min-h-full w-full px-4 py-2 bg-white text-black">
			{loading && !quote ? (
				<p className="text-sm italic opacity-70">Loading…</p>
			) : (
				<>
					<p>{quote}</p>
					{author && <p className="text-xs mt-1 opacity-60">- {author}</p>}
				</>
			)}
		</div>
	);
}
