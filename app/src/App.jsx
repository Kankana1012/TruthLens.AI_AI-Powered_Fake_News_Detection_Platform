import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Layout from "./components/layout/Layout";
import useTheme from "./hooks/useTheme";

import Home from "./pages/Home";
import DetectNews from "./pages/DetectNews";
import CompareModels from "./pages/CompareModels";
import Analytics from "./pages/Analytics";
import History from "./pages/History";
import Developer from "./pages/Developer";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <Layout theme={theme} toggleTheme={toggleTheme}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detect" element={<DetectNews />} />
          <Route path="/compare" element={<CompareModels />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/history" element={<History />} />
          <Route path="/developer" element={<Developer />} />
        </Routes>
      </Layout>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0d1226",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
