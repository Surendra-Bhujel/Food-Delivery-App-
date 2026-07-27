import { Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import SignIn from './pages/SignIn';
export const serverUrl="http://localhost/5000" 

const App = () => {
  return (
    <Routes>
      <Route path='/register' element={<Register/>}/>
      <Route path='/signin' element={<SignIn/>}/>
    </Routes>
  )
}

export default App