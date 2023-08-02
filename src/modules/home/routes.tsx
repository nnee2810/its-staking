import HomeLayout from "layouts/home"
import { RouteObject } from "react-router-dom"
import Home from "./pages/Home"

export const homeRoutes: RouteObject = {
  path: "",
  element: <HomeLayout />,
  children: [
    {
      path: "",
      element: <Home />,
    },
  ],
}
