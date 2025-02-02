import './App.css'
import Login from './Login';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Home from './Home';

function App() {


  return (
    <>
   <div>
    <BrowserRouter>
    
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/login" element={<Login />} />
    </Routes>
    
    
    </BrowserRouter>
   </div>
   
    </>
  )
}

export default App
