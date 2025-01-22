import { getCookie, setCookie } from "./cookie";

export function currentTheme() {
    if(getCookie("them") === "light") {
        return "light";
    } else {
        setCookie("dark", "dark");
        return "dark";
    }
} 