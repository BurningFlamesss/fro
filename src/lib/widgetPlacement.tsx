import type { WidgetInstance } from "../constants";

interface Rectangle {
	x: number;
	y: number;
	width: number;
	height: number;
}

const COLUMN_WIDTH = 20;
const GAP = 12;

function overlaps(a: Rectangle, b: Rectangle): boolean {
	// Overlap function copied from google
	return (
		a.x < b.x + b.width &&
		a.x + a.width > b.x &&
		a.y < b.y + b.height &&
		a.y + a.height > b.y
	);
}

export function findNextPosition(
	existingWidgets: Array<WidgetInstance>,
	containerWidth: number,
	containerHeight: number,
	widgetWidth: number,
	widgetHeight: number,
): { x: number; y: number } {
	let currentX = containerWidth - widgetWidth + GAP;
	let currentY = GAP;

	const placedRectangles = existingWidgets.map((widget) => ({
		x: widget.x,
		y: widget.y,
		width: widget.width,
		height: widget.height,
	}));

	while (currentX >= 0) {
		let y = currentY;
		let fits = true;

		if (y + widgetHeight > containerHeight) {
			currentX -= COLUMN_WIDTH;
			continue;
		}

		const candidate = {
			x: currentX,
			y,
			width: widgetWidth,
			height: widgetHeight,
		};
		for (const placed of placedRectangles) {
			if (overlaps(candidate, placed)) {
				fits = false;
				break;
			}
		}

		if (fits) {
			return {
				x: currentX,
				y,
			};
		}

		const overlapping = placedRectangles.filter(
			(placed) =>
				placed.x < currentX + widgetWidth && placed.x + placed.width > currentX,
		);

		if (overlapping.length > 0) {
			const maxBottom = Math.max(
				...overlapping.map((placed) => placed.y + placed.height),
			);
			currentY = maxBottom + GAP;

			if (currentY + widgetHeight > containerHeight) {
				currentX -= COLUMN_WIDTH;
				currentY = GAP;
			}
		} else {
			currentX -= COLUMN_WIDTH;
		}
	}

	return {
		x: GAP,
		y: GAP,
	};
}
