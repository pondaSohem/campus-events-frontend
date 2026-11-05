import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventNew from "./pages/EventNew";
import EventDetails from "./pages/EventDetails";
import EventEdit from "./pages/EventEdit";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/new" element={<EventNew />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/events/:id/edit" element={<EventEdit />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
