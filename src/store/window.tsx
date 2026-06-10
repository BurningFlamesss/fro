import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Windows } from "../constants";

export const useWindowStore = create(
    immer((set) => ({
        windows: Windows
    }))
)