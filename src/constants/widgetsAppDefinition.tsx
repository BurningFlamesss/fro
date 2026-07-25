import Clock from "#/widgets/Clock.tsx";
import Event from "#/widgets/Event.tsx";
import Launcher from "#/widgets/Launcher.tsx";
import Pomodoro from "#/widgets/Pomodoro.tsx";
import { Quote } from "#/widgets/Quote.tsx";
import Task from "#/widgets/Task.tsx";
import Weather from "#/widgets/Weather.tsx";
import { defaultSizeConfigurations, type WidgetAppDefinitionsType, type WidgetId } from "./widgets";

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
		widget_weather: {
			sizeConfigurations: {
				...defaultSizeConfigurations,
				maximumHeight: 500,
			},
			source: {
				type: "component",
				code: Weather,
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
