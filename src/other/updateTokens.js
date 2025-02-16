import { getCookie, setCookie } from "./cookie";
import axios from "axios"
import QualifierErrors from "./_qualifierError";

export function ScheduleRefreshTokens(timerRef) {
    const accessToken = getCookie('accessTokenAdmin');
    const exp = JSON.parse(atob(accessToken.split('.')[1])).exp;
    const timeout = (exp - Math.round(Date.now() / 1000)) * 1000 - 30000;

    timerRef.current = setTimeout(() => {
        RefreshTokens(timerRef);
    }, timeout);
}

export async function RefreshTokens(timerRef) {
    const refreshToken = getCookie('refreshTokenAdmin');

    axios.post('http://127.0.0.1:3003/auth/refreshTokens', {
        refreshToken: refreshToken
    })
    .then(res => {
        setCookie('accessTokenAdmin', res.data.accessToken, {'max-age': 14400});
        setCookie('refreshTokenAdmin', res.data.refreshToken, {'max-age': 14400});
        ScheduleRefreshTokens(timerRef);
    })
    .catch(err => QualifierErrors(err));
}

export function CancelRefreshTokens(timerRef) {
    if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
    }
}