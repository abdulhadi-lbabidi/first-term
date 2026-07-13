import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Captions from "yet-another-react-lightbox/plugins/captions";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/captions.css";

import { ChevronLeft, ChevronRight, Maximize, Heart, Share, Camera } from 'lucide-react';

interface RoomGalleryProps {
  images: string[];
  roomName: string;
}

export function RoomGallery({ images, roomName }: RoomGalleryProps) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const isRtl = currentLang === 'ar';

  const [index, setIndex] = useState(0);
  const [openLightbox, setOpenLightbox] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Auto scroll active thumbnail
  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeThumb = thumbnailsRef.current.children[index] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [index]);

  if (!images || images.length === 0) return null;

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const slides = images.map(img => ({
    src: img,
    title: roomName,
    description: currentLang === 'ar' ? 'صورة عالية الجودة' : 'High Resolution Photo',
  }));

  return (
    <div className="space-y-4">
      {/* Hero Image */}
      <div
        className="group relative aspect-[3/2] max-w-4xl mx-auto w-full rounded-2xl overflow-hidden shadow-md bg-canvas/30 cursor-zoom-in"
        onClick={() => setOpenLightbox(true)}
        title={currentLang === 'ar' ? 'انقر للتكبير' : 'Click to zoom'}
      >
        <img
          src={images[index]}
          alt={roomName}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute top-1/2 left-4 -translate-y-1/2 w-11 h-11 bg-white/80 dark:bg-ink/80 backdrop-blur-md rounded-full flex items-center justify-center text-ink dark:text-canvas opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-ink z-10 shadow-sm"
              aria-label="Previous Image"
            >
              {isRtl ? <ChevronRight className="w-6 h-6 rotate-180" /> : <ChevronLeft className="w-6 h-6" />}
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-4 -translate-y-1/2 w-11 h-11 bg-white/80 dark:bg-ink/80 backdrop-blur-md rounded-full flex items-center justify-center text-ink dark:text-canvas opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-ink z-10 shadow-sm"
              aria-label="Next Image"
            >
              {isRtl ? <ChevronLeft className="w-6 h-6 rotate-180" /> : <ChevronRight className="w-6 h-6" />}
            </button>
          </>
        )}

        {/* Bottom Bar (Counter, Maximize, Share, Like) */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="bg-ink/70 backdrop-blur-md text-white text-[13px] font-semibold px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
            <Camera className="w-4 h-4" />
            <span dir="ltr">
              {isRtl ? `${index + 1} / ${images.length} صورة` : `${index + 1} of ${images.length}`}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              className="w-10 h-10 bg-ink/70 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-ink/90 hover:scale-105 transition-all shadow-sm"
              onClick={(e) => { e.stopPropagation(); /* handle share */ }}
              aria-label="Share"
            >
              <Share className="w-4 h-4" />
            </button>
            <button
              className="w-10 h-10 bg-ink/70 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-ink/90 hover:scale-105 transition-all shadow-sm"
              onClick={(e) => { e.stopPropagation(); setOpenLightbox(true); }}
              aria-label="Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Thumbnails Strip */}
      {images.length > 1 && (
        <div
          ref={thumbnailsRef}
          className="flex space-x-3 rtl:space-x-reverse overflow-x-auto pb-4 scrollbar-hide snap-x"
          style={{ scrollBehavior: 'smooth' }}
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`relative w-28 aspect-[4/3] rounded-xl overflow-hidden shrink-0 border-2 transition-all snap-center ${index === i ? 'border-primary shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              aria-label={`View image ${i + 1}`}
            >
              <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {/* Professional Lightbox */}
      <Lightbox
        open={openLightbox}
        close={() => setOpenLightbox(false)}
        index={index}
        on={{ view: ({ index: newIndex }) => setIndex(newIndex) }}
        slides={slides}
        plugins={[Zoom, Fullscreen, Thumbnails, Counter, Captions]}
        carousel={{
          finite: false,
          padding: '16px',
        }}
        controller={{
          closeOnBackdropClick: true,
          closeOnPullUp: true,
          closeOnPullDown: true,
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          keyboardMoveDistance: 50,
          wheelZoomDistanceFactor: 100,
          pinchZoomDistanceFactor: 100,
          scrollToZoom: true, // Use scroll wheel to zoom
        }}
        styles={{
          container: { backgroundColor: "#090909" }, // Dark theme requested
        }}
      />
    </div>
  );
}
