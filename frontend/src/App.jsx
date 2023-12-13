import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import { RegisterDefect } from "./pages/RegisterDefect";
import { ManageDefects } from "./pages/ManageDefects";
import { MyDefects } from "./pages/MyDefects";
import { HomePage } from "./pages/HomePage";
import { Register } from "./pages/Register";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-defect" element={<RegisterDefect />} />
        <Route path="/manage-defects" element={<ManageDefects />} />
        <Route path="/my-defects" element={<MyDefects />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
