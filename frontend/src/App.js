import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import VideoPlayer from "./pages/VideoPlayer";
import About from "./pages/About";
import Archives from "./pages/Archives";
import ComingSoon from "./pages/ComingSoon";
import ElHadjiMalickSy from "./pages/histoire/ElHadjiMalickSy";
import LigneeKhalifes from "./pages/histoire/LigneeKhalifes";
import Origines from "./pages/histoire/Origines";
import GeographieSacree from "./pages/histoire/GeographieSacree";
import Gamou from "./pages/evenements/Gamou";
import PiliersTariqa from "./pages/enseignements/PiliersTariqa";
import Navbar from "./components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import "@/App.css";

function App() {
  return (
    <div className="App min-h-screen">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/video/:id" element={<VideoPlayer />} />
          <Route path="/about" element={<About />} />
          <Route path="/archives" element={<Archives />} />
          
          {/* Histoire Routes */}
          <Route path="/histoire/origines" element={<Origines />} />
          <Route path="/histoire/el-hadji-malick-sy" element={<ElHadjiMalickSy />} />
          <Route path="/histoire/khalifes" element={<LigneeKhalifes />} />
          <Route path="/histoire/geographie" element={<GeographieSacree />} />
          
          {/* Enseignements Routes */}
          <Route path="/enseignements/piliers" element={<PiliersTariqa />} />
          <Route path="/enseignements/ecole" element={<ComingSoon title="L'École de Tivaouane" />} />
          <Route path="/enseignements/ouvrages" element={<ComingSoon title="Ouvrages de Référence" />} />
          
          {/* Événements Routes */}
          <Route path="/evenements/gamou" element={<Gamou />} />
          <Route path="/evenements/ziarra" element={<ComingSoon title="Ziarra Annuelles" />} />
          <Route path="/evenements/ceremonies" element={<ComingSoon title="Cérémonies Religieuses" />} />
          
          {/* Autres Routes */}
          <Route path="/mediatheque" element={<ComingSoon title="Médiathèque" />} />
          <Route path="/contact" element={<ComingSoon title="Contact" />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
