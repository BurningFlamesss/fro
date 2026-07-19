import { useEffect, useState } from "react";

function Clock() {
	const [time, setTime] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => setTime(new Date()), 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<section className="relative aspect-square max-h-full rounded-full border-4 overflow-hidden flex justify-center items-center">
            <img className="z-1 absolute top-0 right-0 w-full h-full scale-110 opacity-60" src="/android-chrome-512x512.png" alt="" />
			<div className="z-2 font-black text-xl text-white">{time.getHours() % 12} / {time.getMinutes()} / {time.getSeconds()} {time.getHours() > 12 ? "PM" : "AM"}</div>
		</section>
	);
}

export default Clock;
