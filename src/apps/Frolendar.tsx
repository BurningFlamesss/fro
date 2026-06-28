// Full AI Implementation (I had iterate this file nearly 27 times using AI to get to this level)

import {
	addDays,
	addDays as addDaysFn,
	addMonths,
	addWeeks,
	endOfMonth,
	endOfWeek,
	format,
	isSameDay,
	isSameMonth,
	isToday,
	setHours,
	setMinutes,
	startOfMonth,
	startOfWeek,
	subMonths,
	subWeeks,
} from "date-fns";
import React, {
	memo,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useDrag, useDrop } from "react-dnd";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { cn } from "#/lib/utils";
import { type CalendarEvent, useCalendarStore } from "#/store/calendar";

export const EVENT_COLORS = [
	"#3B82F6",
	"#EF4444",
	"#10B981",
	"#F59E0B",
	"#8B5CF6",
	"#EC4899",
	"#06B6D4",
	"#84CC16",
];
const DRAG_TYPE = "CALENDAR_EVENT";
const DEFAULT_DURATION_MINUTES = 30;
const HOUR_HEIGHT = 48;

const toDate = (iso: string) => new Date(iso);

const Toolbar = memo(function Toolbar({
	view,
	onViewChange,
	date,
	onNavigate,
	onToday,
}: {
	view: "month" | "week" | "day";
	onViewChange: (value: "month" | "week" | "day") => void;
	date: Date;
	onNavigate: (date: Date) => void;
	onToday: () => void;
}) {
	const title = useMemo(() => {
		if (view === "month") return format(date, "MMMM yyyy");
		if (view === "week")
			return `Week of ${format(startOfWeek(date, { weekStartsOn: 1 }), "MMM d")}`;
		return format(date, "EEEE, MMM d, yyyy");
	}, [view, date]);

	const navigatePrevious = useCallback(() => {
		if (view === "month") onNavigate(subMonths(date, 1));
		else if (view === "week") onNavigate(subWeeks(date, 1));
		else onNavigate(addDaysFn(date, -1));
	}, [view, date, onNavigate]);

	const navigateNext = useCallback(() => {
		if (view === "month") onNavigate(addMonths(date, 1));
		else if (view === "week") onNavigate(addWeeks(date, 1));
		else onNavigate(addDaysFn(date, 1));
	}, [view, date, onNavigate]);

	return (
		<div className="flex items-center justify-between px-4 py-2 border-b border-white/5 glassmorphism rounded-t-xl select-none">
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={navigatePrevious}
					className="px-2 py-1 text-sm rounded-full bg-white/5 hover:bg-white/10 transition cursor-pointer"
				>
					&larr;
				</button>
				<span className="text-sm font-medium">{title}</span>
				<button
					type="button"
					onClick={navigateNext}
					className="px-2 py-1 text-sm rounded-full bg-white/5 hover:bg-white/10 transition cursor-pointer"
				>
					&rarr;
				</button>
				<Button
					variant="ghost"
					size="sm"
					onClick={onToday}
					className="ml-2 text-xs cursor-pointer"
				>
					Navigate to Today
				</Button>
			</div>
			<div className="flex gap-1">
				{(["month", "week", "day"] as const).map((viewOption) => (
					<button
						type="button"
						key={viewOption}
						onClick={() => onViewChange(viewOption)}
						className={cn(
							"px-3 py-1 text-xs rounded-lg transition cursor-pointer",
							view === viewOption
								? "bg-blue-500/30 text-white"
								: "bg-white/5 hover:bg-white/10 text-white/70",
						)}
					>
						{viewOption.charAt(0).toUpperCase() + viewOption.slice(1)}
					</button>
				))}
			</div>
		</div>
	);
});

const NewEventDialog = memo(function NewEventDialog({
	open,
	onClose,
	onSave,
	defaultStart,
	defaultEnd,
}: {
	open: boolean;
	onClose: () => void;
	onSave: (event: Omit<CalendarEvent, "id">) => void;
	defaultStart: Date;
	defaultEnd: Date;
}) {
	const [title, setTitle] = useState("");
	const [color, setColor] = useState(EVENT_COLORS[0]);
	const [startTime, setStartTime] = useState(
		format(defaultStart, "yyyy-MM-dd'T'HH:mm"),
	);
	const [endTime, setEndTime] = useState(
		format(defaultEnd, "yyyy-MM-dd'T'HH:mm"),
	);

	useEffect(() => {
		setTitle("");
		setColor(EVENT_COLORS[0]);
		setStartTime(format(defaultStart, "yyyy-MM-dd'T'HH:mm"));
		setEndTime(format(defaultEnd, "yyyy-MM-dd'T'HH:mm"));
	}, [defaultStart, defaultEnd]);

	const handleSave = useCallback(() => {
		if (!title.trim()) return;
		onSave({
			title,
			start: new Date(startTime).toISOString(),
			end: new Date(endTime).toISOString(),
			color,
		});
		onClose();
	}, [title, color, startTime, endTime, onSave, onClose]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter") {
				e.preventDefault();
				handleSave();
			}
		},
		[handleSave],
	);

	return (
		<Dialog open={open} onOpenChange={(openChange) => !openChange && onClose()}>
			<DialogContent className="max-w-lg backdrop-blur-lg border border-white/10 text-white select-none">
				<DialogHeader>
					<DialogTitle>New Event</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<Input
						placeholder="Event title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						onKeyDown={handleKeyDown}
						className="bg-white/5 border-white/10 cursor-text select-text"
					/>
					<div className="flex flex-col gap-2">
						<div>
							<label className="text-xs text-white/60">Start</label>
							<Input
								type="datetime-local"
								value={startTime}
								onChange={(e) => setStartTime(e.target.value)}
								className="bg-white/5 border-white/10 cursor-text select-text"
							/>
						</div>
						<div>
							<label className="text-xs text-white/60">End</label>
							<Input
								type="datetime-local"
								value={endTime}
								onChange={(e) => setEndTime(e.target.value)}
								className="bg-white/5 border-white/10 cursor-text select-text"
							/>
						</div>
					</div>
					<div>
						<label className="text-xs text-white/60 mb-1 block">Color</label>
						<div className="flex gap-1.5">
							{EVENT_COLORS.map((colorOption) => (
								<button
									type="button"
									key={colorOption}
									onClick={() => setColor(colorOption)}
									className={cn(
										"w-8 h-8 rounded-full border-2 transition cursor-pointer",
										color === colorOption
											? "border-white scale-110"
											: "border-transparent",
									)}
									style={{ backgroundColor: colorOption }}
								/>
							))}
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button variant="ghost" onClick={onClose} className="cursor-pointer">
						Cancel
					</Button>
					<Button onClick={handleSave} className="cursor-pointer">
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
});

const EventEditPopover = memo(function EventEditPopover({
	eventId,
	onUpdate,
	onDelete,
	children,
	open,
	onOpenChange,
}: {
	eventId: string;
	onUpdate: (id: string, updates: Partial<Omit<CalendarEvent, "id">>) => void;
	onDelete: (id: string) => void;
	children: React.ReactNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const event =
		useCalendarStore((s) => s.events.find((e) => e.id === eventId)) ?? null;
	const [title, setTitle] = useState(event?.title ?? "");
	const [color, setColor] = useState(event?.color ?? EVENT_COLORS[0]);
	const [startTime, setStartTime] = useState(
		event ? format(toDate(event.start), "yyyy-MM-dd'T'HH:mm") : "",
	);
	const [endTime, setEndTime] = useState(
		event ? format(toDate(event.end), "yyyy-MM-dd'T'HH:mm") : "",
	);

	useEffect(() => {
		if (event) {
			setTitle(event.title);
			setColor(event.color);
			setStartTime(format(toDate(event.start), "yyyy-MM-dd'T'HH:mm"));
			setEndTime(format(toDate(event.end), "yyyy-MM-dd'T'HH:mm"));
		}
	}, [event]);

	const handleSave = useCallback(() => {
		if (!title.trim() || !eventId) return;
		onUpdate(eventId, {
			title,
			color,
			start: new Date(startTime).toISOString(),
			end: new Date(endTime).toISOString(),
		});
		onOpenChange(false);
	}, [title, color, startTime, endTime, eventId, onUpdate, onOpenChange]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter") {
				e.preventDefault();
				handleSave();
			}
		},
		[handleSave],
	);

	if (!event) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="w-72 p-4 backdrop-blur-lg border border-white/10 rounded-xl text-white select-none">
				<div className="space-y-3">
					<h4 className="text-sm font-medium">Edit Event</h4>
					<Input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						onKeyDown={handleKeyDown}
						className="bg-white/5 border-white/10 cursor-text select-text"
					/>
					<div className="flex flex-col gap-2">
						<div>
							<label className="text-xs text-white/60">Start</label>
							<Input
								type="datetime-local"
								value={startTime}
								onChange={(e) => setStartTime(e.target.value)}
								className="bg-white/5 border-white/10 cursor-text select-text"
							/>
						</div>
						<div>
							<label className="text-xs text-white/60">End</label>
							<Input
								type="datetime-local"
								value={endTime}
								onChange={(e) => setEndTime(e.target.value)}
								className="bg-white/5 border-white/10 cursor-text select-text"
							/>
						</div>
					</div>
					<div className="flex flex-wrap gap-1.5">
						{EVENT_COLORS.map((colorOption) => (
							<button
								type="button"
								key={colorOption}
								onClick={() => setColor(colorOption)}
								className={cn(
									"w-6 h-6 rounded-full border-2 transition cursor-pointer",
									color === colorOption
										? "border-white scale-110"
										: "border-transparent",
								)}
								style={{ backgroundColor: colorOption }}
							/>
						))}
					</div>
					<div className="flex justify-between gap-2 pt-2">
						<Button
							variant="destructive"
							size="sm"
							onClick={() => {
								onDelete(eventId);
								onOpenChange(false);
							}}
							className="cursor-pointer"
						>
							Delete
						</Button>
						<Button size="sm" onClick={handleSave} className="cursor-pointer">
							Save
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
});

const MonthEventChip = memo(function MonthEventChip({
	event,
	onClick,
}: {
	event: CalendarEvent;
	onClick: () => void;
}) {
	const eventRef = useRef(event);
	eventRef.current = event;

	const [{ isDragging }, drag] = useDrag(() => ({
		type: DRAG_TYPE,
		item: () => ({
			eventId: eventRef.current.id,
			start: eventRef.current.start,
			end: eventRef.current.end,
		}),
		collect: (monitor) => ({ isDragging: monitor.isDragging() }),
	}));

	return (
		<div
			ref={drag}
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
			className={cn(
				"rounded-md px-1.5 py-0.5 text-[10px] font-medium truncate border border-white/10 hover:opacity-80 transition cursor-pointer select-none",
				isDragging ? "opacity-50" : "",
			)}
			style={{
				backgroundColor: event.color + "CC",
				backdropFilter: "blur(4px)",
			}}
		>
			{event.title}
		</div>
	);
});

const MonthDayCell = memo(function MonthDayCell({
	day,
	currentMonth,
	events,
	onSelectSlot,
	onEventDrop,
	onEventClick,
}: {
	day: Date;
	currentMonth: Date;
	events: CalendarEvent[];
	onSelectSlot: (date: Date) => void;
	onEventDrop: (eventId: string, newDate: Date) => void;
	onEventClick: (event: CalendarEvent) => void;
}) {
	const [, drop] = useDrop(() => ({
		accept: DRAG_TYPE,
		drop: (item: { eventId: string }) => {
			onEventDrop(item.eventId, day);
		},
	}));

	const sortedEvents = useMemo(
		() =>
			[...events].sort(
				(a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
			),
		[events],
	);

	return (
		<div
			ref={drop}
			onClick={() => onSelectSlot(day)}
			className={cn(
				"h-28 border-b border-r border-white/5 p-1 cursor-pointer hover:bg-white/5 transition relative overflow-y-auto select-none",
				!isSameMonth(day, currentMonth) && "opacity-30",
				isToday(day) && "bg-blue-500/20",
			)}
		>
			<div
				className={cn(
					"text-xs text-right sticky top-0 bg-inherit",
					isToday(day) ? "text-blue-300 font-bold" : "text-white/70",
				)}
			>
				{format(day, "d")}
			</div>
			<div className="space-y-0.5 mt-1">
				{sortedEvents.map((event) => (
					<MonthEventChip
						key={event.id}
						event={event}
						onClick={() => onEventClick(event)}
					/>
				))}
			</div>
		</div>
	);
});

const MonthView = memo(function MonthView({
	date,
	events,
	onSelectSlot,
	onEventDrop,
	onEventClick,
}: {
	date: Date;
	events: CalendarEvent[];
	onSelectSlot: (d: Date) => void;
	onEventDrop: (id: string, newDay: Date) => void;
	onEventClick: (event: CalendarEvent) => void;
}) {
	const days = useMemo(() => {
		const monthStart = startOfMonth(date);
		const monthEnd = endOfMonth(date);
		const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
		const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
		const daysArray: Date[] = [];
		let current = startDate;
		while (current <= endDate) {
			daysArray.push(current);
			current = addDays(current, 1);
		}
		return daysArray;
	}, [date]);

	const eventsByDay = useMemo(() => {
		const map = new Map<string, CalendarEvent[]>();
		for (const event of events) {
			const key = format(toDate(event.start), "yyyy-MM-dd");
			if (!map.has(key)) map.set(key, []);
			map.get(key)!.push(event);
		}
		return map;
	}, [events]);

	return (
		<div className="flex-1 overflow-auto">
			<div className="grid grid-cols-7">
				{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((dayName) => (
					<div
						key={dayName}
						className="text-center text-xs font-medium text-white/50 py-2 border-b border-white/5"
					>
						{dayName}
					</div>
				))}
			</div>
			<div className="grid grid-cols-7">
				{days.map((day) => {
					const key = format(day, "yyyy-MM-dd");
					const dayEvents = eventsByDay.get(key) || [];
					return (
						<MonthDayCell
							key={day.toISOString()}
							day={day}
							currentMonth={date}
							events={dayEvents}
							onSelectSlot={onSelectSlot}
							onEventDrop={onEventDrop}
							onEventClick={onEventClick}
						/>
					);
				})}
			</div>
		</div>
	);
});

function useCellInteraction(onSelectRange: (start: Date, end: Date) => void) {
	const startCell = useRef<{ day: Date; hour: number } | null>(null);
	const hasMoved = useRef(false);
	const [selectionRange, setSelectionRange] = useState<{
		start: Date | null;
		end: Date | null;
	}>({ start: null, end: null });
	const selectingRef = useRef(false);

	const handlePointerDown = useCallback(
		(day: Date, hour: number, e: React.PointerEvent) => {
			if (e.button !== 0) return;
			startCell.current = { day, hour };
			hasMoved.current = false;
			selectingRef.current = true;
			(e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
			e.stopPropagation();
		},
		[],
	);

	const handleContainerPointerMove = useCallback((e: React.PointerEvent) => {
		if (!selectingRef.current || !startCell.current) return;
		const start = startCell.current;
		hasMoved.current = true;
		const target = document.elementFromPoint(
			e.clientX,
			e.clientY,
		) as HTMLElement | null;
		if (!target) return;
		const hourElement = target.closest("[data-hour]") as HTMLElement | null;
		if (!hourElement) return;
		const hourStr = hourElement.getAttribute("data-hour");
		const dayStr = hourElement.getAttribute("data-day");
		if (!hourStr || !dayStr) return;
		const endDay = toDate(dayStr);
		const endHour = parseInt(hourStr, 10);
		const startDate = setHours(setMinutes(start.day, 0), start.hour);
		const endDate = setHours(setMinutes(endDay, 0), endHour);
		setSelectionRange({ start: startDate, end: endDate });
	}, []);

	const handleContainerPointerUp = useCallback(
		(e: React.PointerEvent) => {
			if (!selectingRef.current || !startCell.current) return;
			selectingRef.current = false;
			const start = startCell.current;
			startCell.current = null;
			setSelectionRange({ start: null, end: null });

			if (!hasMoved.current) {
				const startDate = setHours(setMinutes(start.day, 0), start.hour);
				const endDate = new Date(
					startDate.getTime() + DEFAULT_DURATION_MINUTES * 60000,
				);
				onSelectRange(startDate, endDate);
				return;
			}

			const target = document.elementFromPoint(
				e.clientX,
				e.clientY,
			) as HTMLElement | null;
			const hourElement = target?.closest("[data-hour]") as HTMLElement | null;
			if (hourElement) {
				const hourStr = hourElement.getAttribute("data-hour");
				const dayStr = hourElement.getAttribute("data-day");
				if (hourStr && dayStr) {
					const endDay = toDate(dayStr);
					const endHour = parseInt(hourStr, 10);
					const startDate = setHours(setMinutes(start.day, 0), start.hour);
					const endDate = setHours(setMinutes(endDay, 0), endHour);
					if (startDate <= endDate) {
						onSelectRange(startDate, endDate);
					} else {
						onSelectRange(endDate, startDate);
					}
					return;
				}
			}

			const startDate = setHours(setMinutes(start.day, 0), start.hour);
			const endDate = new Date(
				startDate.getTime() + DEFAULT_DURATION_MINUTES * 60000,
			);
			onSelectRange(startDate, endDate);
		},
		[onSelectRange],
	);

	const pointerStart = useRef({ x: 0, y: 0 });
	const handlePointerDownWithPos = useCallback(
		(day: Date, hour: number, e: React.PointerEvent) => {
			if (e.button !== 0) return;
			pointerStart.current = { x: e.clientX, y: e.clientY };
			handlePointerDown(day, hour, e);
		},
		[handlePointerDown],
	);

	const handleContainerPointerMoveWithDetect = useCallback(
		(e: React.PointerEvent) => {
			if (!selectingRef.current) return;
			const dx = e.clientX - pointerStart.current.x;
			const dy = e.clientY - pointerStart.current.y;
			if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
				hasMoved.current = true;
			}
			handleContainerPointerMove(e);
		},
		[handleContainerPointerMove],
	);

	return {
		handlePointerDown: handlePointerDownWithPos,
		containerHandlers: {
			onPointerMove: handleContainerPointerMoveWithDetect,
			onPointerUp: handleContainerPointerUp,
		},
		selectionRange,
	};
}

function useResizable(
	eventId: string,
	initialStart: string,
	initialEnd: string,
	onUpdate: (id: string, newStart: string, newEnd: string) => void,
) {
	const [resizing, setResizing] = useState<"top" | "bottom" | null>(null);
	const [resizeDelta, setResizeDelta] = useState(0);
	const deltaRef = useRef(0);
	const startY = useRef(0);
	const originalStart = useRef(initialStart);
	const originalEnd = useRef(initialEnd);
	const edgeRef = useRef<"top" | "bottom">("bottom");

	useEffect(() => {
		originalStart.current = initialStart;
		originalEnd.current = initialEnd;
	}, [initialStart, initialEnd]);

	const handleResizeStart = useCallback(
		(e: React.MouseEvent, edge: "top" | "bottom") => {
			e.stopPropagation();
			e.preventDefault();

			edgeRef.current = edge;
			setResizing(edge);
			setResizeDelta(0);
			deltaRef.current = 0;
			startY.current = e.clientY;
			originalStart.current = initialStart;
			originalEnd.current = initialEnd;

			const onMouseMove = (moveEvent: MouseEvent) => {
				const deltaY = moveEvent.clientY - startY.current;
				deltaRef.current = deltaY;
				setResizeDelta(deltaY);
			};

			const onMouseUp = () => {
				window.removeEventListener("mousemove", onMouseMove);
				window.removeEventListener("mouseup", onMouseUp);

				const finalDelta = deltaRef.current;
				const minutesDelta = (finalDelta / HOUR_HEIGHT) * 60;
				const origStartDate = toDate(originalStart.current);
				const origEndDate = toDate(originalEnd.current);
				let newStart = origStartDate;
				let newEnd = origEndDate;

				if (edgeRef.current === "top") {
					newStart = new Date(origStartDate.getTime() + minutesDelta * 60000);
					if (newStart.getTime() >= origEndDate.getTime() - 15 * 60000) return;
				} else {
					newEnd = new Date(origEndDate.getTime() + minutesDelta * 60000);
					if (newEnd.getTime() <= origStartDate.getTime() + 15 * 60000) return;
				}

				onUpdate(eventId, newStart.toISOString(), newEnd.toISOString());
				setResizing(null);
				setResizeDelta(0);
			};

			window.addEventListener("mousemove", onMouseMove);
			window.addEventListener("mouseup", onMouseUp);
		},
		[initialStart, initialEnd, eventId, onUpdate],
	);

	const startDate = toDate(initialStart);
	const endDate = toDate(initialEnd);
	const baseTop =
		((startDate.getHours() * 60 + startDate.getMinutes()) / 1440) * 100;
	const baseHeight =
		((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60000)) * 100;

	let top = baseTop;
	let height = baseHeight;

	if (resizing === "top") {
		const minutesDelta = (resizeDelta / HOUR_HEIGHT) * 60;
		const newStartTime = startDate.getTime() + minutesDelta * 60000;
		if (newStartTime < endDate.getTime() - 15 * 60000) {
			top =
				((new Date(newStartTime).getHours() * 60 +
					new Date(newStartTime).getMinutes()) /
					1440) *
				100;
			height = ((endDate.getTime() - newStartTime) / (24 * 60 * 60000)) * 100;
		}
	} else if (resizing === "bottom") {
		const minutesDelta = (resizeDelta / HOUR_HEIGHT) * 60;
		const newEndTime = endDate.getTime() + minutesDelta * 60000;
		if (newEndTime > startDate.getTime() + 15 * 60000) {
			height = ((newEndTime - startDate.getTime()) / (24 * 60 * 60000)) * 100;
		}
	}

	return { resizing, top, height, handleResizeStart };
}

const TimeGridEventBlock = memo(function TimeGridEventBlock({
	event,
	onUpdate,
	onDelete,
}: {
	event: CalendarEvent;
	onUpdate: (id: string, newStart: string, newEnd: string) => void;
	onDelete: (id: string) => void;
}) {
	const eventRef = useRef(event);
	eventRef.current = event;

	const [popoverOpen, setPopoverOpen] = useState(false);
	const hasResized = useRef(false);
	const resizeTimeout = useRef<ReturnType<typeof setTimeout>>();

	const { resizing, top, height, handleResizeStart } = useResizable(
		event.id,
		event.start,
		event.end,
		onUpdate,
	);

	const canDragRef = useRef(() => resizing === null);
	canDragRef.current = () => resizing === null;

	const itemRef = useRef(() => ({
		eventId: eventRef.current.id,
		start: eventRef.current.start,
		end: eventRef.current.end,
	}));
	itemRef.current = () => ({
		eventId: eventRef.current.id,
		start: eventRef.current.start,
		end: eventRef.current.end,
	});

	const [{ isDragging }, drag] = useDrag(
		() => ({
			type: DRAG_TYPE,
			item: () => itemRef.current(),
			collect: (monitor) => ({ isDragging: monitor.isDragging() }),
			canDrag: () => canDragRef.current(),
		}),
		[],
	);

	const handleClick = useCallback(() => {
		if (isDragging || resizing || hasResized.current) return;
		setPopoverOpen(true);
	}, [isDragging, resizing]);

	useEffect(() => {
		if (resizing) {
			hasResized.current = true;
			clearTimeout(resizeTimeout.current);
		} else if (hasResized.current) {
			resizeTimeout.current = setTimeout(() => {
				hasResized.current = false;
			}, 500);
		}
		return () => clearTimeout(resizeTimeout.current);
	}, [resizing]);

	return (
		<EventEditPopover
			eventId={event.id}
			onUpdate={(id, updates) => {
				useCalendarStore.getState().updateEvent(id, updates);
			}}
			onDelete={onDelete}
			open={popoverOpen}
			onOpenChange={setPopoverOpen}
		>
			<div
				ref={drag}
				onClick={handleClick}
				className="absolute left-1 right-1 rounded-md text-[10px] font-medium border border-white/10 z-10 group select-none"
				style={{
					top: `${top}%`,
					height: `${height}%`,
					backgroundColor: event.color + "CC",
					backdropFilter: "blur(4px)",
					opacity: isDragging ? 0.4 : 1,
					cursor: resizing
						? resizing === "top"
							? "n-resize"
							: "s-resize"
						: "grab",
				}}
			>
				<div className="px-1.5 py-0.5 truncate pointer-events-none">
					{event.title}
				</div>
				<div
					className="absolute top-0 left-0 right-0 h-2 cursor-n-resize hover:bg-white/20"
					onMouseDown={(e) => handleResizeStart(e, "top")}
				/>
				<div
					className="absolute bottom-0 left-0 right-0 h-2 cursor-s-resize hover:bg-white/20"
					onMouseDown={(e) => handleResizeStart(e, "bottom")}
				/>
			</div>
		</EventEditPopover>
	);
});

const TimeGridDayColumn = memo(function TimeGridDayColumn({
	day,
	events,
	onUpdate,
	onDrop,
	onDelete,
	currentTimeTop,
	onPointerDownCell,
	selectionRange,
}: {
	day: Date;
	events: CalendarEvent[];
	onUpdate: (id: string, newStart: string, newEnd: string) => void;
	onDrop: (
		eventId: string,
		day: Date,
		hour: number,
		originalStart: string,
		originalEnd: string,
	) => void;
	onDelete: (id: string) => void;
	currentTimeTop: number | null;
	onPointerDownCell: (day: Date, hour: number, e: React.PointerEvent) => void;
	selectionRange: { start: Date | null; end: Date | null };
}) {
	const [, drop] = useDrop(() => ({
		accept: DRAG_TYPE,
		drop: (item: { eventId: string; start: string; end: string }, monitor) => {
			const clientOffset = monitor.getClientOffset();
			if (!clientOffset) return;
			const elements = document.elementsFromPoint(
				clientOffset.x,
				clientOffset.y,
			);
			const hourElement = elements.find((el) => el.hasAttribute("data-hour")) as
				| HTMLElement
				| undefined;
			if (hourElement) {
				const hour = parseInt(hourElement.getAttribute("data-hour")!, 10);
				onDrop(item.eventId, day, hour, item.start, item.end);
			}
		},
	}));

	const isInRange = useCallback(
		(hour: number) => {
			if (!selectionRange.start || !selectionRange.end) return false;
			const slotTime = setHours(setMinutes(day, 0), hour).getTime();
			const startTime = selectionRange.start.getTime();
			const endTime = selectionRange.end.getTime();
			return (
				(slotTime >= startTime && slotTime <= endTime) ||
				(slotTime <= startTime && slotTime >= endTime)
			);
		},
		[day, selectionRange],
	);

	const hourSlots = useMemo(
		() =>
			Array.from({ length: 24 }, (_, hour) => (
				<div
					key={hour}
					data-day={day.toISOString()}
					data-hour={hour}
					className={cn(
						"h-12 border-b border-white/5 hover:bg-white/5 cursor-pointer select-none",
						isInRange(hour) && "bg-blue-500/20",
					)}
					onPointerDown={(e) => onPointerDownCell(day, hour, e)}
				/>
			)),
		[day, isInRange, onPointerDownCell],
	);

	return (
		<div ref={drop} className="border-r border-white/5 relative">
			{hourSlots}
			{currentTimeTop !== null && isToday(day) && (
				<div
					className="absolute left-0 right-0 z-20 pointer-events-none"
					style={{ top: `${currentTimeTop}%` }}
				>
					<div className="border-t-2 border-red-400 w-full" />
					<div className="w-2 h-2 rounded-full bg-red-400 -mt-1 -ml-1" />
				</div>
			)}
			{events.map((event) => (
				<TimeGridEventBlock
					key={event.id}
					event={event}
					onUpdate={onUpdate}
					onDelete={onDelete}
				/>
			))}
		</div>
	);
});

const TimeGridView = memo(function TimeGridView({
	days,
	events,
	onSelectSlot,
	onUpdate,
	onDrop,
	onDelete,
}: {
	days: Date[];
	events: CalendarEvent[];
	onSelectSlot: (start: Date, end: Date) => void;
	onUpdate: (id: string, newStart: string, newEnd: string) => void;
	onDrop: (
		eventId: string,
		day: Date,
		hour: number,
		originalStart: string,
		originalEnd: string,
	) => void;
	onDelete: (id: string) => void;
}) {
	const now = useMemo(() => new Date(), []);
	const currentTimeTop = useMemo(
		() => ((now.getHours() * 60 + now.getMinutes()) / 1440) * 100,
		[now],
	);

	const eventsByDay = useMemo(() => {
		const map = new Map<string, CalendarEvent[]>();
		for (const event of events) {
			const key = format(toDate(event.start), "yyyy-MM-dd");
			if (!map.has(key)) map.set(key, []);
			map.get(key)!.push(event);
		}
		return map;
	}, [events]);

	const { handlePointerDown, containerHandlers, selectionRange } =
		useCellInteraction(onSelectSlot);

	return (
		<div className="flex-1 flex flex-col overflow-hidden">
			<div className="flex border-b border-white/5 select-none">
				<div className="w-16 shrink-0" />
				{days.map((day) => (
					<div
						key={day.toISOString()}
						className={cn(
							"flex-1 text-center py-2 border-r border-white/5",
							isToday(day) && "bg-blue-500/10",
						)}
					>
						<div
							className={cn(
								"text-xs font-medium",
								isToday(day) ? "text-blue-300" : "text-white/70",
							)}
						>
							{format(day, "EEEE")}
						</div>
						<div
							className={cn(
								"text-[10px]",
								isToday(day) ? "text-blue-300" : "text-white/40",
							)}
						>
							{format(day, "MMM d")}
						</div>
					</div>
				))}
			</div>
			<div
				className="flex-1 flex overflow-auto"
				onPointerMove={containerHandlers.onPointerMove}
				onPointerUp={containerHandlers.onPointerUp}
			>
				<div className="w-16 flex-shrink-0 border-r border-white/5 select-none">
					{Array.from({ length: 24 }, (_, hour) => (
						<div
							key={hour}
							className="h-12 flex items-start justify-end pr-3 pt-1"
						>
							<span className="text-[11px] text-white/50 leading-tight">
								{hour === 0
									? "12 AM"
									: hour < 12
										? `${hour} AM`
										: hour === 12
											? "12 PM"
											: `${hour - 12} PM`}
							</span>
						</div>
					))}
				</div>
				<div
					className="flex-1 grid"
					style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}
				>
					{days.map((day) => {
						const key = format(day, "yyyy-MM-dd");
						const dayEvents = eventsByDay.get(key) || [];
						return (
							<TimeGridDayColumn
								key={day.toISOString()}
								day={day}
								events={dayEvents}
								onUpdate={onUpdate}
								onDrop={onDrop}
								onDelete={onDelete}
								currentTimeTop={currentTimeTop}
								onPointerDownCell={handlePointerDown}
								selectionRange={selectionRange}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
});

function Frolendar() {
	const events = useCalendarStore((s) => s.events);
	const view = useCalendarStore((s) => s.view);
	const dateString = useCalendarStore((s) => s.date);
	const setView = useCalendarStore((s) => s.setView);
	const setDate = useCalendarStore((s) => s.setDate);
	const addEvent = useCalendarStore((s) => s.addEvent);
	const updateEvent = useCalendarStore((s) => s.updateEvent);
	const deleteEvent = useCalendarStore((s) => s.deleteEvent);

	const date = useMemo(() => toDate(dateString), [dateString]);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [newEventDefaults, setNewEventDefaults] = useState({
		start: new Date(),
		end: new Date(),
	});

	const handleNavigate = useCallback(
		(newDate: Date) => setDate(newDate.toISOString()),
		[setDate],
	);

	const handleSelectSlot = useCallback((start: Date, end: Date) => {
		setNewEventDefaults({ start, end });
		setDialogOpen(true);
	}, []);

	const handleCreateEvent = useCallback(
		(eventData: Omit<CalendarEvent, "id">) => {
			addEvent({ ...eventData, id: crypto.randomUUID() });
			setDialogOpen(false);
		},
		[addEvent],
	);

	const handleEventUpdate = useCallback(
		(id: string, newStart: string, newEnd: string) => {
			updateEvent(id, { start: newStart, end: newEnd });
		},
		[updateEvent],
	);

	const handleEventDrop = useCallback(
		(
			eventId: string,
			day: Date,
			hour: number,
			originalStart: string,
			originalEnd: string,
		) => {
			const origStart = toDate(originalStart);
			const origEnd = toDate(originalEnd);
			const duration = origEnd.getTime() - origStart.getTime();
			const newStart = setHours(setMinutes(day, 0), hour);
			const newEnd = new Date(newStart.getTime() + duration);
			updateEvent(eventId, {
				start: newStart.toISOString(),
				end: newEnd.toISOString(),
			});
		},
		[updateEvent],
	);

	const handleMonthDrop = useCallback(
		(eventId: string, newDay: Date) => {
			const event = events.find((e) => e.id === eventId);
			if (!event) return;
			const origStart = toDate(event.start);
			const origEnd = toDate(event.end);
			const newStart = setHours(
				setMinutes(newDay, origStart.getMinutes()),
				origStart.getHours(),
			);
			const newEnd = setHours(
				setMinutes(newDay, origEnd.getMinutes()),
				origEnd.getHours(),
			);
			updateEvent(eventId, {
				start: newStart.toISOString(),
				end: newEnd.toISOString(),
			});
		},
		[events, updateEvent],
	);

	const handleDelete = useCallback(
		(id: string) => deleteEvent(id),
		[deleteEvent],
	);

	const handleToday = useCallback(() => {
		setDate(new Date().toISOString());
		if (view !== "month") {
			setTimeout(() => {
				const container = document.querySelector(
					".flex-1.overflow-auto",
				) as HTMLElement | null;
				if (container) {
					const now = new Date();
					const scrollTop =
						((now.getHours() * 60 + now.getMinutes()) / 1440) *
							(24 * HOUR_HEIGHT) -
						container.clientHeight / 2;
					container.scrollTo({ top: scrollTop, behavior: "smooth" });
				}
			}, 50);
		}
	}, [setDate, view]);

	const days = useMemo(() => {
		if (view === "week") {
			const start = startOfWeek(date, { weekStartsOn: 1 });
			return Array.from({ length: 7 }, (_, i) => addDays(start, i));
		}
		return [date];
	}, [view, date]);

	return (
		<div className="w-full h-full flex flex-col rounded-xl overflow-hidden bg-transparent">
			<Toolbar
				view={view}
				onViewChange={setView}
				date={date}
				onNavigate={handleNavigate}
				onToday={handleToday}
			/>
			{view === "month" ? (
				<MonthView
					date={date}
					events={events}
					onSelectSlot={(day) => {
						const start = setHours(setMinutes(day, 0), 9);
						const end = new Date(
							start.getTime() + DEFAULT_DURATION_MINUTES * 60000,
						);
						handleSelectSlot(start, end);
					}}
					onEventDrop={handleMonthDrop}
					onEventClick={() => {}}
				/>
			) : (
				<TimeGridView
					days={days}
					events={events}
					onSelectSlot={handleSelectSlot}
					onUpdate={handleEventUpdate}
					onDrop={handleEventDrop}
					onDelete={handleDelete}
				/>
			)}
			<NewEventDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				onSave={handleCreateEvent}
				defaultStart={newEventDefaults.start}
				defaultEnd={newEventDefaults.end}
			/>
		</div>
	);
}

export default Frolendar;
