import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { type WidgetId, type WidgetInstance, Widgets } from "../constants";

interface WidgetStore {
    widgets: Record<WidgetId, WidgetInstance>
}

export const useWidgetStore = create<WidgetStore>()(
    immer((set) => ({
        widgets: Widgets,
        
    }))
);
