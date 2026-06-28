// stores/useCalendarStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface CalendarEvent {
	id: string;
	title: string;
	start: string; // ISO 8601
	end: string;
	color: string;
}

interface CalendarState {
	events: CalendarEvent[];
	view: "month" | "week" | "day";
	date: string; // ISO of the current navigation date

	addEvent: (event: CalendarEvent) => void;
	updateEvent: (
		id: string,
		updates: Partial<Omit<CalendarEvent, "id">>,
	) => void;
	deleteEvent: (id: string) => void;
	setView: (view: "month" | "week" | "day") => void;
	setDate: (date: string) => void;
}

export const useCalendarStore = create<CalendarState>()(
	persist(
		immer((set) => ({
			events: [],
			view: "week",
			date: new Date().toISOString(),

			addEvent: (event) =>
				set((state) => {
					state.events.push(event);
				}),

			updateEvent: (id, updates) =>
				set((state) => {
					const idx = state.events.findIndex((e) => e.id === id);
					if (idx !== -1) {
						Object.assign(state.events[idx], updates);
					}
				}),

			deleteEvent: (id) =>
				set((state) => {
					state.events = state.events.filter((e) => e.id !== id);
				}),

			setView: (view) =>
				set((state) => {
					state.view = view;
				}),

			setDate: (date) =>
				set((state) => {
					state.date = date;
				}),
		})),
		{
			name: "frolendar-storage",
		},
	),
);
