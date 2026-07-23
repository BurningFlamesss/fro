import { useState } from "react";

// import frokSound from "../../public/widgets/pomodoro/frok.mp3"

const cheerMessages = [
	"You can do it!",
	"I believe in you",
	"You're amazing",
	"Keep going",
	"Stay Frokused",
];

const breakMessages = [
	"Stay Hydrated!",
	"Eat some frogs, maybe?",
	"Stretch you arms",
	"Touch some grass",
	"Walk 100 meters",
];

const formatTime = (seconds: number): string => {
	const minute = Math.floor(seconds / 60)
		.toString()
		.padStart(2, "0");

	const second = (seconds % 60).toString().padStart(2, "0");
	return `${minute}:${second}`;
};

function Pomodoro() {
	const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
	const [isRunning, setIsRunning] = useState<boolean>(false);
	const [isBreak, setIsBreak] = useState<boolean>(false);
	const [encouragement, setEncouragement] = useState<string>("");
	const frokAudio = new Audio("../../public/widgets/pomodoro/frok.mp3");

	const switchMode = (breakMode: boolean) => {
		setIsBreak(breakMode);
		setIsRunning(false);

		setTimeLeft(breakMode ? 5 * 60 : 25 * 60);
	};

	return (
		<div className="flex flex-col items-center justify-between w-full min-h-full py-4 box-border">
			<div className="flex justify-center m-0">
				<button
					className="bg-none border-none cursor-pointer"
					type="button"
					onClick={() => switchMode(false)}
				>
					<img src="" alt="Work" />
				</button>
				<button
					className="bg-none border-none cursor-pointer"
					type="button"
					onClick={() => switchMode(true)}
				>
					<img src="" alt="Break" />
				</button>
			</div>

			<p className="text-2xl mb-2">{encouragement}</p>

			<h1 className="text-6xl m-0">{formatTime(timeLeft)}</h1>

			<img src="" className="h-25" alt="Timer Status" />

			<button type="button" className="bg-none border-none cursor-pointer">
				<img src="" className="w-15" alt="Button" />
			</button>
		</div>
	);
}

export default Pomodoro;
