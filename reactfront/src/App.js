import { Routes, Route } from "react-router-dom";
import Main from "./pages/Main.jsx";
import Footer from "./pages/Footer.jsx";
import Sign from "./pages/Sign.jsx";
import Module from "./pages/Module.jsx";

function App() {
  return (
    <div className="app_app">
      <Routes>
        <Route path='/*' element={<Main />} />
        <Route path='/sign/*' element={<Sign />} />
        <Route path='/module/*' element={<Module />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;