import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import View from "./components/View/View";
import { AuthContextProvider } from "./context/AuthContext";
import AdminIndex from "./pages/Admin/Index/AdminIndex";
import Login from "./pages/Login/Login";
import StudentIndex from "./pages/Student/Index/StudentIndex";
import StudentFYPTopics from "./pages/Student/StudentFYPTopics/StudentFYPTopics";
import TopicDetail from "./pages/Student/TopicDetail/TopicDetail";
import AddTopic from "./pages/Supervisor/AddTopic/AddTopic";
import AdjustTopic from "./pages/Supervisor/AdjustTopic/AdjustTopic";
import FYPTopics from "./pages/Supervisor/FYPTopics/FYPTopics";
import SupervisorIndex from "./pages/Supervisor/Index/SupervisorIndex";

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
            <Route path="/student" element={<ProtectedRoute role={"student"}/>}>
              <Route path="" element={<View role={ "student" } element={ <StudentIndex />}/>} />
              <Route path="StudentFYPTopics" element={<View role={ "student" } element={ <StudentFYPTopics />}/>} />
              <Route path="FYPTopics/:id" element={<View role={ "student" } element={<TopicDetail/>}/>} /> 
            </Route>
            <Route path="/supervisor" element={<ProtectedRoute role={"supervisor"}/>}>
              <Route path="" element={<View role={ "supervisor" } element={ <SupervisorIndex />}/>} />
              <Route path="FYPTopics" element={<View role={ "supervisor" } element={ <FYPTopics />}/>} />
              <Route path="FYPTopics/addTopic" element={<View role={ "supervisor" } element={ <AddTopic />}/>} />
              <Route path="FYPTopics/:id" element={<View role={ "supervisor" } element={<AdjustTopic/>}/>} /> 
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </>
  );
}

export default App;
