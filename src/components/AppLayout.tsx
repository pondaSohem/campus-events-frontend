import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AppLayout() {
  return (
    <>
      <Navbar />
      <main className="container py-4 page-shell">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
