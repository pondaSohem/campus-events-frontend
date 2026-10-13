import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Events from "./pages/Events";
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <h2>Welcome to CampusEvents</h2>
        <Events />
      </main>
      <Footer />
    </>
  );
}

export default App;
