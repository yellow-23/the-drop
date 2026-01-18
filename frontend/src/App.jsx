import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from "./Components/layout/Navbar";
import AppRouter from "./Routes/AppRouter";

function App() {
  return (
    <>
      <Navbar />

      <main className="app-content">
        <AppRouter />
      </main>
    </>
  );
}

export default App;
