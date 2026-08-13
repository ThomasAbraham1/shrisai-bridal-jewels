import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function VideoShowcase() {
  const [isHovering, setIsHovering] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const videoRefsMap = useRef<Map<string, HTMLVideoElement>>(new Map());
  const pausedPositionRef = useRef<number>(0);
  const animationIdRef = useRef<number>();

  // Static videos from Wix media
  const videos = [
    { _id: '1', videoUrl: 'https://video.wixstatic.com/video/b9ec8c_c1f4c6d3d1264bdb8a112b4ddc0fb5ad/720p/mp4/file.mp4' },
    { _id: '2', videoUrl: 'https://video.wixstatic.com/video/b9ec8c_bec66d6f188d4251989fc440fa063b5f/1080p/mp4/file.mp4' },
    { _id: '3', videoUrl: 'https://video.wixstatic.com/video/b9ec8c_5e08d5718ea54613819854e2baad694e/720p/mp4/file.mp4' },
    { _id: '4', videoUrl: 'https://video.wixstatic.com/video/b9ec8c_d0d75c6eaa6e485fab2c170ad7949a39/720p/mp4/file.mp4' },
    { _id: '5', videoUrl: 'https://video.wixstatic.com/video/b9ec8c_6933f475e70d49728c02f150614ccac4/720p/mp4/file.mp4' },
    { _id: '6', videoUrl: 'https://video.wixstatic.com/video/b9ec8c_d6ae9ace5491461cabddb19847e4ea37/720p/mp4/file.mp4' }
  ];

  // Preload first video on component mount
  useEffect(() => {
    if (videos.length > 0) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'fetch';
      link.href = videos[0].videoUrl;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  }, []);

  // Handle marquee animation with CSS transforms
  useEffect(() => {
    if (!marqueeRef.current || videos.length === 0) return;

    const marquee = marqueeRef.current;
    let currentPosition = pausedPositionRef.current;

    const animate = () => {
      if (!isPaused && !isHovering) {
        // Very slow premium movement - one complete loop every 40 seconds
        // Adjust the speed value (currently 0.5) to change animation speed
        currentPosition -= 0.9;

        const totalWidth = marquee.scrollWidth / 2; // Half because we duplicate
        if (Math.abs(currentPosition) >= totalWidth) {
          currentPosition = 0;
        }

        marquee.style.transform = `translateX(${currentPosition}px)`;
        pausedPositionRef.current = currentPosition;
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, [isPaused, isHovering, videos.length]);

  // Auto-play videos when visible
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoId = entry.target.getAttribute('data-video-id');
          if (!videoId) return;
          const video = videoRefsMap.current.get(videoId);
          if (!video) return;

          if (entry.isIntersecting && !isPaused && !isHovering) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.3 }
    );

    videoRefsMap.current.forEach((video) => {
      const element = video.closest('[data-video-id]');
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [isPaused, isHovering, videos.length]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    setIsPaused(true);
    // Pause all videos
    videoRefsMap.current.forEach((video) => {
      video.pause();
    });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setIsPaused(false);
    // Resume all videos
    videoRefsMap.current.forEach((video) => {
      video.play().catch(() => {});
    });
  };

  const registerVideoRef = (videoId: string, element: HTMLVideoElement | null) => {
    if (element) {
      videoRefsMap.current.set(videoId, element);
    } else {
      videoRefsMap.current.delete(videoId);
    }
  };

  // Duplicate videos for seamless infinite marquee
  const duplicatedVideos = [...videos, ...videos];

  return (
    <section className="py-16 md:py-28 relative overflow-hidden bg-primary-foreground">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 md:px-12 bg-primary-foreground">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="text-center mb-16 md:mb-24"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-primary text-[9px] md:text-xs font-paragraph uppercase tracking-[0.2em] mb-3 md:mb-5 block"
          >
            Real Bridal Moments
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 md:mb-6 text-secondary"
          >
            See Our Jewellery in Motion
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xs sm:text-sm md:text-base font-paragraph max-w-3xl mx-auto leading-relaxed text-secondary"
          >
            Experience how our bridal jewellery comes to life through real brides, styling sessions, bridal transformations, rentals, customer stories, and behind-the-scenes moments.
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-12 h-[1px] mx-auto mt-6 md:mt-8 origin-center bg-primary-foreground"
          />
        </motion.div>

        {/* Video Marquee Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative mb-12 md:mb-16 overflow-hidden"
        >
          {/* Marquee Track */}
          <div
            ref={marqueeRef}
            className="flex gap-4 md:gap-6 will-change-transform"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ transform: 'translateX(0px)' }}
          >
            {duplicatedVideos.map((video, index) => (
              <motion.div
                key={`${video._id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.3) }}
                className="flex-shrink-0 w-[280px] md:w-[300px]"
                data-video-id={video._id}
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="relative aspect-[9/16] rounded-[20px] overflow-hidden cursor-pointer group shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
                >
                  {/* Video Element - 9:16 aspect ratio */}
                  <video
                    ref={(el) => {
                      if (el) registerVideoRef(video._id, el);
                    }}
                    src={video.videoUrl}
                    muted
                    loop
                    playsInline
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>


        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center"
        >
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-light-gold text-secondary font-paragraph uppercase tracking-widest text-[10px] md:text-xs h-12 md:h-14 px-8 md:px-12 rounded-full transition-all duration-500 relative overflow-hidden group shadow-[0_8px_24px_rgba(200,155,60,0.3)] hover:shadow-[0_12px_32px_rgba(200,155,60,0.4)]"
          >
            <a
              href="https://www.instagram.com/shrisai_bridal_jewels?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10"
            >
              <span className="relative z-10">Watch More Videos</span>
              <div className="absolute inset-0 bg-gradient-to-r from-light-gold via-primary to-light-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </a>
          </Button>
        </motion.div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          /* Mobile: disable hover behavior, allow touch swipe */
          [data-video-id] {
            pointer-events: auto;
          }
        }
      `}</style>
    </section>
  );
}
