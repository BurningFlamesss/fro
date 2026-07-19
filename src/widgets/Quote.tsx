import { useEffect, useState } from "react";
import { getQuotes } from "#/server/widgetFunctions";

export const DEFAULT_QUOTES = [
	{
		text: "It won't happen overnight. But if you quit, it won't happen at all.",
		author: "Unknown",
	},
	{
		text: "The only way to do great work is to love what you do.",
		author: "Steve Jobs",
	},
	{
		text: "In the middle of every difficulty lies opportunity.",
		author: "Albert Einstein",
	},
	{
		text: "Believe you can and you're halfway there.",
		author: "Theodore Roosevelt",
	},
	{
		text: "It does not matter how slowly you go as long as you do not stop.",
		author: "Confucius",
	},
	{
		text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
		author: "Winston Churchill",
	},
	{
		text: "What you get by achieving your goals is not as important as what you become by achieving your goals.",
		author: "Zig Ziglar",
	},
	{
		text: "The future belongs to those who believe in the beauty of their dreams.",
		author: "Eleanor Roosevelt",
	},
	{
		text: "Act as if what you do makes a difference. It does.",
		author: "William James",
	},
	{
		text: "You are never too old to set another goal or to dream a new dream.",
		author: "C.S. Lewis",
	},
];

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
				const randomQuote = DEFAULT_QUOTES[Math.floor(Math.random() * DEFAULT_QUOTES.length)]
				
				setQuote(randomQuote.text);
				setAuthor(randomQuote.author);
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
