import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom';
import Authenticate from './components/authenticate/authenticate';
import AdminPanel from './components/adminpanel/adminpanel';
import ErrorElement from './components/ErrorElement/ErrorElement';
import { getCookie, setCookie } from './other/cookie';
import "./App.css";

const router = createBrowserRouter([
	{
		path: '/authenticate',
		element: <Authenticate/>,
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
		element: <AdminPanel/>,
		errorElement: <ErrorElement/>,
		loader: async () => {
			if (!getCookie('accessToken') && !getCookie('refreshToken')) {
				return redirect("/authenticate")
			} else {
				return null;
			}
		}
	}
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<RouterProvider router={router}/>
	</React.StrictMode>
);