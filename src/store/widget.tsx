import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { type WidgetId, type WidgetInstance, Widgets } from "../constants";

interface WidgetStore {
    widgets: Record<WidgetId, WidgetInstance>;
    addWidget: (widget: WidgetInstance) => void;
    removeWidget: (id: WidgetId) => void;
}

export const useWidgetStore = create<WidgetStore>()(
    immer((set) => ({
        widgets: Widgets,

        addWidget: (widget) => set((state) => {
            state.widgets[widget.id] = widget 
        }),
        removeWidget: (id) => set((state) => {
            delete state.widgets[id]
        })

    }))
);
