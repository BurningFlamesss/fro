import { useWidgetStore } from "#/store/widget.tsx";
import type { WidgetId, WidgetProps } from "../constants/widgets";

function Launcher({ props }: WidgetProps) {
	const widgets = useWidgetStore((state) => state.widgets);

	if (props) {
		const { id, name } = props as { id: WidgetId; name: string };

		if (id) {
			const widget = widgets[id];
			const source = widget.widgetSpecification?.source ?? {
				type: "html",
				code: "",
			};

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
	}

	return <div>Launcher</div>;
}

export default Launcher;
