import { useEffect, useRef } from "react";
import {useLoaderData} from "react-router-dom";

import { MainProvider } from "./../../context/mainContext.js";
import { ScheduleRefreshTokens, CancelRefreshTokens } from "./../../utils/updateTokens.js";
import { CurrentTheme } from "./../../utils/theme.js";
import { User } from "./../../utils/user.js";
import SelectWorkspace from "./selectWorkspace.jsx";

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