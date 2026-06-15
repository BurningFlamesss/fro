function Frowser() {
	return (
		<div className="w-full min-h-full p-4 flex flex-col items-center justify-center">
			<section className="pinned-webs flex flex-row items-center justify-between gap-2">
				{Array.from({ length: 5 }).map((element, index) => {
					return (
						<div
							key={`pinned-web-${index}`}
							className="h-16 w-16 flex flex-row items-center justify-center glassmorphism rounded-xl"
						>
							{index + 1}
						</div>
					);
				})}
			</section>
		</div>
	);
}

export default Frowser;
