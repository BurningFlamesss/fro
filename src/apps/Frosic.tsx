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
		<div className="w-74 flex flex-row items-center justify-between">
			<FaRepeat />
			<FaBackwardFast />
			{state === "play" ? <FaPlay /> : <FaPause />}
			<FaForwardFast />
			<FaMusic />
		</div>
	);
}

export default Frosic;
