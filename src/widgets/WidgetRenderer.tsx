import { useWidgetStore } from "#/store/widget.tsx";
import type { WidgetInstance } from "../constants";

const MIN_WIDGET_WIDTH = 150;
const MIN_WIDGET_HEIGHT = 100;

function WidgetRenderer({ widget }: { widget: WidgetInstance }) {
	const {
		minimizeWidget,
		restoreWidget,
		hideWidget,
		lockWidget,
		updateWidgetRect,
		removeWidget,
	} = useWidgetStore();

	const { source, name, id, height, hidden, locked, minimized, width, x, y } =
		widget;

	if (hidden) {
		return null;
	}

	if (source.type === "html" && typeof source.code === "string") {
		const injectableCode = `
		<style>
			body {
				font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif;
			}
		</style>
		<main>
			${source.code}
		</main>
		`;

		return (
			<iframe
				srcDoc={injectableCode}
				title={name}
				className="w-full h-full border-0"
				sandbox="allow-scripts allow-forms allow-modals allow-popups"
			/>
		);
	}

	const Component = source.code;
	return <Component />;
}

export default WidgetRenderer;
