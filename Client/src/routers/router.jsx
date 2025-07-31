import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "../App";
import Home from "../home/Home";
import Shop from "../shop/Shop";
import About from "../components/About";
import Blog from "../components/Blog";
import SingleBook from "../components/SingleBook";
import Signup from "../components/Signup";
import Login from "../components/Login";
import Cart from "../components/Cart";
import Profile from "../components/Profile";
import Orders from "../components/Orders";
import OrderDetails from "../components/OrderDetails";
import Checkout from "../components/Checkout";
import SellerDashboard from "../components/SellerDashboard";
import AdminDashboard from "../components/AdminDashboard";
import PrivateRoute, { AdminRoute, SellerRoute, CustomerRoute } from "../components/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children:[
      {
        path:'/',
        element:<Home/>
      },
      {
        path:'/shop',
        element:<Shop/>
      },
      {
        path:'/about',
        element:<About/>
      },
      {
        path:'/blog',
        element:<Blog/>
      },
      {
        path:'/book/:id',
        element:<SingleBook/>
      },
      {
        path:'/cart',
        element:<CustomerRoute><Cart/></CustomerRoute>
      },
      {
        path:'/dashboard',
        element:<SellerRoute><SellerDashboard/></SellerRoute>
      },
      {
        path:'/admin',
        element:<AdminRoute><AdminDashboard/></AdminRoute>
      },
      {
        path:'/profile',
        element:<PrivateRoute><Profile/></PrivateRoute>
      },
      {
        path:'/orders',
        element:<CustomerRoute><Orders/></CustomerRoute>
      },
      {
        path:'/order/:id',
        element:<CustomerRoute><OrderDetails/></CustomerRoute>
      },
      {
        path:'/checkout',
        element:<CustomerRoute><Checkout/></CustomerRoute>
      }
    ]
  },
  {
    path:"/sign-up",
    element: <Signup/>
  },
  {
    path:"/login",
    element:<Login/>
  }
]);

export default router;