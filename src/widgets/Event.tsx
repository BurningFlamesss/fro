import { formatEventRange, parseDate } from "#/lib/utils.ts";
import { useCalendarStore } from "#/store/calendar.tsx";

function Event() {
	const { events } = useCalendarStore();
	const now = new Date();
	const upcoming = events
		.filter((event) => parseDate(event.start) >= now)
		.sort(
			(a, b) =>
				(parseDate(a.start)?.getTime() ?? 0) -
				(parseDate(b.start)?.getTime() ?? 0),
		)
		.slice(0, 5);

	return (
		<ul className="p-4 min-h-full w-full glassmorphism">
			{upcoming.length > 0 ? upcoming.map((tab, index) => (
				<li key={tab.id}>
					{index + 1}. {tab.title}
					<br />
					<span className="opacity-90 text-sm">
						{formatEventRange(tab.start, tab.end)}
					</span>
				</li>
			)) : <li className="h-full w-full flex flex-row items-center justify-center">No Any Upcoming Events</li>}
		</ul>
	);
}

export default Event;
