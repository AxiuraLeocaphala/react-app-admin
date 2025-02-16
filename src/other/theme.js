import { getCookie, setCookie } from "./cookie";

export function CurrentTheme() {
    if(getCookie("theme") === "light") {
        return "light";
    } else {
        setCookie("theme", "dark");
        return "dark";
    }
}