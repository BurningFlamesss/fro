import { formatEventRange, parseDate } from "#/lib/utils.ts";
import { useCalendarStore } from "#/store/calendar.tsx";

function Event() {
	const { events } = useCalendarStore();
	const now = new Date();
	const upcoming = events
		.filter((event) => parseDate(event.end) >= now)
		.sort(
			(a, b) =>
				(parseDate(a.start)?.getTime() ?? 0) -
				(parseDate(b.start)?.getTime() ?? 0),
		)
		.slice(0, 5);

	return upcoming.length > 0 ? (
		<ul className="p-4 min-h-full w-full bg-black/15 backdrop-blur-[20px] backdrop-saturate-150 border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.2)] text-white">
			{upcoming.map((tab, index) => (
				<li key={tab.id}>
					{index + 1}. {tab.title}
					<br />
					<span className="opacity-90 text-sm">
						{formatEventRange(tab.start, tab.end)}
					</span>
				</li>
			))}
		</ul>
	) : (
		<div className="bg-black/15 backdrop-blur-[20px] backdrop-saturate-150 border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.2)] text-white h-full w-full flex flex-row items-center justify-center">
			No Any Upcoming Events
		</div>
	);
}

export default Event;
