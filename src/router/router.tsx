import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/login.page";
import NotFoundPage from "../pages/404.page";
import HomePage from "../pages/home.page";
import RegisterPage from "../pages/register.page";

export default function Routers() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}
