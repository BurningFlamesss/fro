import { useEffect, useState } from "react";

function Clock() {
	const [time, setTime] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => setTime(new Date()), 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<section className="relative aspect-square max-h-full rounded-full border-4 overflow-hidden flex justify-center items-center">
			<div className="">{time.getHours()} / {time.getMinutes()} / {time.getSeconds()}</div>
            <img className="w-full h-full" src="/android-chrome-512x512.png" alt="" />
		</section>
	);
}

export default Clock;
