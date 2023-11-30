import { Routes, Route } from "react-router-dom";
import Main from "./containers/Main.jsx";
import Module from "./pages/Module.jsx";

function App() {
  return (
    <div className="app_app">
      <Routes>
        <Route path='/*' element={<Main />} />
        <Route path='/module/*' element={<Module />} />
      </Routes>
    </div>
  );
}

export default App;