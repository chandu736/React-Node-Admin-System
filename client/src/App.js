import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from './components/dashboard/Dashboard';
import AdminLogin from './components/login/AdminLogin';
import ForgotPassword from './components/login/ForgetPassword';
import ResetPassword from './components/login/ResetPassword';
import EmployeeList from "./components/employees/EmployeeList";
import EmployeeDetail from "./components/employees/EmployeeDetail";
import EmployeeForm from "./components/employees/EmployeeForm";
import EditEmployee from "./components/employees/EditEmployee";
import CourseList from "./components/courses/CoursesList";
import DepartmentList from "./components/employees/DepartmentList";
import AddDepartment from "./components/employees/AddDepartment";
import CourseDetail from "./components/courses/CourseDetail";
import EditCourse from "./components/courses/EditCourse";
import AddCourse from "./components/courses/AddCourse";
import TotalEmployees from "./components/dashboard/TotalEmployees";
import TotalCourses from "./components/dashboard/TotalCourses";
import ActiveEmployees from "./components/dashboard/ActiveEmployees";
import InactiveEmployees from "./components/dashboard/InactiveEmployees";
function App() {
  return (
    <Router>
      <Routes>
        {/* Login components */}
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={< Dashboard />} />
        <Route path="/all-employees" element={<TotalEmployees />} />
        <Route path="/all-courses" element={<TotalCourses/>}/>
        <Route path="/active-employees" element={<ActiveEmployees/>} />
        <Route path="/inactive-employees" element={<InactiveEmployees/>} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Employee components */}
        <Route path="/employee-list" element={<EmployeeList />} />
        <Route path="/employee/:id" element={<EmployeeDetail />}></Route>
        <Route path="/create" element={<EmployeeForm />}></Route>
        <Route path="/edit-employee/:id" element={<EditEmployee />}></Route>
        <Route path="/departments" element={<DepartmentList />}></Route>
        <Route path="/add-department" element={<AddDepartment />}></Route>
        {/* Course components */}
        <Route path="/course-list" element={<CourseList/>}></Route>
        <Route path="/courses/:courseId" element={<CourseDetail />}/>
        <Route path="/create-course" element={<AddCourse />} />
        <Route path="/edit-course/:id" element={<EditCourse />}/>
      </Routes>
    </Router>
  );
}

export default App;