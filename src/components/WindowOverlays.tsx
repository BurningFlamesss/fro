import React from "react";
import { useWindowStore } from "#/store/window.tsx";
import Window from "./Window";

function WindowOverlays() {
    const { windows, apps } = useWindowStore()
    
	return (
        <main className="absolute">
            {
                windows ? Object.entries(windows).map(([key, win]) => {

                    return (
                        <Window key={key} win={win} apps={apps} />
                    )
                }) : null
            }
        </main>
    );
}

export default WindowOverlays;
