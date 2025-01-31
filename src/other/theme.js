import { getCookie, setCookie } from "./cookie";

export function CurrentTheme() {
    if(getCookie("theme") === "dark") {
        return "dark";
    } else {
        setCookie("theme", "light");
        return "light";
    }
} 