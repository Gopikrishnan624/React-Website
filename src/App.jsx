import './App.css'

import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Home from './Home';
import Service from './Service';
import './Service.css'
import Dish from './Dish';



function App() {


  return (
    <>
   <div>
    <BrowserRouter>
    
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/service" element={<Service />} />
      <Route path="/dish" element={<Dish />} />
    </Routes>
    
    
    </BrowserRouter>
   </div>
   
    </>
  )
}

export default App
