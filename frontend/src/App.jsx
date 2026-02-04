import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from "./Components/layout/Navbar";
import AppRouter from "./Routes/AppRouter";
import LoginModal from "./Components/layout/LoginModal";

function App() {
  return (
    <>
      <Navbar />
      <LoginModal />

      <main className="app-content">
        <AppRouter />
      </main>
    </>
  );
}

export default App;
