import { useState } from "react";

function Pomodoro() {
	const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
	const [isRunning, setIsRunning] = useState<boolean>(false);

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
