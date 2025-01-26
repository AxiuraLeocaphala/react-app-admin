import {useLoaderData} from "react-router-dom";
import { MainProvider } from "../../other/mainContext";
import { currentTheme } from "../../other/them";
import { User } from "../../other/user";
import AdminPanel from '../adminpanel/adminpanel';

const BaseStartupComponent = () => {
    const {accessTokenAdmin} = useLoaderData();
    document.documentElement.setAttribute("data-theme", currentTheme());
    document.documentElement.setAttribute("user-agent", User.isMobile() ? ("phone"):("pc"));

    return (
        <MainProvider url={`ws://127.0.0.1:3004/ws/adminpanel?accessToken=${accessTokenAdmin}`}>
                <AdminPanel/>
        </MainProvider>
    )
}

export default BaseStartupComponent; 