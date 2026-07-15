import type { WidgetInstance } from "../constants";

function WidgetRenderer({ widget }: { widget: WidgetInstance }) {
	const { source, name } = widget;

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
