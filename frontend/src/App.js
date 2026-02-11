import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import VideoPlayer from "./pages/VideoPlayer";
import About from "./pages/About";
import Archives from "./pages/Archives";
import SearchResults from "./pages/SearchResults";
import Mediatheque from "./pages/Mediatheque";
import Contact from "./pages/Contact";
import CarteTivaouane from "./pages/CarteTivaouane";
import ArbreGenealogique from "./pages/ArbreGenealogique";
import PhotoGallery from "./pages/PhotoGallery";
import AdminPanel from "./pages/AdminPanel";
import AdminLogin from "./pages/AdminLogin";
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
import PWAPrompt from "./components/PWAPrompt";
import OfflineManager from "./components/OfflineManager";
import { Toaster } from "@/components/ui/sonner";
import "@/App.css";

function App() {
  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }
  }, []);

  return (
    <div className="App min-h-screen">
      <BrowserRouter>
        <Navbar />
        <PWAPrompt />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/photos" element={<PhotoGallery />} />
          <Route path="/video/:id" element={<VideoPlayer />} />
          <Route path="/about" element={<About />} />
          <Route path="/archives" element={<Archives />} />
          <Route path="/mediatheque" element={<Mediatheque />} />
          <Route path="/carte" element={<CarteTivaouane />} />
          <Route path="/arbre-genealogique" element={<ArbreGenealogique />} />
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
          
          {/* Admin Route */}
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
