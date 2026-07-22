import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
	WidgetAppDefinitions,
	type WidgetAppDefinitionsType,
	type WidgetId,
	type WidgetInstance,
} from "../constants";

interface InstallerStore {
	installedWidgetDefinitions: Record<WidgetId, WidgetAppDefinitionsType>;
}

export const useInstallerStore = create<InstallerStore>()(
	immer((set) => ({
		installedWidgetDefinitions: {}
	})),
);
