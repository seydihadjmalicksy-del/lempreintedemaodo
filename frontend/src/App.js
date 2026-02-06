import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import VideoPlayer from "./pages/VideoPlayer";
import About from "./pages/About";
import Archives from "./pages/Archives";
import SearchResults from "./pages/SearchResults";
import Mediatheque from "./pages/Mediatheque";
import Contact from "./pages/Contact";
import ElHadjiMalickSy from "./pages/histoire/ElHadjiMalickSy";
import Maodo from "./pages/histoire/Maodo";
import LigneeKhalifes from "./pages/histoire/LigneeKhalifes";
import Origines from "./pages/histoire/Origines";
import GeographieSacree from "./pages/histoire/GeographieSacree";
import Gamou from "./pages/evenements/Gamou";
import ZiarraAnnuelles from "./pages/evenements/ZiarraAnnuelles";
import CeremoniesReligieuses from "./pages/evenements/CeremoniesReligieuses";
import PiliersTariqa from "./pages/enseignements/PiliersTariqa";
import EcoleTivaouane from "./pages/enseignements/EcoleTivaouane";
import OuvragesReference from "./pages/enseignements/OuvragesReference";
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
          <Route path="/search" element={<SearchResults />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/video/:id" element={<VideoPlayer />} />
          <Route path="/about" element={<About />} />
          <Route path="/archives" element={<Archives />} />
          <Route path="/mediatheque" element={<Mediatheque />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Histoire Routes */}
          <Route path="/histoire/origines" element={<Origines />} />
          <Route path="/histoire/el-hadji-malick-sy" element={<ElHadjiMalickSy />} />
          <Route path="/histoire/maodo" element={<Maodo />} />
          <Route path="/histoire/khalifes" element={<LigneeKhalifes />} />
          <Route path="/histoire/geographie" element={<GeographieSacree />} />
          
          {/* Enseignements Routes */}
          <Route path="/enseignements/piliers" element={<PiliersTariqa />} />
          <Route path="/enseignements/ecole" element={<EcoleTivaouane />} />
          <Route path="/enseignements/ouvrages" element={<OuvragesReference />} />
          
          {/* Événements Routes */}
          <Route path="/evenements/gamou" element={<Gamou />} />
          <Route path="/evenements/ziarra" element={<ZiarraAnnuelles />} />
          <Route path="/evenements/ceremonies" element={<CeremoniesReligieuses />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
