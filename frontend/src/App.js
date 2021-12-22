import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import View from "./components/View/View";
import { AuthContextProvider } from "./context/AuthContext";
import AdminIndex from "./pages/Admin/Index/AdminIndex";
import Login from "./pages/Login/Login";

function App() {
  return (
    <>
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute role={"admin"}/>}>
              <Route path="" element={<View role={ "admin" } element={ <AdminIndex />}/>} />
              <Route path="test" element= {<div>Test</div>}/>
            </Route>
            <Route element={<ProtectedRoute role={"student"}/>}>
              <Route path="/student" element={<AdminIndex/>} />
            </Route>
            <Route element={<ProtectedRoute role={"supervisor"}/>}>
              <Route path="/supervisor" element={<AdminIndex/>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </>
  );
}

export default App;
