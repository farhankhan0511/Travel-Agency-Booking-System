
import { Provider } from 'react-redux';
import './App.css';

import appstore from './utils/appstore';




export const appRouter=createBrowserRouter([
  {path:"/",
    element:<Applayout/>,
    children:[ 
      {path:"/",
        element:<Body/>},
      {path:"/About",
      element:<About/>
      
    },
    {
      path:"/Contact",
      element:<Contact/>
    },
    {
      path:"/admin",
      element:<Admin/>,
      children:[
        {
          path:"/:id",
          element:<Tourmanage/>
        }
      ]
        
    
    },{
      path:"/bookings/:id",
      element:<Restaurantfullmenu/>
    
    },
  ], 
    errorElement:<Error/>
  }
 

])



function App() {
  return <Provider store={appstore}>
    
  
</Provider>;
}

export default App;
