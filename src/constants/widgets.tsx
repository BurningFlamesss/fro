import type { ComponentType } from "react";

import Clock from "#/widgets/Clock.tsx";
import Event from "#/widgets/Event.tsx";
import Launcher from "#/widgets/Launcher.tsx";
import { Quote } from "#/widgets/Quote.tsx";
import Task from "#/widgets/Task.tsx";
import Pomodoro from "#/widgets/Pomodoro.tsx";

export type WidgetSpecification = {
	source?: {
		type: "html";
		code: string;
	};
};
export type WidgetProps = {
	props?: Record<string, unknown>;
};

export interface WidgetInstance {
	id: WidgetId;
	definitionId: WidgetId;
	name: string;
	x: number;
	y: number;
	width: number;
	height: number;
	minimized: boolean;
	locked: boolean;
	hidden: boolean;
	widgetSpecification?: WidgetSpecification;
}

export interface WidgetAppDefinitionsType {
	sizeConfigurations?: {
		defaultHeight?: number;
		defaultWidth?: number;
		minimumHeight?: number;
		minimumWidth?: number;
		maximumHeight?: number;
		maximumWidth?: number;
	};
	source:
		| {
				type: "html";
				code: string;
		  }
		| {
				type: "component";
				code: ComponentType<WidgetProps>;
		  };
}

export type WidgetId = `widget_${string}`;

export const defaultSizeConfigurations = {
	defaultHeight: 122,
	defaultWidth: 170,
	minimumHeight: 70,
	minimumWidth: 150,
	maximumHeight: 400,
	maximumWidth: 700,
};

export const Widgets: Record<WidgetId, WidgetInstance> = {
	widget_quote: {
		id: "widget_quote",
		definitionId: "widget_quote",
		name: "Quote",
		x: 208,
		y: 0,
		width: 399,
		height: 122,
		minimized: false,
		hidden: false,
		locked: false,
	},
	widget_task: {
		id: "widget_task",
		definitionId: "widget_task",
		name: "Tasks",
		x: 0,
		y: 218,
		width: 342,
		height: 125,
		minimized: false,
		hidden: false,
		locked: false,
	},
	widget_events: {
		id: "widget_events",
		definitionId: "widget_events",
		name: "Events",
		x: 350,
		y: 140,
		width: 317,
		height: 125,
		minimized: false,
		hidden: false,
		locked: false,
	},
	widget_clock: {
		id: "widget_clock",
		definitionId: "widget_clock",
		name: "Clock",
		x: 0,
		y: 0,
		width: 173,
		height: 173,
		minimized: false,
		locked: false,
		hidden: false,
	},
	widget_pomodoro: {
		id: "widget_pomodoro",
		definitionId: "widget_pomodoro",
		name: "Pomodoro",
		x: 400,
		y: 400,
		width: 200,
		height: 200,
		minimized: false,
		locked: false,
		hidden: false,
	},
	widget_launcher: {
		id: "widget_launcher",
		definitionId: "widget_launcher",
		name: "Widget",
		x: 450,
		y: 300,
		width: 200,
		height: 200,
		minimized: false,
		locked: false,
		hidden: true,
		// widgetSpecification: {
		// 	source: {
		// 		type: "html",
		// 		code: "<h1>Launcher</h1>",
		// 	}
		// }
	},
};

export const WidgetAppDefinitions: Record<WidgetId, WidgetAppDefinitionsType> =
	{
		widget_quote: {
			sizeConfigurations: defaultSizeConfigurations,
			source: {
				type: "component",
				code: Quote,
			},
		},
		widget_task: {
			sizeConfigurations: defaultSizeConfigurations,
			source: {
				type: "component",
				code: Task,
			},
		},
		widget_events: {
			sizeConfigurations: defaultSizeConfigurations,
			source: {
				type: "component",
				code: Event,
			},
		},
		widget_clock: {
			sizeConfigurations: {
				...defaultSizeConfigurations,
				minimumHeight: 200,
			},
			source: {
				type: "component",
				code: Clock,
			},
		},
		widget_pomodoro: {
			sizeConfigurations: defaultSizeConfigurations,
			source: {
				type: "component",
				code: Pomodoro,
			},
		},
		widget_launcher: {
			sizeConfigurations: defaultSizeConfigurations,
			source: {
				type: "component",
				code: Launcher,
			},
		},
	};
