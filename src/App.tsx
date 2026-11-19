import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import EventNew from "./pages/EventNew";
import EventEdit from "./pages/EventEdit";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";
import AdminBookings from "./pages/AdminBookings";
import CategoriesAdmin from "./pages/CategoriesAdmin";
import RolesAdmin from "./pages/RolesAdmin";
import AdminDashboard from "./pages/AdminDashboard";
export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <RequireAuth admin>
              <AdminDashboard />
            </RequireAuth>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/events/new"
          element={
            <RequireAuth admin>
              <EventNew />
            </RequireAuth>
          }
        />
        <Route
          path="/events/:id/edit"
          element={
            <RequireAuth admin>
              <EventEdit />
            </RequireAuth>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <RequireAuth>
              <MyBookings />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <RequireAuth admin>
              <AdminBookings />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <RequireAuth admin>
              <CategoriesAdmin />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/roles"
          element={
            <RequireAuth admin>
              <RolesAdmin />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
