import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createDebouncedStorage } from "#/lib/debounced-storage.ts";
import {
	WidgetAppDefinitions,
	type WidgetId,
	type WidgetInstance,
	type WidgetSpecification,
	Widgets,
	defaultSizeConfigurations,
} from "../constants/widgets";

interface WidgetStore {
	widgets: Record<WidgetId, WidgetInstance>;

	addWidget: (
		definitionId: WidgetId,
		position?: { x: number; y: number },
		widgetSpecification?: WidgetSpecification,
	) => void;
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
	updateWidgetSpecifications: (
		id: WidgetId,
		specifications: Record<string, unknown>,
	) => void;
}

export const useWidgetStore = create<WidgetStore>()(
	persist(
		immer((set) => ({
			widgets: Widgets,

			addWidget: (definitionId, position, widgetSpecification) => {
				const widget = WidgetAppDefinitions[definitionId];

				if (!widget) return;

				set((state) => {
					const id =
						`widget_${definitionId}_${crypto.randomUUID()}` as WidgetId;

					state.widgets[id] = {
						id,
						definitionId,
						name: definitionId,
						x: position?.x ?? 100,
						y: position?.y ?? 100,
						width:
							widget.sizeConfigurations?.defaultWidth ??
							defaultSizeConfigurations.defaultWidth,
						height:
							widget.sizeConfigurations?.defaultHeight ??
							defaultSizeConfigurations.defaultHeight,
						minimized: false,
						hidden: false,
						locked: false,
						widgetSpecification,
					};
				});
			},
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

			updateWidgetSpecifications: (id, specifications) =>
				set((state) => {
					const widget = state.widgets[id];
					if (widget) {
						widget.widgetSpecification = {
							...widget.widgetSpecification,
							...specifications,
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
