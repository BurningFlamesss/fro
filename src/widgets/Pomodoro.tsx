import { useState } from "react";

// import frokSound from "../../public/widgets/pomodoro/frok.mp3"

const cheerMessages = [
    "You can do it!",
    "I believe in you",
    "You're amazing",
    "Keep going",
    "Stay Frokused"
]

const breakMessages = [
    "Stay Hydrated!",
    "Eat some frogs, maybe?",
    "Stretch you arms",
    "Touch some grass",
    "Walk 100 meters"
]

function Pomodoro() {
	const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
	const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isBreak, setIsBreak] = useState<boolean>(false);
    const frokAudio = new Audio("../../public/widgets/pomodoro/frok.mp3")
    

	return (
		<div>
			<div>
				<button type="button">
					<img src="" alt="" />
				</button>
				<button type="button">
					<img src="" alt="" />
				</button>
			</div>
			<p></p>
			<h1>{timeLeft}</h1>
			<img src="" alt="" />
			<button type="button">
				<img src="" alt="" />
			</button>
		</div>
	);
}

export default Pomodoro;
