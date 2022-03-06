import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import View from "./components/View/View";
import { AuthContextProvider } from "./context/AuthContext";
import AdminIndex from "./pages/Admin/Index/AdminIndex";
import Login from "./pages/Login/Login";
import StudentIndex from "./pages/Student/Index/StudentIndex";
import StudentFYPTopics from "./pages/Student/FYPTopics/StudentFYPTopics/StudentFYPTopics";
import StudentTopicDetail from "./pages/Student/FYPTopics/StudentTopicDetail/StudentTopicDetail";
import SupervisorAddTopic from "./pages/Supervisor/FYPTopics/SupervisorAddTopic/SupervisorAddTopic";
import SupervisorTopicDetail from "./pages/Supervisor/FYPTopics/SupervisorTopicDetail/SupervisorTopicDetail";
import SupervisorFYPTopics from "./pages/Supervisor/FYPTopics/SupervisorFYPTopics/SupervisorFYPTopics";
import SupervisorIndex from "./pages/Supervisor/Index/SupervisorIndex";
import SupervisorGroup from "./pages/Supervisor/GroupManagement/SupervisorGroup/SupervisorGroup";
import SupervisorGroupManage from "./pages/Supervisor/GroupManagement/SupervisorGroupManage/SupervisorGroupManage";
import CreateUsers from "./pages/Admin/CreateUsers/CreateUsers";
import AdminCreatePeerReview from "./pages/Admin/AdminPeerReview/AdminCreatePeerReview/AdminCreatePeerReview";
import AdminEditPeerReview from "./pages/Admin/AdminPeerReview/AdminEditPeerReview/AdminEditPeerReview";
import AdminViewPeerReview from "./pages/Admin/AdminPeerReview/AdminViewPeerReview/AdminViewPeerReview";
import StudentViewPeerReview from "./pages/Student/StudentPeerReview/StudentViewPeerReview/StudentViewPeerReview";
import StudentEditPeerReview from "./pages/Student/StudentPeerReview/StudentEditPeerReview/StudentEditPeerReview";
import SupervisorViewSpecificPeerReview from "./pages/Supervisor/SupervisorPeerReview/SupervisorViewSpecificPeerReview/SupervisorViewSpecificPeerReview";
import SupervisorViewPeerReview from "./pages/Supervisor/SupervisorPeerReview/SupervisorViewPeerReview/SupervisorViewPeerReview";

function App() {
  return (
    <>
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute role={"admin"}/>}>
              <Route path="" element={<View role={ "admin" } element={ <AdminIndex />}/>} />
              <Route path="CreateUsers" element={<View role={ "admin" } element={ <CreateUsers />}/>} />
              <Route path="PeerReview" element={<View role={ "admin" } element={ <AdminViewPeerReview />}/>} />
              <Route path="EditPeerReview" element={<View role={ "admin" } element={ <AdminEditPeerReview />}/>} />
              <Route path="CreatePeerReview" element={<View role={ "admin" } element={ <AdminCreatePeerReview />}/>} />
              <Route path="EditPeerReview/:id" element={<View role={ "admin" } element={ <AdminEditPeerReview />}/>} />
            </Route>
            <Route path="/student" element={<ProtectedRoute role={"student"}/>}>
              <Route path="" element={<View role={ "student" } element={ <StudentIndex />}/>} />
              <Route path="FYPTopics" element={<View role={ "student" } element={ <StudentFYPTopics />}/>} />
              <Route path="FYPTopics/:id" element={<View role={ "student" } element={<StudentTopicDetail/>}/>} /> 
              <Route path="PeerReview" element={<View role={ "student" } element={<StudentViewPeerReview/>}/>} /> 
              <Route path="EditPeerReview/:id" element={<View role={ "student" } element={<StudentEditPeerReview/>}/>} /> 
            </Route>
            <Route path="/supervisor" element={<ProtectedRoute role={"supervisor"}/>}>
              <Route path="" element={<View role={ "supervisor" } element={ <SupervisorIndex />}/>} />
              <Route path="FYPTopics" element={<View role={ "supervisor" } element={ <SupervisorFYPTopics />}/>} />
              <Route path="FYPTopics/addTopic" element={<View role={ "supervisor" } element={ <SupervisorAddTopic />}/>} />
              <Route path="FYPTopics/:id" element={<View role={ "supervisor" } element={<SupervisorTopicDetail/>}/>} /> 
              <Route path="Groups" element={<View role={ "supervisor" } element={<SupervisorGroup/>}/>} />
              <Route path="Groups/:id" element={<View role={ "supervisor" } element={<SupervisorGroupManage/>}/>} /> 
              <Route path="PeerReview" element={<View role={ "supervisor" } element={<SupervisorViewPeerReview/>}/>} /> 
              <Route path="PeerReview/:id" element={<View role={ "supervisor" } element={<SupervisorViewSpecificPeerReview/>}/>} /> 
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </>
  );
}

export default App;
