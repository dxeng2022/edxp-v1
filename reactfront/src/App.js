import { Routes, Route, Navigate } from "react-router-dom";
import Main from "./containers/Main.jsx";
import Module from "./containers/Module.jsx"
import { useSelector } from 'react-redux';

function App() {

  const userLoginAuth = useSelector(state => state.userLoginAuth);
  const RedirectToHomeIfNoUserInfo = ({ children }) => {
    return userLoginAuth.auth === true ? children : <Navigate to="/" />;
  };
  
  return (
    <div>
      <Routes>
        <Route path='/*' element={<Main />} />
        <Route path='/module/*' element={
          <RedirectToHomeIfNoUserInfo>
            <Module />
          </RedirectToHomeIfNoUserInfo>
        } />
      </Routes>
    </div>
  );
}

export default App;