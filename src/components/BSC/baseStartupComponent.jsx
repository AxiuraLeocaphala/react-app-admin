import { useEffect, useRef } from "react";
import {useLoaderData} from "react-router-dom";

import { MainProvider } from "../context/mainContext";
import { ScheduleRefreshTokens, CancelRefreshTokens } from "../../other/updateTokens";
import { CurrentTheme } from "../../other/theme";
import { User } from "../../other/user";
import SelectWorkspace from "./selectWorkspace/selectWorkspace";

const BaseStartupComponent = () => {
    const { accessTokenAdmin } = useLoaderData();
    const timerRef = useRef();

    document.documentElement.setAttribute("data-theme", CurrentTheme());
    document.documentElement.setAttribute("user-agent", User.isMobile() ? ("phone"):("pc"));

    useEffect(() => {
        ScheduleRefreshTokens(timerRef)

        return () => {
            CancelRefreshTokens(timerRef)
        }
    }, []);

    return (
        <MainProvider url={`ws://127.0.0.1:3004/ws/adminpanel?accessToken=${accessTokenAdmin}`}>
            <SelectWorkspace/>
        </MainProvider>
    )
}

export default BaseStartupComponent; 