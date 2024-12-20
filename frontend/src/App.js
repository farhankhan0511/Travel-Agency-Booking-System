
import { Provider } from 'react-redux';
import './App.css';

import appstore from './utils/appstore';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Body from './components/Body';
import Browse from './components/Browse';
import Tourbook from './components/Tourbook';


const App=()=>{
  return <div className=' bg-gray-900 h-screen'>
     <Provider store={appstore}>
     <Header></Header>
     
     <Outlet/>
     
     </Provider>

  </div>
}


export const appRouter=createBrowserRouter([
  {path:"/",
    element:<App/>,
    children:[ 
      {path:"/",
        element:<Navigate to="/browse"/>},
      {path:"/signin",
      element:<Login/>
      
    },
    {path:"/browse",
      element:<Browse/>      
    },
    {
      path:"/book/:id",
      element:<Tourbook/>
    }
  ]
  //   {
  //     path:"/Contact",
  //     element:<Contact/>
  //   },
  //   {
  //     path:"/admin",
  //     element:<Admin/>,
  //     children:[
  //       {
  //         path:"/:id",
  //         element:<Tourmanage/>
  //       }
  //     ]
        
    
  //   },{
  //     path:"/bookings/:id",
  //     element:<Restaurantfullmenu/>
    
  //   },
  // ], 
  //   errorElement:<Error/>
  //
   }
 

])


export default App;
