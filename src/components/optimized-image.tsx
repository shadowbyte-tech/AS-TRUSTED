'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  placeholder = 'empty',
  blurDataURL
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  // Generate blur data URL if not provided
  const generateBlurDataURL = () => {
    if (blurDataURL) return blurDataURL;
    
    // Simple blur placeholder
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = 40;
      canvas.height = 30;
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, 40, 30);
      return canvas.toDataURL();
    }
    return '';
  };

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}
        style={{ width, height }}
      >
        <div className="text-center p-4">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">Image not available</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      
      {isInView && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoadingComplete={handleLoad}
          onError={handleError}
          priority={priority}
          sizes={sizes}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={placeholder === 'blur' ? generateBlurDataURL() : undefined}
        />
      )}
    </div>
  );
}

// Property image gallery component
interface PropertyImageGalleryProps {
  images: string[];
  alt: string;
  className?: string;
}

export function PropertyImageGallery({ images, alt, className = '' }: PropertyImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main image */}
      <div 
        className="relative cursor-pointer group"
        onClick={() => setIsGalleryOpen(true)}
      >
        <OptimizedImage
          src={images[selectedImage]}
          alt={`${alt} - Image ${selectedImage + 1}`}
          width={800}
          height={600}
          className="w-full h-full object-cover"
          priority={selectedImage === 0}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <svg className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </div>
        
        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
            {selectedImage + 1}/{images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 relative rounded overflow-hidden border-2 transition-all ${
                selectedImage === index 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <OptimizedImage
                src={image}
                alt={`${alt} - Thumbnail ${index + 1}`}
                width={80}
                height={60}
                className="w-20 h-15 object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Gallery Modal */}
      {isGalleryOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsGalleryOpen(false)}
        >
          <div 
            className="relative max-w-6xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsGalleryOpen(false)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex items-center justify-center">
              <button
                onClick={() => setSelectedImage((selectedImage - 1 + images.length) % images.length)}
                className="absolute left-4 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition-colors"
                disabled={images.length <= 1}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="max-w-4xl max-h-full">
                <OptimizedImage
                  src={images[selectedImage]}
                  alt={`${alt} - Full size ${selectedImage + 1}`}
                  width={1200}
                  height={900}
                  className="max-w-full max-h-full object-contain"
                  priority
                />
              </div>
              
              <button
                onClick={() => setSelectedImage((selectedImage + 1) % images.length)}
                className="absolute right-4 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition-colors"
                disabled={images.length <= 1}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Gallery thumbnails */}
            {images.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      selectedImage === index 
                        ? 'bg-white w-8' 
                        : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
