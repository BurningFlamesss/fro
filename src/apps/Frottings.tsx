import { cn } from "#/lib/utils.ts";
import { useSettingStore } from "#/store/setting.tsx";
import { IoMdCheckmark } from "react-icons/io";

const backgrounds = [
	{
		name: "bar-and-man",
		url: "/backgrounds/bar-and-man.gif",
		position: "center",
	},
	{ name: "bar", url: "/backgrounds/bar.gif", position: "center" },
	{ name: "bird", url: "/backgrounds/bird.gif", position: "center" },
	{
		name: "calm-and-peaceful",
		url: "/backgrounds/calm-and-peaceful.gif",
		position: "top",
	},
	{
		name: "calm-sunset",
		url: "/backgrounds/calm-sunset.gif",
		position: "center",
	},
	{
		name: "coffee-and-cat",
		url: "/backgrounds/coffee-and-cat.gif",
		position: "center 80%",
	},
	{
		name: "cozy-home-environment",
		url: "/backgrounds/cozy-home-environment.gif",
		position: "center",
	},
	{
		name: "cyber-rain",
		url: "/backgrounds/cyber-rain.gif",
		position: "center",
	},
	{ name: "dead-hell", url: "/backgrounds/dead-hell.gif", position: "center" },
	{
		name: "fantastic-man",
		url: "/backgrounds/fantastic-man.gif",
		position: "center 70%",
	},
	{ name: "flooded", url: "/backgrounds/flooded.gif", position: "center" },
	{ name: "forest", url: "/backgrounds/forest.gif", position: "center" },
	{ name: "game-city", url: "/backgrounds/game-city.gif", position: "bottom" },
	{ name: "game", url: "/backgrounds/game.gif", position: "bottom" },
	{ name: "gardening", url: "/backgrounds/gardening.gif", position: "center" },
	{ name: "landscape", url: "/backgrounds/landscape.gif", position: "bottom" },
	{ name: "listening", url: "/backgrounds/listening.gif", position: "center" },
	{ name: "metro", url: "/backgrounds/metro.gif", position: "bottom" },
	{
		name: "near-night",
		url: "/backgrounds/near-night.gif",
		position: "top",
	},
	{
		name: "night-in-future-town",
		url: "/backgrounds/night-in-future-town.gif",
		position: "bottom",
	},
	{ name: "nothing", url: "/backgrounds/nothing.gif", position: "center" },
	{
		name: "old-temple",
		url: "/backgrounds/old-temple.gif",
		position: "center",
	},
	{
		name: "panda-city",
		url: "/backgrounds/panda-city.gif",
		position: "center",
	},
	{
		name: "people-moving",
		url: "/backgrounds/people-moving.gif",
		position: "center",
	},
	{ name: "pixel-dog", url: "/backgrounds/pixel-dog.gif", position: "center" },
	{
		name: "rain-mode",
		url: "/backgrounds/rain-mode.gif",
		position: "center 70%",
	},
	{ name: "rain", url: "/backgrounds/rain.gif", position: "center" },
	{
		name: "relaxing-tea",
		url: "/backgrounds/relaxing-tea.gif",
		position: "center",
	},
	{ name: "samurai", url: "/backgrounds/samurai.gif", position: "center" },
	{
		name: "tree-house",
		url: "/backgrounds/tree-house.gif",
		position: "center",
	},
	{
		name: "two-person",
		url: "/backgrounds/two-person.gif",
		position: "center",
	},
];

function Frottings() {
	const { backgroundImage, setBackgroundImage } = useSettingStore();
	return (
		<div className="p-4">
			<h2 className="mb-4 text-lg font-semibold">Backgrounds</h2>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
				{backgrounds.map((background) => {
					const selected = backgroundImage.url === background.url;

					return (
						<button
							key={background.name}
							type="button"
							onClick={() =>
								setBackgroundImage(background.url, background.position)
							}
							className={cn(
								"group relative overflow-hidden rounded-xl border transition-all cursor-pointer",
								"hover:border-background/30",
								selected
									? "border-primary ring-2 ring-primary/40"
									: "border-background/10",
							)}
						>
							<img
								src={`${background.url.replace("/backgrounds", "/backgrounds/previews").replace(".gif", ".webp")}`}
								alt={background.name}
								loading="lazy"
								className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
							/>

							<div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-foreground/80 via-foreground/40 to-transparent p-2">
								<p className="truncate text-xs font-medium text-background">
									{background.name
										.split("-")
										.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
										.join(" ")}
								</p>
							</div>

							{selected && (
								<div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-background">
									<IoMdCheckmark />
								</div>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}

export default Frottings;
