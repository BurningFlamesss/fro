import { getDateTime } from "#/lib/utils.ts";
import { useEffect, useState } from "react";
import { FaBatteryThreeQuarters, FaWifi } from "react-icons/fa6";
import { HiSpeakerWave } from "react-icons/hi2";

function BottomBar() {
    const [dateTimeData, setDateTimeData] = useState(() => getDateTime())

    useEffect(() => {
        const timer = setInterval(() => {
            setDateTimeData(() => getDateTime())
        }, 60_000);

        return () => clearInterval(timer)
    }, [])

	return (
		<footer className="glassmorphism h-16 w-[80dvw] flex flex-row items-center justify-between p-2 absolute bottom-2 left-1/2 -translate-x-1/2 rounded-xl">
			<section></section>
			<section></section>
			<section className="h-full flex flex-row gap-4 items-center justify-center">
				<div className="stats-panel flex flex-row items-center justify-center gap-2">
					<FaWifi />
					<HiSpeakerWave />
					<FaBatteryThreeQuarters />
				</div>
                <div className="date-panel flex flex-col items-center justify-start">
                    <p>{dateTimeData.time}</p>
                    <p>{dateTimeData.date}</p>
                </div>
			</section>
		</footer>
	);
}

export default BottomBar;
