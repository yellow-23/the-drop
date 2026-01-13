import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from "./Components/Navbar";
import AppRouter from "./Routes/AppRouter";

function App() {
  return (
    <>
      <Navbar />

      <main style={{ paddingTop: "56px" }}>
        <AppRouter />
      </main>
    </>
  );
}

export default App;
