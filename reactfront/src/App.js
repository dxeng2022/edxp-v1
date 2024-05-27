import { Routes, Route, Navigate } from "react-router-dom";
import Main from "./containers/Main.jsx";
import Module from "./containers/Module.jsx"
import { useSelector } from 'react-redux';
import {createTheme, ThemeProvider} from '@mui/material';

const theme = createTheme({
  typography: {
    fontFamily: "'Noto Sans KR', sans-serif"
  },
})

function App() {

  const userLoginAuth = useSelector(state => state.userLoginAuth);
  const RedirectToHomeIfNoUserInfo = ({ children }) => {
    return userLoginAuth.auth === true ? children : <Navigate to="/" />;
  };

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path='/*' element={<Main />} />
        <Route path='/module/*' element={
          <RedirectToHomeIfNoUserInfo>
            <Module />
          </RedirectToHomeIfNoUserInfo>
        } />
      </Routes>
    </ThemeProvider>
  );
}

export default App;