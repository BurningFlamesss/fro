import { useSettingStore } from "#/store/setting.tsx";

const backgrounds = [
	{ name: "bar-and-man", url: "/backgrounds/bar-and-man.gif" },
	{ name: "bar", url: "/backgrounds/bar.gif" },
	{ name: "bird", url: "/backgrounds/bird.gif" },
	{ name: "calm-sunset", url: "/backgrounds/calm-sunset.gif" },
	{ name: "coffee-and-cat", url: "/backgrounds/coffee-and-cat.gif" },
	{
		name: "cozy-home-environment",
		url: "/backgrounds/cozy-home-environment.gif",
	},
	{ name: "cyber-rain", url: "/backgrounds/cyber-rain.gif" },
	{ name: "fantastic-man", url: "/backgrounds/fantastic-man.gif" },
	{ name: "flooded", url: "/backgrounds/flooded.gif" },
	{ name: "forest", url: "/backgrounds/forest.gif" },
	{ name: "gardening", url: "/backgrounds/gardening.gif" },
	{ name: "landscape", url: "/backgrounds/landscape.gif" },
	{ name: "metro", url: "/backgrounds/metro.gif" },
	{ name: "near-night", url: "/backgrounds/near-night.gif" },
	{
		name: "night-in-future-town",
		url: "/backgrounds/night-in-future-town.gif",
	},
	{ name: "old-temple", url: "/backgrounds/old-temple.gif" },
	{ name: "people-moving", url: "/backgrounds/people-moving.gif" },
	{ name: "rain-mode", url: "/backgrounds/rain-mode.gif" },
	{ name: "relaxing-tea", url: "/backgrounds/relaxing-tea.gif" },
	{ name: "tree-house", url: "/backgrounds/tree-house.gif" },
];

function Frottings() {
	const { setBackgroundImage } = useSettingStore();
	return (
		<div>
			{backgrounds.map((background) => {
				return (
					<button
						onClick={() => setBackgroundImage(background.url)}
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
