import { useEffect, useRef, useState } from "react";
import { PiArrowUpRight, PiMagnifyingGlassDuotone, PiX } from "react-icons/pi";
import { cn } from "#/lib/utils.ts";
import { getWeatherReport } from "#/server/getWeatherReport.tsx";

function Weather() {
	const [value, setValue] = useState("");
	const [focused, setFocused] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const submit = (text: string) => {
		const trimmed = text.trim();
		if (!trimmed) return;

		// TODO: handleSubmit

		setValue("");
		setFocused(false);
		inputRef.current?.blur();
	};

	const fetchWeather = async (city_name: string) => {
		const response = await getWeatherReport({
			data: {
				city_name: city_name,
			},
		});

		console.log("Response: ", response);
	};

	useEffect(() => {
		fetchWeather("London");
	}, []);

	return (
		<div className="p-2 min-h-full glassmorphism">
			<div className="relative z-20 flex w-full flex-row items-center justify-center">
				<div
					className={cn(
						"relative w-full transition-all duration-300",
						focused ? "max-w-xl" : "max-w-lg",
					)}
				>
					<div
						onClick={() => inputRef.current?.focus()}
						className={cn(
							"relative flex items-center gap-3 rounded-2xl border transition-all duration-300",
							"border-background/10",
							focused ? "h-12 px-5 ring-2 ring-background/20" : "h-10 px-4",
						)}
					>
						<PiMagnifyingGlassDuotone
							className="shrink-0 text-background/40"
							size={focused ? 20 : 18}
						/>

						<input
							ref={inputRef}
							value={value}
							onChange={(e) => setValue(e.target.value)}
							onFocus={() => setFocused(true)}
							onKeyDown={(e) => {
								if (e.key === "Enter") submit(value);
								if (e.key === "Escape") {
									setFocused(false);
									inputRef.current?.blur();
								}
							}}
							placeholder="Search for weather"
							className="flex-1 bg-transparent text-sm text-background outline-none placeholder:text-background/40"
						/>

						{value && (
							<button
								type="button"
								aria-label="Clear search"
								onClick={(e) => {
									e.stopPropagation();
									setValue("");
								}}
								className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-background/40 transition-colors hover:bg-background/10 hover:text-background/70"
							>
								<PiX size={12} />
							</button>
						)}
					</div>

					{focused && (
						<div className="absolute inset-x-0 top-full mt-2 overflow-hidden rounded-2xl border border-background/10 bg-foreground p-2 opacity-100">
							<ul className="flex flex-col gap-0.5">
								{["Earth"].map((suggestion) => (
									<li key={suggestion}>
										<button
											type="button"
											onClick={() => submit(suggestion)}
											className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-background/60 transition-colors hover:bg-background/5 hover:text-background"
										>
											<span className="truncate">{suggestion}</span>
											<PiArrowUpRight
												className="ml-auto shrink-0 text-background/20"
												size={14}
											/>
										</button>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>
			{focused && (
				<div
					className="absolute inset-0 z-10"
					aria-hidden="true"
					onClick={() => setFocused(false)}
				/>
			)}

			<div className="w-full h-full flex flex-col justify-center items-center py-2">
				<img className="w-36" src="/public/widgets/weather/clear.png" alt="" />
				<p className="text-5xl">26°c</p>
				<p className="text-3xl">Earth</p>

				<div className="w-full mt-8 flex justify-between">
					<div className="flex items-start gap-3 text-xl">
						<img
							className="w-6.5 mt-2.5"
							src="/public/widgets/weather/humidity.png"
							alt=""
						/>
						<div>
							<p>91 %</p>
							<span className="flex text-[16px]">Humidity</span>
						</div>
					</div>
					<div className="flex items-start gap-3 text-xl">
						<img
							className="w-6.5 mt-2.5"
							src="/public/widgets/weather/wind.png"
							alt=""
						/>
						<div>
							<p>21 km/hr</p>
							<span className="flex text-[16px]">Wind speed</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Weather;
