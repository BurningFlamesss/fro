import { cn } from "#/lib/utils.ts";

function Froame() {
	return (
		<div className="p-4">
			<h2 className="mb-4 text-lg font-semibold">Froame Launcher</h2>
			<div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
				<div className="flex flex-col items-center justify-center gap-y-1">
					<button
						type="button"
						className={cn(
							"group relative overflow-hidden rounded-xl transition-all cursor-pointer",
						)}
					>
						<img
							src={"/public/apps/Game.svg"}
							alt={""}
							loading="lazy"
							className="h-full w-full object-cover"
						/>
					</button>
					<div className="">
						<p className="truncate text-xs font-medium text-background">
							Froame
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Froame;
