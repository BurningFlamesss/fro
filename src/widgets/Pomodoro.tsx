import { useEffect, useRef, useState } from "react";
import { cn } from "#/lib/utils.ts";
import breakGif from "../../public/widgets/pomodoro/break.gif";
import breakBtn from "../../public/widgets/pomodoro/break.png";
import breakBtnClicked from "../../public/widgets/pomodoro/break-clicked.png";
import frokSound from "../../public/widgets/pomodoro/frok.mp3";
import idleGif from "../../public/widgets/pomodoro/idle.gif";
import playImg from "../../public/widgets/pomodoro/play.png";
import resetImg from "../../public/widgets/pomodoro/reset.png";
import workGif from "../../public/widgets/pomodoro/work.gif";
import workBtn from "../../public/widgets/pomodoro/work.png";
import workBtnClicked from "../../public/widgets/pomodoro/work-clicked.png";

const cheerMessages = [
	"Stay Frokused",
	"You can do it!",
	"Fro believe in you",
	"You're amazing",
	"Keep Froking",
];

const breakMessages = [
	"Stay Hydrated!",
	"Eat some frogs?",
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

	const [breakButtonImage, setBreakButtonImage] = useState(breakBtn);
	const [workButtonImage, setWorkButtonImage] = useState(workBtn);
	const [image, setImage] = useState(playImg);
	const [gifImage, setGifImage] = useState(idleGif);

	const frokAudioRef = useRef<HTMLAudioElement | null>(null);
	const endTimeRef = useRef<number>(0);
	const animationFrameRef = useRef<number>(0);
	const totalDurationRef = useRef<number>(25 * 60);

	useEffect(() => {
		frokAudioRef.current = new Audio(frokSound);

		return () => {
			if (frokAudioRef.current) {
				frokAudioRef.current.pause();
				frokAudioRef.current = null;
			}
		};
	}, []);

	useEffect(() => {
		let messageInterval: NodeJS.Timeout;

		if (isRunning) {
			const messages = isBreak ? breakMessages : cheerMessages;
			setEncouragement(messages[0]);
			let index = 1;

			messageInterval = setInterval(() => {
				setEncouragement(messages[index]);
				index = (index + 1) % messages.length;
			}, 4000);
		} else {
			setEncouragement("");
		}

		return () => clearInterval(messageInterval);
	}, [isRunning, isBreak]);

	useEffect(() => {
		if (!isRunning) {
			cancelAnimationFrame(animationFrameRef.current);
			return;
		}

		const updateTimer = () => {
			const now = Date.now();
			const remaining = Math.max(
				0,
				Math.ceil((endTimeRef.current - now) / 1000),
			);

			setTimeLeft((prev) => {
				if (remaining !== prev) return remaining;

				return prev;
			});

			if (remaining > 0) {
				animationFrameRef.current = requestAnimationFrame(updateTimer);
			} else {
				setIsRunning(false);
				setImage(playImg);
				setGifImage(idleGif);
				setTimeLeft(totalDurationRef.current);

				frokAudioRef.current?.play().catch(() => {});
			}
		};

		const remainingSeconds = timeLeft;

		endTimeRef.current = Date.now() + remainingSeconds * 1000;
		animationFrameRef.current = requestAnimationFrame(updateTimer);

		return () => cancelAnimationFrame(animationFrameRef.current);
	}, [isRunning]);

	const switchMode = (breakMode: boolean) => {
		setIsBreak(breakMode);
		setIsRunning(false);

		setBreakButtonImage(breakMode ? breakBtnClicked : breakBtn);
		setWorkButtonImage(breakMode ? workBtn : workBtnClicked);
		setGifImage(idleGif);
		setImage(playImg);

		const newDuration = breakMode ? 5 * 60 : 25 * 60;
		totalDurationRef.current = newDuration;
		setTimeLeft(newDuration);
	};

	const handleClick = () => {
		if (!isRunning) {
			setIsRunning(true);
			setGifImage(isBreak ? breakGif : workGif);
			setImage(resetImg);
		} else {
			setIsRunning(false);
			setGifImage(idleGif);
			setImage(playImg);
		}
	};

	return (
		<main
			className="w-full min-h-full flex items-center justify-center box-border text-center retro-font"
			style={{
				backgroundImage: `url("../../widgets/pomodoro/background.png")`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<div className="flex flex-col items-center justify-between w-full h-full py-4 px-2 box-border">
				<div className="flex justify-center m-0 gap-2">
					<button
						className="bg-none border-none cursor-pointer"
						type="button"
						onClick={() => switchMode(false)}
					>
						<img src={workButtonImage} alt="Work" />
					</button>
					<button
						className="bg-none border-none cursor-pointer"
						type="button"
						onClick={() => switchMode(true)}
					>
						<img src={breakButtonImage} alt="Break" />
					</button>
				</div>

				<p
					className={cn(
						"text-2xl my-3 opacity-80 transition-all duration-800",
						!isRunning ? "opacity-0" : "",
					)}
				>
					{encouragement}
				</p>

				<h1 className="text-6xl m-0">{formatTime(timeLeft)}</h1>

				<img src={gifImage} className="h-25" alt="Timer Status" />

				<button
					onClick={handleClick}
					type="button"
					className="bg-none border-none cursor-pointer"
				>
					<img src={image} className="w-15" alt="Button" />
				</button>
			</div>
		</main>
	);
}

export default Pomodoro;
