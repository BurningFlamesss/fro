import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createDebouncedStorage } from "#/lib/debounced-storage.ts";
import { type WidgetId, type WidgetInstance, Widgets } from "../constants";

interface WidgetStore {
	widgets: Record<WidgetId, WidgetInstance>;

	addWidget: (widget: WidgetInstance) => void;
	removeWidget: (id: WidgetId) => void;
	minimizeWidget: (id: WidgetId) => void;
	restoreWidget: (id: WidgetId) => void;
	hideWidget: (id: WidgetId) => void;
	showWidget: (id: WidgetId) => void;
	lockWidget: (id: WidgetId, locked: boolean) => void;

	updateWidgetRect: (
		id: WidgetId,
		rectangle: { x: number; y: number; width: number; height: number },
	) => void;
	updateWidgetProps: (id: WidgetId, props: Record<string, unknown>) => void;
}

export const useWidgetStore = create<WidgetStore>()(
	persist(
		immer((set) => ({
			widgets: Widgets,

			addWidget: (widget) =>
				set((state) => {
					state.widgets[widget.id] = widget;
				}),
			removeWidget: (id) =>
				set((state) => {
					delete state.widgets[id];
				}),
			minimizeWidget: (id) =>
				set((state) => {
					const widget = state.widgets[id];
					if (widget) {
						widget.minimized = true;
					}
				}),
			restoreWidget: (id) =>
				set((state) => {
					const widget = state.widgets[id];
					if (widget) {
						widget.minimized = false;
					}
				}),
			hideWidget: (id) =>
				set((state) => {
					const widget = state.widgets[id];
					if (widget) {
						widget.hidden = true;
					}
				}),
			showWidget: (id) =>
				set((state) => {
					const widget = state.widgets[id];
					if (widget) {
						widget.hidden = false;
					}
				}),
			lockWidget: (id, locked) =>
				set((state) => {
					const widget = state.widgets[id];
					if (widget) {
						widget.locked = locked;
					}
				}),

			updateWidgetRect: (id, rectangle) =>
				set((state) => {
					const widget = state.widgets[id];
					if (widget) {
						widget.x = rectangle.x;
						widget.y = rectangle.y;
						widget.width = rectangle.width;
						widget.height = rectangle.height;
					}
				}),

			updateWidgetProps: (id, props) =>
				set((state) => {
					const widget = state.widgets[id];
					if (widget) {
						widget.props = {
							...widget.props,
							...props,
						};
					}
				}),
		})),
		{
			name: "widgets-storage",
			storage: createDebouncedStorage(1000),
		},
	),
);
