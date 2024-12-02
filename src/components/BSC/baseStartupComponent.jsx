import {useLoaderData} from "react-router-dom";
import { MainProvider } from "../../other/mainContext";
import AdminPanel from '../adminpanel/adminpanel';

const BaseStartupComponent = () => {
    const {accessTokenAdmin} = useLoaderData();

    return (
        <MainProvider url={`ws://127.0.0.1:3004/ws/adminpanel?accessToken=${accessTokenAdmin}`}>
                <AdminPanel/>
        </MainProvider>
    )
}

export default BaseStartupComponent; 