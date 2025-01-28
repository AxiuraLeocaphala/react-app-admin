import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom';
import Authenticate from './components/authenticate/authenticate';
import ErrorElement from './components/ErrorElement/ErrorElement';
import BaseStartupComponent from './components/BSC/baseStartupComponent';
import { getCookie } from './other/cookie';
import { MainProvider } from './components/context/mainContext';
import "./App.css";

const router = createBrowserRouter([
	{
		path: '/authenticate',
		element:
			<MainProvider url="ws://127.0.0.1:3003/auth/admin/authenticate">
				<Authenticate/>
			</MainProvider>,
		errorElement: <ErrorElement/>,
		loader: async () => {
			if (getCookie("accessTokenAdmin") && getCookie("refreshTokenAdmin")) {
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
			const accessTokenAdmin = getCookie('accessTokenAdmin');
			const refreshTokenAdmin = getCookie('refreshTokenAdmin');

			if (!accessTokenAdmin && !refreshTokenAdmin) {
				return redirect("/authenticate")
			} else {
				return {accessTokenAdmin};
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