import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "../App";
import Home from "../home/Home";
import Shop from "../shop/Shop";
import About from "../components/About";
import Blog from "../components/Blog";
import SingleBook from "../shop/SingleBook";
import Signup from "../components/Signup";
import Login from "../components/Login";
import Cart from "../components/Cart";
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
        element:<SingleBook/>,
        loader:({params}) => fetch(`http://localhost:5001/api/books/${params.id}`)
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
        element:<PrivateRoute><div>Profile Component (To be implemented)</div></PrivateRoute>
      },
      {
        path:'/orders',
        element:<CustomerRoute><div>Orders Component (To be implemented)</div></CustomerRoute>
      },
      {
        path:'/order/:id',
        element:<CustomerRoute><div>Order Details Component (To be implemented)</div></CustomerRoute>
      },
      {
        path:'/checkout',
        element:<CustomerRoute><div>Checkout Component (To be implemented)</div></CustomerRoute>
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