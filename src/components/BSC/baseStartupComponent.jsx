import {useLoaderData} from "react-router-dom";
import {VisibilityProvider} from "../orderADelivery/button/other/context";
import { WebSocketProvider } from '../../ws/wsContextAdminPanel';
import AdminPanel from '../adminpanel/adminpanel';

const BaseStartupComponent = () => {
    const {accessToken} = useLoaderData();

    return (
        <WebSocketProvider url={`ws://127.0.0.1:3004/ws/adminpanel?accessToken=${accessToken}`}>
				<VisibilityProvider>
					<AdminPanel/>
				</VisibilityProvider>
			</WebSocketProvider>
    )
}

export default BaseStartupComponent; 