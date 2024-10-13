import { getCookie, setCookie } from "./cookie";

export function currentThem() {
    if(getCookie("them") === "light") {
        return "light";
    } else {
        setCookie("dark", "dark");
        return "dark";
    }
} 