import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, Download, Share2 } from "lucide-react";
import { createPortal } from "react-dom";

const Lightbox = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onClose, onNext, onPrev]);

  const currentImage = images[currentIndex];

  if (!currentImage) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
      onClick={onClose}
      data-testid="lightbox-overlay"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        data-testid="lightbox-close"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation - Previous */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          data-testid="lightbox-prev"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* Navigation - Next */}
      {currentIndex < images.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          data-testid="lightbox-next"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Main Image */}
      <div 
        className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImage.url}
          alt={currentImage.title || currentImage.alt || "Image"}
          className={`max-w-full max-h-[85vh] object-contain transition-transform duration-300 ${
            isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
          data-testid="lightbox-image"
        />
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="max-w-4xl mx-auto flex items-end justify-between">
          <div className="text-white">
            {currentImage.title && (
              <h3 className="text-xl font-bold mb-1">{currentImage.title}</h3>
            )}
            {currentImage.description && (
              <p className="text-white/70 text-sm">{currentImage.description}</p>
            )}
            {currentImage.category && (
              <span className="inline-block mt-2 px-3 py-1 bg-[#D4AF37] text-[#004D33] text-xs font-semibold rounded-full">
                {currentImage.category}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-sm">
              {currentIndex + 1} / {images.length}
            </span>
            
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Zoom"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            
            <a
              href={currentImage.url}
              download
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Télécharger"
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Lightbox;
