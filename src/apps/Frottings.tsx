import { useSettingStore } from "#/store/setting.tsx";

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
	{ name: "rain-mode", url: "/backgrounds/rain-mode.gif", position: "center 70%" },
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
	const { setBackgroundImage } = useSettingStore();
	return (
		<div className="relative z-10 min-h-full w-full p-2 flex flex-col content-start overflow-x-hidden overflow-y-auto">
			{backgrounds.map((background) => {
				return (
					<button
						type="button"
						onClick={() => setBackgroundImage(background.url, background.position)}
						key={`background-image-${background.name}`}
					>
						<img src={background.url} alt="" />
						{background.name}
					</button>
				);
			})}
		</div>
	);
}

export default Frottings;
