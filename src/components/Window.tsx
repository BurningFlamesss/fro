import type { AppId, AppInstance, WindowInstance } from "../constants";

function Window({ win, apps }: { win: WindowInstance; apps: Record<AppId, AppInstance> }) {
	const {
		id,
		appId,
		height,
		logo,
		maximized,
		minimized,
		title,
		width,
		x,
		y,
		zIndex,
		theme,
	} = win;

    const component = apps[appId].component

	return (
		<section className="glassmorphism" style={{ width, height, x, y }}>
			{title}

            <div>
                {component}
            </div>
		</section>
	);
}

export default Window;
