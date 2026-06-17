import { useState } from "react";
import {
	FaBackwardFast,
	FaForwardFast,
	FaMusic,
	FaPause,
	FaPlay,
	FaRepeat,
} from "react-icons/fa6";

function Frosic() {
	const [musicNumber, setMusicNumber] = useState<number>(0);
	const [state, setState] = useState<"play" | "pause">("play");
	const [open, setOpen] = useState<boolean>(false);

	return (
		<main className="min-h-full w-full flex flex-col items-center justify-between p-4">
            <div className="h-full w-full rounded-xl">
                <img src="/public/backgrounds/previews/calm-and-peaceful.webp" alt="" />
            </div>
			<div className="w-70 flex flex-row items-center justify-between">
				<FaRepeat />
				<FaBackwardFast />
				{state === "play" ? <FaPlay /> : <FaPause />}
				<FaForwardFast />
				<FaMusic />
			</div>
		</main>
	);
}

export default Frosic;
