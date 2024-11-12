import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom';
import Authenticate from './components/authenticate/authenticate';
import ErrorElement from './components/ErrorElement/ErrorElement';
import BaseStartupComponent from './components/BSC/baseStartupComponent';
import { getCookie } from './other/cookie';
import { WebSocketProvider } from './ws/wsContextAdminPanel';
import "./App.css";

const router = createBrowserRouter([
	{
		path: '/authenticate',
		element:
			<WebSocketProvider url="ws://127.0.0.1:3003/auth/admin/authenticate">
				<Authenticate/>
			</WebSocketProvider>,
		errorElement: <ErrorElement/>,
		loader: async () => {
			if (getCookie("accessToken") && getCookie("refreshToken")) {
				return redirect("/adminpanel")
			} else {
				return null;
			}
		}
	},
	{
		path: "/adminpanel",
		element: <BaseStartupComponent/>,
		errorElement: <ErrorElement/>,
		loader: async () => {
			const accessToken = getCookie('accessToken');
			const refreshToken = getCookie('refreshToken');

			if (!accessToken && !refreshToken) {
				return redirect("/authenticate")
			} else {
				return {accessToken};
			}
		}
	}
	],{
		basename: "/meridian/admin"
	}
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<RouterProvider router={router}/>
	</React.StrictMode>
);