import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
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
}

export const useWidgetStore = create<WidgetStore>()(
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
	})),
);
