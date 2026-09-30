'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowLeft, ArrowRight, Images } from '@phosphor-icons/react'
import type { Screenshot } from '@/types'

interface MediaGalleryProps {
  screenshots: Screenshot[]
}

export function MediaGallery({ screenshots }: MediaGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (screenshots.length === 0) return null

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prev = () => setLightboxIndex((i) => (i! > 0 ? i! - 1 : screenshots.length - 1))
  const next = () => setLightboxIndex((i) => (i! < screenshots.length - 1 ? i! + 1 : 0))

  return (
    <>
      {/* Gallery grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Images size={18} className="text-text-muted" />
          <h3 className="font-semibold text-text-primary">
            Screenshots ({screenshots.length})
          </h3>
        </div>

        <div className={`grid gap-3 ${
          screenshots.length === 1 ? 'grid-cols-1' :
          screenshots.length === 2 ? 'grid-cols-2' :
          'grid-cols-2 md:grid-cols-3'
        }`}>
          {screenshots.map((screenshot, index) => (
            <motion.button
              key={screenshot.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openLightbox(index)}
              className="relative aspect-video rounded-xl overflow-hidden bg-surface-elevated group focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <Image
                src={screenshot.url}
                alt={screenshot.caption || `Screenshot ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {screenshot.caption && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <p className="text-white text-xs">{screenshot.caption}</p>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
              {lightboxIndex + 1} / {screenshots.length}
            </div>

            {/* Prev */}
            {screenshots.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-4 text-white/70 hover:text-white transition-colors p-3 rounded-full hover:bg-white/10"
                aria-label="Previous"
              >
                <ArrowLeft size={24} />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-5xl w-full aspect-video rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={screenshots[lightboxIndex].url}
                alt={screenshots[lightboxIndex].caption || ''}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>

            {/* Caption */}
            {screenshots[lightboxIndex].caption && (
              <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-sm text-center max-w-lg">
                {screenshots[lightboxIndex].caption}
              </p>
            )}

            {/* Next */}
            {screenshots.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-4 text-white/70 hover:text-white transition-colors p-3 rounded-full hover:bg-white/10"
                aria-label="Next"
              >
                <ArrowRight size={24} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
