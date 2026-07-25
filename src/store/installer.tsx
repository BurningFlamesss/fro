import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
	WidgetAppDefinitionsType,
	WidgetId,
	WidgetInstance,
} from "../constants/widgets";

interface InstallerStore {
	installedWidgetDefinitions: Record<WidgetId, WidgetAppDefinitionsType>;
}

export const useInstallerStore = create<InstallerStore>()(
	immer((set) => ({
		installedWidgetDefinitions: {},
	})),
);
