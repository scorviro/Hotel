"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const galleryImages = [
  "/gallary/image1.jpg",
  "/gallary/image2.jpg",
  "/gallary/image3.jpg",
  "/gallary/image4.jpg",
  "/gallary/image5.jpg",
  "/gallary/image6.jpg",
  "/gallary/image7.jpg",
  "/gallary/image8.jpg",
  "/gallary/image9.jpg",
  "/gallary/image10.jpeg",
  "/gallary/image11.jpeg",
  "/gallary/image12.jpeg",
  "/gallary/image13.jpeg",
  "/gallary/image14.jpeg",
  "/gallary/image15.jpeg",
  "/gallary/image16.jpeg",
  "/gallary/image17.jpeg",
  "/gallary/image18.jpeg",
  "/gallary/image19.jpeg",
  "/gallary/image20.jpeg",
  "/gallary/image21.jpg",
  "/gallary/image22.jpeg",
  "/gallary/image23.jpeg",
  "/gallary/image24.jpg",
  "/gallary/image25.jpeg",
  "/gallary/image26.jpeg",
  "/gallary/image27.jpeg",
  "/gallary/image28.jpeg",
  "/gallary/image29.jpeg",
  "/gallary/image30.jpeg",
  "/gallary/image31.jpeg",
  "/gallary/image32.jpeg"
];

const roomData = {
  club: {
    name: "Club Room",
    tagline: "Precision Designed for the Purposeful Traveller",
    desc: "Flagship standard - ergonomic workspace, high-speed fibre Wi-Fi, 43-inch Smart 4K TV, and a bed engineered for deep, restorative sleep. Because your best work starts with your best rest."
  },
  quad: {
    name: "Quad Room",
    tagline: "Two Beds. One Standard. Boundless Together.",
    desc: "Built for the group that travels as one - family reunions, colleague trips, friend getaways - the Quad Room provides two double beds within a generously proportioned space."
  },
  suite: {
    name: "Suite Room",
    tagline: "The Suite Life Is Not a Cliché. It Is a Coordinate.",
    desc: "Enter a room that unfolds. The Suite at The Blackstone offers a separate living zone, expanded wardrobe space, premium bathroom with freestanding bath, and views that remind you exactly where you are."
  },
  super_deluxe: {
    name: "Super Deluxe Room",
    tagline: "When You Have Earned the Extraordinary",
    desc: "The Super Deluxe Room occupies the top tier of our standard accommodation - a space where every detail has been magnified. Larger footprint, premium furniture, enhanced minibar, and first-in-service priority."
  }
};

export default function Home() {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const totalFrames = 1073;
  const scrollTitleRef = useRef(null);
  const separatorRef = useRef(null);
  const hasScrolledRef = useRef(false);
  const receptionRef = useRef(null);
  const diningRef = useRef(null);
  const elevatorRef = useRef(null);
  const floorRef = useRef(null);
  const bedroomRef = useRef(null);
  const banquetRef = useRef(null);
  const [selectedRoom, setSelectedRoom] = useState("club");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);
  const isGalleryActiveRef = useRef(false);
  const galleryTimelineRef = useRef(null);
  const galleryRef = useRef(null);
  const [isPreloading, setIsPreloading] = useState(true);
  const isPreloadingRef = useRef(true);
  const contactWrapperRef = useRef(null);
  const contactYToRef = useRef(null);
  const [wrapperHeight, setWrapperHeight] = useState(1500);

  const scrollState = useRef({
    current: 0,
    target: 0,
  });

  // Intro text reveal on page load (First Frame)
  useEffect(() => {
    const mainLetters = scrollTitleRef.current.querySelectorAll(".char-letter");
    const subLetters = scrollTitleRef.current.querySelectorAll(".char-letter-sub");
    const separator = separatorRef.current;

    // Set initial layout
    gsap.set(scrollTitleRef.current, { display: "flex", opacity: 1 });

    console.log("Preloader timeline starting...");
    if (typeof window !== 'undefined') {
      window.isPreloading = true;
    }
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        console.log("Preloader timeline completed!");
        if (typeof window !== 'undefined') {
          window.isPreloading = false;
        }
        setIsPreloading(false);
        isPreloadingRef.current = false;
      }
    });

    // Stagger reveal of THE BLACKSTONE letters with blur and y-translate
    tl.fromTo(mainLetters,
      { opacity: 0, y: 35, filter: "blur(12px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, stagger: 0.04 },
      0.3
    );

    // Expand separator golden-line from width 0 to 100px
    tl.fromTo(separator,
      { width: 0, opacity: 0 },
      { width: 100, opacity: 1, duration: 0.8 },
      "-=0.6"
    );

    // Stagger reveal of HOTEL letters
    tl.fromTo(subLetters,
      { opacity: 0, y: 20, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.0, stagger: 0.05 },
      "-=0.4"
    );

    return () => {
      tl.kill();
    };
  }, []);

  // Preload frames in staggered batches
  useEffect(() => {
    const loadedImages = [];
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      loadedImages.push(img);
    }
    imagesRef.current = loadedImages;

    const batchSize = 30;
    let currentIndex = 0;

    const loadNextBatch = () => {
      if (currentIndex >= totalFrames) return;
      const end = Math.min(currentIndex + batchSize, totalFrames);

      for (let i = currentIndex; i < end; i++) {
        const paddedIndex = (i + 1).toString().padStart(6, "0");
        loadedImages[i].src = `/frames/frame_${paddedIndex}.webp`;
      }

      currentIndex = end;
      // Stagger subsequent batches to keep network free
      setTimeout(loadNextBatch, 20);
    };

    loadNextBatch();
  }, []);

  // Preload gallery images
  useEffect(() => {
    galleryImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // resizeCanvas is declared below drawFrame to resolve TDZ ReferenceError

    let lastDrawnIndex = -1;

    // Optimized drawing loop without DPR multiplication to double GPU frame rate on Retina/High-DPI displays
    const drawImg = (img) => {
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;

      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = displayWidth / displayHeight;

      let dWidth, dHeight, dx, dy;

      if (canvasRatio > imgRatio) {
        dWidth = displayWidth;
        dHeight = displayWidth / imgRatio;
        dx = 0;
        dy = (displayHeight - dHeight) / 2;
      } else {
        dWidth = displayHeight * imgRatio;
        dHeight = displayHeight;
        dx = (displayWidth - dWidth) / 2;
        dy = 0;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, dx, dy, dWidth, dHeight);
    };

    const drawFrame = (scrollVal) => {
      if (imagesRef.current.length === 0) return;
      let frameIndex = Math.round(scrollVal * (totalFrames - 1));
      frameIndex = Math.min(totalFrames - 1, Math.max(0, frameIndex));

      const displayIndex = frameIndex + 1;

      // Update scroll title opacity and position (visible between frame 1 and 118)
      if (scrollTitleRef.current) {
        if (displayIndex >= 1 && displayIndex <= 118) {
          if (scrollVal > 0.001) {
            hasScrolledRef.current = true;
            let opacity = 1;
            if (displayIndex > 95) {
              opacity = Math.max(0, 1 - (displayIndex - 95) / 23); // Fade out as we approach frame 118
            }

            const progress = (displayIndex - 1) / 117;
            const translateY = -progress * 60; // Parallax rise upward

            if (scrollTitleRef.current.style.display !== "flex") {
              scrollTitleRef.current.style.display = "flex";
            }
            scrollTitleRef.current.style.opacity = opacity;
            scrollTitleRef.current.style.transform = `translate(-50%, calc(-50% + ${translateY}px))`;
          } else if (hasScrolledRef.current) {
            // Reset to default visible state if we scrolled back to start
            if (scrollTitleRef.current.style.display !== "flex") {
              scrollTitleRef.current.style.display = "flex";
            }
            scrollTitleRef.current.style.opacity = 1;
            scrollTitleRef.current.style.transform = "translate(-50%, -50%)";
          }
        } else {
          if (scrollTitleRef.current.style.display !== "none") {
            scrollTitleRef.current.style.opacity = 0;
            scrollTitleRef.current.style.display = "none";
          }
        }
      }

      // Update reception section opacity and position (visible between frame 270 and 390)
      if (receptionRef.current) {
        if (displayIndex >= 270 && displayIndex <= 390) {
          let opacity = 1;
          if (displayIndex < 290) {
            opacity = (displayIndex - 270) / 20; // fade in
          } else if (displayIndex > 365) {
            opacity = Math.max(0, 1 - (displayIndex - 365) / 25); // fade out
          }

          const progress = (displayIndex - 270) / 120;
          const translateY = -progress * 50; // parallax vertical drift

          if (receptionRef.current.style.display !== "flex") {
            receptionRef.current.style.display = "flex";
          }
          receptionRef.current.style.opacity = opacity;
          receptionRef.current.style.transform = `translateY(calc(-50% + ${translateY}px))`;
        } else {
          if (receptionRef.current.style.display !== "none") {
            receptionRef.current.style.opacity = 0;
            receptionRef.current.style.display = "none";
          }
        }
      }

      // Update dining hall section opacity and position (visible between frame 450 and 580)
      if (diningRef.current) {
        if (displayIndex >= 450 && displayIndex <= 580) {
          let opacity = 1;
          if (displayIndex < 470) {
            opacity = (displayIndex - 450) / 20; // fade in
          } else if (displayIndex > 550) {
            opacity = Math.max(0, 1 - (displayIndex - 550) / 30); // fade out
          }

          const progress = (displayIndex - 450) / 130;
          const translateY = -progress * 50; // parallax vertical drift

          if (diningRef.current.style.display !== "flex") {
            diningRef.current.style.display = "flex";
          }
          diningRef.current.style.opacity = opacity;
          diningRef.current.style.transform = `translateY(calc(-50% + ${translateY}px))`;
        } else {
          if (diningRef.current.style.display !== "none") {
            diningRef.current.style.opacity = 0;
            diningRef.current.style.display = "none";
          }
        }
      }

      // Update elevator lobby section opacity and position (visible between frame 620 and 700)
      if (elevatorRef.current) {
        if (displayIndex >= 620 && displayIndex <= 700) {
          let opacity = 1;
          if (displayIndex < 640) {
            opacity = (displayIndex - 620) / 20; // fade in
          } else if (displayIndex > 680) {
            opacity = Math.max(0, 1 - (displayIndex - 680) / 20); // fade out
          }

          const progress = (displayIndex - 620) / 80;
          const translateY = -progress * 55; // parallax vertical drift

          if (elevatorRef.current.style.display !== "flex") {
            elevatorRef.current.style.display = "flex";
          }
          elevatorRef.current.style.opacity = opacity;
          elevatorRef.current.style.transform = `translateY(calc(-50% + ${translateY}px))`;
        } else {
          if (elevatorRef.current.style.display !== "none") {
            elevatorRef.current.style.opacity = 0;
            elevatorRef.current.style.display = "none";
          }
        }
      }

      // Update second floor chapter title opacity and position (visible between frame 700 and 780)
      if (floorRef.current) {
        if (displayIndex >= 700 && displayIndex <= 780) {
          let opacity = 1;
          if (displayIndex < 715) {
            opacity = (displayIndex - 700) / 15; // fade in
          } else if (displayIndex > 765) {
            opacity = Math.max(0, 1 - (displayIndex - 765) / 15); // fade out
          }

          const progress = (displayIndex - 700) / 80;
          const translateY = -progress * 40; // parallax vertical drift

          if (floorRef.current.style.display !== "flex") {
            floorRef.current.style.display = "flex";
          }
          floorRef.current.style.opacity = opacity;
          floorRef.current.style.transform = `translate(-50%, calc(-50% + ${translateY}px))`;
        } else {
          if (floorRef.current.style.display !== "none") {
            floorRef.current.style.opacity = 0;
            floorRef.current.style.display = "none";
          }
        }
      }

      // Update bedroom section opacity and position (visible between frame 840 and 980)
      if (bedroomRef.current) {
        if (displayIndex >= 840 && displayIndex <= 980) {
          let opacity = 1;
          if (displayIndex < 860) {
            opacity = (displayIndex - 840) / 20; // fade in
          } else if (displayIndex > 950) {
            opacity = Math.max(0, 1 - (displayIndex - 950) / 30); // fade out
          }

          const progress = (displayIndex - 840) / 140;
          const translateY = -progress * 50; // parallax vertical drift

          if (bedroomRef.current.style.display !== "flex") {
            bedroomRef.current.style.display = "flex";
          }
          bedroomRef.current.style.opacity = opacity;
          bedroomRef.current.style.transform = `translateY(calc(-50% + ${translateY}px))`;
        } else {
          if (bedroomRef.current.style.display !== "none") {
            bedroomRef.current.style.opacity = 0;
            bedroomRef.current.style.display = "none";
          }
        }
      }

      // Update banquet section opacity and position (visible from frame 1000 onwards)
      if (banquetRef.current) {
        if (displayIndex >= 1000) {
          let opacity = 1;
          if (displayIndex < 1015) {
            opacity = (displayIndex - 1000) / 15; // fade in
          }

          // Parallax progress capped at 1.0 (reached at frame 1073)
          const progress = Math.min(1, (displayIndex - 1000) / 73);
          const translateY = -progress * 45; // parallax vertical drift

          if (banquetRef.current.style.display !== "flex") {
            banquetRef.current.style.display = "flex";
          }
          banquetRef.current.style.opacity = opacity;
          banquetRef.current.style.transform = `translateY(calc(-50% + ${translateY}px))`;
        } else {
          if (banquetRef.current.style.display !== "none") {
            banquetRef.current.style.opacity = 0;
            banquetRef.current.style.display = "none";
          }
        }
      }

      // Update gallery active state
      if (displayIndex === 1073) {
        if (!isGalleryActiveRef.current) {
          isGalleryActiveRef.current = true;
          setShowGallery(true);
        }
      } else {
        if (isGalleryActiveRef.current) {
          isGalleryActiveRef.current = false;
          setShowGallery(false);
        }
      }

      if (frameIndex === lastDrawnIndex) return;

      const img = imagesRef.current[frameIndex];
      if (img && img.complete && img.naturalWidth > 0) {
        drawImg(img);
        lastDrawnIndex = frameIndex;
      } else {
        // Fallback: find nearest loaded frame
        let fallbackImg = null;
        for (let offset = 1; offset < totalFrames; offset++) {
          const prevIdx = frameIndex - offset;
          const nextIdx = frameIndex + offset;

          if (prevIdx >= 0) {
            const prevImg = imagesRef.current[prevIdx];
            if (prevImg && prevImg.complete && prevImg.naturalWidth > 0) {
              fallbackImg = prevImg;
              break;
            }
          }
          if (nextIdx < totalFrames) {
            const nextImg = imagesRef.current[nextIdx];
            if (nextImg && nextImg.complete && nextImg.naturalWidth > 0) {
              fallbackImg = nextImg;
              break;
            }
          }
        }

        if (fallbackImg) {
          drawImg(fallbackImg);
          lastDrawnIndex = frameIndex;
        }
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Force redrawing the active frame on resize to avoid stretches or blank screens
      const easedScrollRatio = scrollState.current.current;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const easedScrollTop = easedScrollRatio * docHeight;
      const videoMaxScroll = window.innerHeight * 99;
      const videoProgress = Math.min(1.0, Math.max(0.0, easedScrollTop / videoMaxScroll));

      drawFrame(videoProgress);
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();


    // Draw initial frame
    const firstImg = imagesRef.current[0];
    if (firstImg) {
      if (firstImg.complete) {
        drawFrame(0);
      } else {
        firstImg.onload = () => drawFrame(0);
      }
    }

    let animationFrameId;
    const tick = () => {
      if (isPreloadingRef.current) {
        scrollState.current.current = 0;
        scrollState.current.target = 0;
        window.scrollTo(0, 0);
        drawFrame(0);
        animationFrameId = requestAnimationFrame(tick);
        return;
      }

      const diff = Math.abs(scrollState.current.target - scrollState.current.current);
      if (diff > 0.0001) {
        scrollState.current.current += (scrollState.current.target - scrollState.current.current) * 0.05;
      } else if (scrollState.current.current !== scrollState.current.target) {
        // Snap to exact target when settling to avoid floating computations
        scrollState.current.current = scrollState.current.target;
      }

      const easedScrollRatio = scrollState.current.current;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const easedScrollTop = easedScrollRatio * docHeight;
      const videoMaxScroll = window.innerHeight * 99;
      const animationRange = window.innerHeight * 179;

      // Draw frames based on eased video ratio
      const videoProgress = Math.min(1.0, Math.max(0.0, easedScrollTop / videoMaxScroll));
      drawFrame(videoProgress);

      // Control gallery timeline progress based on eased gallery ratio
      const galleryProgress = Math.min(1.0, Math.max(0.0, (easedScrollTop - videoMaxScroll) / (animationRange - videoMaxScroll)));
      if (galleryTimelineRef.current) {
        galleryTimelineRef.current.progress(galleryProgress);
      }

      // Fade out canvas and gallery collage container when scrolling past animationRange
      let fixedOpacity = 1;
      if (easedScrollTop > animationRange) {
        const fadeDistance = window.innerHeight * 0.5;
        fixedOpacity = Math.max(0, 1 - (easedScrollTop - animationRange) / fadeDistance);
      }
      if (canvasRef.current) {
        canvasRef.current.style.opacity = 1;
      }
      if (galleryRef.current) {
        galleryRef.current.style.opacity = 1;
        galleryRef.current.style.pointerEvents = "auto";
      }

      // Slide up Contact section from the bottom of the viewport smoothly using GSAP quickTo
      if (contactWrapperRef.current) {
        if (easedScrollTop > animationRange) {
          const delta = easedScrollTop - animationRange;
          const speedFactor = 0.5; // Slowly slide up at 50% of scroll speed
          const maxScroll = Math.max(0, wrapperHeight - window.innerHeight);
          const targetY = Math.max(-maxScroll, window.innerHeight - delta * speedFactor);
          
          if (contactYToRef.current) {
            contactYToRef.current(targetY);
          } else {
            contactWrapperRef.current.style.transform = `translateY(${targetY}px)`;
          }
          contactWrapperRef.current.style.pointerEvents = "auto";
        } else {
          if (contactYToRef.current) {
            contactYToRef.current(window.innerHeight);
          } else {
            contactWrapperRef.current.style.transform = `translateY(${window.innerHeight}px)`;
          }
          contactWrapperRef.current.style.pointerEvents = "none";
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (isPreloadingRef.current) {
        window.scrollTo(0, 0);
        return;
      }
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        let ratio = scrollTop / docHeight;

        if (scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 5) {
          ratio = 1.0;
        } else if (scrollTop <= 5) {
          ratio = 0.0;
        }

        scrollState.current.target = ratio;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize paused GSAP timeline for gallery card throw
  useEffect(() => {
    const cards = document.querySelectorAll(".gallery-card");
    const tl = gsap.timeline({ paused: true });
    galleryTimelineRef.current = tl;

    cards.forEach((card, index) => {
      // Grid-based layout for premium scattering on the right side (from 47vw to 76vw, 12vh to 75vh)
      const col = index % 4; // 4 columns
      const row = Math.floor(index / 4); // 8 rows

      const baseX = 47 + col * 9.5;
      const baseY = 12 + row * 9.0;

      // Organic offsets to prevent artificial grid appearance
      const offsetX = Math.sin(index * 1.7) * 4.0;
      const offsetY = Math.cos(index * 2.3) * 3.5;

      const targetX = baseX + offsetX;
      const targetY = baseY + offsetY;

      // Random final rotation between -18 and 18 degrees
      const targetRot = (Math.sin(index * 7.1) * 12) + (Math.cos(index * 3.7) * 6);

      // Random starting offscreen height variation to create dynamic flight path momentum
      const startY = 30 + (index % 5) * 10;

      // Set initial offscreen right state
      gsap.set(card, {
        x: "125vw",
        y: `${startY}vh`,
        rotation: targetRot + (index % 2 === 0 ? 180 : -180), // Full 180 degree spin while flying in
        opacity: 0,
        scale: 0.85,
        zIndex: index + 10,
      });

      // Add to animation timeline with stagger (stretched out for a 40% slower, smoother reveal)
      const startTime = index * 0.38;
      tl.to(card, {
        x: `${targetX}vw`,
        y: `${targetY}vh`,
        rotation: targetRot,
        opacity: 1,
        scale: 1,
        duration: 1.6,
        ease: "back.out(1.2)", // Elegant subtle bounce on landing
      }, startTime);
    });

    return () => {
      if (galleryTimelineRef.current) {
        galleryTimelineRef.current.kill();
      }
    };
  }, []);

  // Measure contact wrapper height dynamically to calculate scroll spacer height
  useEffect(() => {
    if (!contactWrapperRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setWrapperHeight(entry.target.clientHeight || entry.contentRect.height);
      }
    });
    observer.observe(contactWrapperRef.current);
    return () => observer.disconnect();
  }, []);

  // Initialize GSAP quickTo for smooth contact wrapper sliding
  useEffect(() => {
    if (contactWrapperRef.current) {
      contactYToRef.current = gsap.quickTo(contactWrapperRef.current, "y", {
        duration: 0.8,
        ease: "power2.out",
        runBackwards: false
      });
    }
  }, []);

  // Listen to Escape key to close contact modal and lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsContactOpen(false);
        setActiveLightboxImg(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Freeze page scroll when preloader, contact modal, or lightbox is open
  useEffect(() => {
    if (isPreloading || isContactOpen || activeLightboxImg) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isPreloading, isContactOpen, activeLightboxImg]);

  // Disable mouse wheel, touch scroll, keyboard scrolling, and trackpad scrolling while preloading
  useEffect(() => {
    if (!isPreloading) return;

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const preventDefault = (e) => {
      e.preventDefault();
    };

    const preventDefaultForScrollKeys = (e) => {
      const keys = { 37: 1, 38: 1, 39: 1, 40: 1, 32: 1, 33: 1, 34: 1, 35: 1, 36: 1 };
      if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
      }
    };

    const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

    window.addEventListener('DOMMouseScroll', preventDefault, { passive: false });
    window.addEventListener(wheelEvent, preventDefault, { passive: false });
    window.addEventListener('touchmove', preventDefault, { passive: false });
    window.addEventListener('keydown', preventDefaultForScrollKeys, { passive: false });

    // Force page to 0 immediately on mount/reload
    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener('DOMMouseScroll', preventDefault);
      window.removeEventListener(wheelEvent, preventDefault);
      window.removeEventListener('touchmove', preventDefault);
      window.removeEventListener('keydown', preventDefaultForScrollKeys);

      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, [isPreloading]);

  // Sync scroll position to 0 on preloader exit to avoid jumpy transitions
  useEffect(() => {
    if (!isPreloading) {
      window.scrollTo(0, 0);
      scrollState.current.target = 0;
      scrollState.current.current = 0;
    }
  }, [isPreloading]);

  return (
    <>
      <div className={`main-layout ${isContactOpen ? "blur-active" : ""}`}>
        {/* Dynamic Scroll Title (visible from frame 1 to 118) */}
        <div className="scroll-title-container" ref={scrollTitleRef}>
          <h1 className="scroll-title-main">
            {"THE BLACKSTONE".split("").map((char, i) => (
              <span key={i} className="char-letter">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
          <div className="scroll-title-separator" ref={separatorRef}></div>
          <h2 className="scroll-title-sub">
            {"HOTEL".split("").map((char, i) => (
              <span key={i} className="char-letter-sub">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h2>
        </div>

        {/* Reception Area Section (visible from frame 270 to 390) */}
        <div className="reception-section-container" ref={receptionRef}>
          <h3 className="reception-sub-heading">A lobby that whispers heritage and roars luxury.</h3>
          <h2 className="reception-headline">Your Story Begins at First Light</h2>
          <div className="reception-divider"></div>
          <p className="reception-paragraph">
            Step through our doors and into a world where first impressions are permanent impressions. The Blackstone reception is designed as an overture - a visual symphony of dark Marquina marble, warm amber light, and hand-selected cognac leather. Presiding over the space, the portrait of Maharaja Krishnakumarsinhji of Bhavnagar anchors our identity in the royal legacy of Gujarat. Here, every guest is greeted not as a visitor, but as a distinguished arrival.
          </p>
          <a href="#contact" className="reception-cta" onClick={(e) => { e.preventDefault(); setIsContactOpen(true); }}>
            <span>Meet Our Concierge</span>
            <svg className="cta-arrow" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Dining Hall Area Section (visible from frame 450 to 580) */}
        <div className="dining-section-container" ref={diningRef}>
          <h3 className="dining-sub-heading">Where every meal is a ceremony, every flavour a memory.</h3>
          <h2 className="dining-headline">A Table Set for Royalty</h2>
          <div className="dining-divider"></div>
          <p className="dining-paragraph">
            The Blackstone Restaurant is an homage to Gujarati culinary heritage elevated through a global lens. Beneath the warm glow of hand-blown pendant lights, 60+ expertly laid covers await the discerning diner. Our buffet spread - rich in regional spice and international subtlety - is prepared daily by our executive chef using locally sourced ingredients. Whether you arrive for a business breakfast, a family celebration, or an intimate dinner, the restaurant transforms every occasion into an occasion worth remembering.
          </p>
          <a href="#contact" className="dining-cta" onClick={(e) => { e.preventDefault(); setIsContactOpen(true); }}>
            <span>Reserve Your Table</span>
            <svg className="cta-arrow" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Elevator Lobby Area Section (visible from frame 620 to 700) */}
        <div className="elevator-section-container" ref={elevatorRef}>
          <h3 className="elevator-sub-heading">The in-between is where the magic lives.</h3>
          <h2 className="elevator-headline">Every Floor, A New World</h2>
          <div className="elevator-divider"></div>
          <p className="elevator-paragraph">
            At The Blackstone, the journey to your room is part of the experience. Our living green walls - bursting with ferns, moss, succulents, and seasonal blooms - transform a functional corridor into a sensory pause. The scent of living plants, the stillness of marble, the gleam of steel: this is the hotel&apos;s breathing space, a moment of transition that prepares you for the sanctuary beyond each door.
          </p>
          <a href="#contact" className="elevator-cta" onClick={(e) => { e.preventDefault(); setIsContactOpen(true); }}>
            <span>Discover Your Floor</span>
            <svg className="cta-arrow" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Second Floor Arrival Title (visible from frame 700 to 780) */}
        <div className="floor-title-container" ref={floorRef}>
          <span className="floor-label">ARRIVAL</span>
          <h2 className="floor-title-main">OUR ROOMS  FACILITIES</h2>
          <div className="floor-divider"></div>
          <p className="floor-subtitle">Luxury Rooms & Suites</p>
        </div>

        {/* Bedroom / Rooms & Suites Section (visible from frame 840 to 980) */}
        <div className="bedroom-section-container" ref={bedroomRef}>
          <h3 className="bedroom-sub-heading">Where every night is a masterpiece of comfort.</h3>
          <h2 className="bedroom-headline">Sleep Like You Were Born to This</h2>
          <div className="bedroom-divider"></div>

          {/* Room Tab Selectors */}
          <div className="room-tabs-container">
            {Object.keys(roomData).map((key) => (
              <button
                key={key}
                className={`room-tab-btn ${selectedRoom === key ? "active" : ""}`}
                onClick={() => setSelectedRoom(key)}
              >
                {roomData[key].name.replace(" Room", "")}
              </button>
            ))}
          </div>

          {/* Active Tab Details */}
          <div className="room-details-panel">
            <h4 className="room-details-tagline">{roomData[selectedRoom].tagline}</h4>
            <p className="room-details-desc">{roomData[selectedRoom].desc}</p>
          </div>

          <a href="#contact" className="bedroom-cta" onClick={(e) => { e.preventDefault(); setIsContactOpen(true); }}>
            <span>BOOK YOUR ROOM</span>
            <svg className="cta-arrow" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Banquet Hall / Events Section (visible from frame 1000 to 1073) */}
        <div className="banquet-section-container" ref={banquetRef}>
          <h3 className="banquet-sub-heading">Weddings. Celebrations. Milestones. All at their most magnificent.</h3>
          <h2 className="banquet-headline">Your Greatest Moments Deserve a Grand Stage</h2>
          <div className="banquet-divider"></div>
          <p className="banquet-paragraph">
            The Blackstone Banquet Hall is a canvas for life&apos;s most extraordinary chapters. With a capacity of 200+ guests, a 40-foot ceiling, and bespoke event styling available from our in-house décor team, every celebration here is tailored to the individual. Wedding mandaps adorned with cascading floral arches, corporate galas beneath crystal chandeliers, milestone birthdays punctuated by gold and black - our hall transforms to tell your story, exactly as you imagined it.
          </p>
          <a href="#contact" className="banquet-cta" onClick={(e) => { e.preventDefault(); setIsContactOpen(true); }}>
            <span>Plan Your Event</span>
            <svg className="cta-arrow" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Main Website Content */}
        <div className="main-content-container">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/frames/frame_000001.webp" alt="First Frame placeholder" className="bg-frame" />
          <canvas ref={canvasRef}></canvas>          {/* Gallery Collage Section */}
          <div className="gallery-collage-container" ref={galleryRef}>
            {galleryImages.map((src, index) => (
              <div
                key={index}
                className="gallery-card"
                onClick={() => setActiveLightboxImg(src)}
              >
                <div className="gallery-card-inner">
                  <div className="gallery-card-img-container">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`Wedding Memory ${index + 1}`} className="gallery-card-img" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="scroll-spacer"></div>

          {/* Wrapper for Contact & Footer to control scroll speed */}
          <div className="contact-footer-wrapper" ref={contactWrapperRef}>
            {/* New Premium Contact Experience Section */}
            <section className="premium-contact-section" id="contact-experience">
              
              {/* Top Title Banner */}
              <div className="contact-banner-gradient">
                <h1 className="contact-banner-title">Contact Us</h1>
                <div className="contact-banner-breadcrumbs">
                  <span className="breadcrumb-home">
                    <svg viewBox="0 0 24 24" className="home-icon-svg">
                      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/>
                    </svg>
                    Home
                  </span>
                  <span className="breadcrumb-separator">&gt;</span>
                  <span className="breadcrumb-current">Contact Us</span>
                </div>
              </div>

              <div className="contact-experience-container">
                <div className="contact-experience-grid">
                  
                  {/* Left Column: Contact Information */}
                  <div className="contact-info-card">
                    <h2 className="info-card-title">Contact Information</h2>
                    <p className="info-card-intro">
                      Have questions or need help with your booking? Our team is always ready to assist you with professional solutions and reliable support. Feel free to contact us anytime and we will respond as quickly as possible.
                    </p>
                    
                    <div className="info-card-list">
                      {/* Phone Item */}
                      <div className="info-list-item">
                        <div className="info-item-icon-circle">
                          <svg viewBox="0 0 24 24" className="info-item-svg">
                            <path d="M6.62 10.79a15.15 15.15 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.11-.27c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.26 1.1l-2.2 2.22z" fill="currentColor"/>
                          </svg>
                        </div>
                        <div className="info-item-content">
                          <span className="info-item-label">Phone Number</span>
                          <p className="info-item-value">
                            <a href="tel:+918238282341">+91 82382 82341</a><br />
                            <a href="tel:+918238282361">+91 82382 82361</a>
                          </p>
                        </div>
                      </div>

                      {/* Email Item */}
                      <div className="info-list-item">
                        <div className="info-item-icon-circle">
                          <svg viewBox="0 0 24 24" className="info-item-svg">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
                          </svg>
                        </div>
                        <div className="info-item-content">
                          <span className="info-item-label">Email Address</span>
                          <p className="info-item-value">
                            <a href="mailto:Hoteltheblackstone@gmail.com">Hoteltheblackstone@gmail.com</a>
                          </p>
                        </div>
                      </div>

                      {/* Opening Hour Item */}
                      <div className="info-list-item">
                        <div className="info-item-icon-circle">
                          <svg viewBox="0 0 24 24" className="info-item-svg">
                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor"/>
                          </svg>
                        </div>
                        <div className="info-item-content">
                          <span className="info-item-label">Opening Hour</span>
                          <p className="info-item-value">
                            24/7 Front Desk / Guest Relations
                          </p>
                        </div>
                      </div>

                      {/* Location Item */}
                      <div className="info-list-item">
                        <div className="info-item-icon-circle">
                          <svg viewBox="0 0 24 24" className="info-item-svg">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                          </svg>
                        </div>
                        <div className="info-item-content">
                          <span className="info-item-label">Our Location</span>
                          <p className="info-item-value">
                            150 Ft. Ring Road, Nr. Sokhda Chowkdi, Rajkot - 360006, Gujarat, India
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Get In Touch Form */}
                  <div className="contact-form-card">
                    <div className="form-tag-row">
                      <span className="form-tag-star">*</span>
                      <span className="form-tag-text">Get In Touch</span>
                    </div>
                    <h2 className="form-card-title">Get In Touch</h2>
                    <p className="form-card-intro">
                      We would love to hear about your travel plans and help coordinate your stay or event. Fill out the contact form and our team will get back to you soon with the best possible options.
                    </p>

                    <form className="ui-enquiry-form" onSubmit={(e) => { e.preventDefault(); alert("Enquiry Sent Successfully. A dedicated associate will contact you shortly."); }}>
                      <div className="form-row-2-ui">
                        <div className="form-field-ui">
                          <input type="text" required placeholder="Name" className="ui-input-field" />
                        </div>
                        <div className="form-field-ui">
                          <input type="email" required placeholder="Email Address" className="ui-input-field" />
                        </div>
                      </div>
                      
                      <div className="form-row-2-ui">
                        <div className="form-field-ui">
                          <input type="tel" required placeholder="Phone Number" className="ui-input-field" />
                        </div>
                        <div className="form-field-ui">
                          <select defaultValue="" required className="ui-select-field">
                            <option value="" disabled>Service You&apos;re Interested</option>
                            <option value="club">Club Room Booking</option>
                            <option value="quad">Quad Room Booking</option>
                            <option value="suite">Suite Room Booking</option>
                            <option value="super_deluxe">Super Deluxe Booking</option>
                            <option value="banquet">Banquet Hall Enquiry</option>
                            <option value="other">General Enquiry</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-field-ui full-width-ui">
                        <textarea required placeholder="Message" className="ui-textarea-field" rows="4"></textarea>
                      </div>

                      <button type="submit" className="ui-submit-btn">
                        <span>Send Message</span>
                        <div className="submit-btn-arrow-circle">
                          <svg viewBox="0 0 24 24" className="submit-btn-arrow-svg">
                            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </button>
                    </form>
                  </div>

                </div>

                {/* Our Location Map Section */}
                <div className="contact-map-section">
                  <div className="map-tag-row">
                    <span className="map-tag-star">*</span>
                    <span className="map-tag-text">Our Location</span>
                  </div>
                  <h2 className="map-section-title">Visit Our Office For In-person Meetings And Consultations</h2>
                  
                  <div className="map-frame-wrapper">
                    <iframe
                      title="The Blackstone Hotel Google Map Location"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3690.669862804245!2d70.77457497605481!3d22.328328641551824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959c86445585b4d%3A0xb35a70ea6e680a6!2s150%20Feet%20Ring%20Rd%2C%20Rajkot%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1717316000000!5m2!1sen!2sin"
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="map-iframe-ui"
                    ></iframe>
                  </div>
                </div>

              </div>
            </section>

            {/* Premium Footer */}
            <footer className="premium-footer">
              <div className="footer-container">
                
                {/* GET IN TOUCH footer header */}
                <div className="footer-title-header">
                  <h2 className="footer-heading-text">GET IN TOUCH</h2>
                  <div className="footer-heading-line"></div>
                </div>

                <div className="footer-grid">
                  {/* Column 1: Logo & Tagline */}
                  <div className="footer-col brand-col">
                    <div className="footer-logo-container">
                      <img src="/preloaderlogo.png" alt="The Blackstone Hotel Logo" className="footer-logo-img" />
                    </div>
                    <p className="footer-tagline">
                      Since 2015, The Blackstone Hotel has been Rajkot&apos;s definitive statement in business and luxury hospitality.
                    </p>
                    <div className="footer-socials-ui">
                      <a href="#" className="social-btn-ui" aria-label="Facebook">
                        <svg viewBox="0 0 24 24" className="social-svg-ui"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="currentColor"/></svg>
                      </a>
                      <a href="#" className="social-btn-ui" aria-label="Instagram">
                        <svg viewBox="0 0 24 24" className="social-svg-ui"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" fill="currentColor"/></svg>
                      </a>
                      <a href="#" className="social-btn-ui" aria-label="LinkedIn">
                        <svg viewBox="0 0 24 24" className="social-svg-ui"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fill="currentColor"/></svg>
                      </a>
                      <a href="#" className="social-btn-ui" aria-label="YouTube">
                        <svg viewBox="0 0 24 24" className="social-svg-ui"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.555a3.003 3.003 0 0 0-2.11 2.108C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.482 20.5 12 20.5 12 20.5s7.518 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor"/></svg>
                      </a>
                    </div>
                  </div>

                  {/* Column 2: Quick Links */}
                  <div className="footer-col links-col">
                    <h3 className="footer-col-title">Quick Links</h3>
                    <ul className="footer-links-list-ui">
                      <li><a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: window.innerHeight * 3.5, behavior: 'smooth' }); }}>About Us</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: window.innerHeight * 8.5, behavior: 'smooth' }); }}>Rooms &amp; Suites</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: window.innerHeight * 5.0, behavior: 'smooth' }); }}>Restaurant</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: window.innerHeight * 10.5, behavior: 'smooth' }); }}>Banquet Hall</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: window.innerHeight * 7.5, behavior: 'smooth' }); }}>Game Zone</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }); }}>Contact Us</a></li>
                    </ul>
                  </div>

                  {/* Column 3: Contact Info */}
                  <div className="footer-col contact-col">
                    <h3 className="footer-col-title">Contact Us</h3>
                    <div className="footer-contact-info-list">
                      <p className="footer-contact-item">
                        <svg viewBox="0 0 24 24" className="footer-contact-icon-svg"><path d="M6.62 10.79a15.15 15.15 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.11-.27c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.26 1.1l-2.2 2.22z" fill="currentColor"/></svg>
                        <span>+91 82382 82341 | +91 82382 82361</span>
                      </p>
                      <p className="footer-contact-item">
                        <svg viewBox="0 0 24 24" className="footer-contact-icon-svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/></svg>
                        <span>150 Ft. Ring Road, Nr. Sokhda Chowkdi, Rajkot</span>
                      </p>
                      <p className="footer-contact-item">
                        <svg viewBox="0 0 24 24" className="footer-contact-icon-svg"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/></svg>
                        <span>Hoteltheblackstone@gmail.com</span>
                      </p>
                      <p className="footer-contact-item">
                        <svg viewBox="0 0 24 24" className="footer-contact-icon-svg"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor"/></svg>
                        <span>24/7 Front Desk / Guest Relations</span>
                      </p>
                    </div>
                  </div>

                  {/* Column 4: Join Newsletter */}
                  <div className="footer-col newsletter-col">
                    <h3 className="footer-col-title">Join Newsletter</h3>
                    <form className="footer-newsletter-form" onSubmit={(e) => { e.preventDefault(); alert("Subscribed Successfully!"); }}>
                      <div className="newsletter-input-wrapper">
                        <input type="email" required placeholder="Email" className="newsletter-email-input" />
                        <button type="submit" className="newsletter-submit-btn" aria-label="Subscribe">
                          <svg viewBox="0 0 24 24" className="newsletter-send-icon">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
                          </svg>
                        </button>
                      </div>
                    </form>
                    
                    {/* User Avatars */}
                    <div className="newsletter-avatars-row">
                      <div className="avatars-pile">
                        <img src="/gallary/image1.jpg" alt="User 1" className="avatar-img" />
                        <img src="/gallary/image2.jpg" alt="User 2" className="avatar-img" />
                        <img src="/gallary/image3.jpg" alt="User 3" className="avatar-img" />
                        <img src="/gallary/image4.jpg" alt="User 4" className="avatar-img" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="footer-bottom-line"></div>

                <div className="footer-bottom-ui">
                  <p className="footer-copyright-ui">
                    Copyright &copy; 2026 Divi Templatespro All Rights Reserved
                  </p>
                </div>

              </div>
            </footer>
          </div>

          {/* Spacer to allow scrolling through the translated wrapper */}
          <div 
            className="contact-footer-spacer"
            style={{ 
              height: `${wrapperHeight * 1.5}px`
            }} 
          />
        </div>
      </div>

      {/* 2026 Premium Aesthetic Contact Modal Overlay */}
      {isContactOpen && (
        <div className="contact-overlay-modal">
          <div className="contact-modal-backdrop" onClick={() => setIsContactOpen(false)}></div>
          <div className="contact-modal-content-wrapper">

            {/* Close Button */}
            <button className="contact-modal-close-btn" onClick={() => setIsContactOpen(false)} aria-label="Close Modal">
              <svg viewBox="0 0 24 24" className="close-icon">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></line>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></line>
              </svg>
              <div className="close-btn-ring"></div>
            </button>

            <div className="contact-modal-body">
              {/* Left Column: Direct info & Custom map */}
              <div className="contact-info-panel">
                <div className="contact-info-header">
                  <span className="contact-info-tag">FIND US</span>
                  <h2 className="contact-info-title">We Are Where You Need Us to Be</h2>
                  <p className="contact-info-subtitle">150 Ft. Ring Road, Nr. Sokhda Chowkdi, Rajkot - 06</p>
                </div>

                <div className="contact-info-details">
                  <div className="info-detail-item">
                    <span className="info-label">Address</span>
                    <p className="info-value">150 Ft. Ring Road, Nr. Sokhda Chowkdi, Survey No. 88/4, Plot No. 1, Rajkot - 360006, Gujarat, India</p>
                  </div>

                  <div className="info-detail-row">
                    <div className="info-detail-item">
                      <span className="info-label">Direct Lines</span>
                      <p className="info-value">+91 82382 82341<br />+91 82382 82361</p>
                    </div>
                    <div className="info-detail-item">
                      <span className="info-label">General Enquiries</span>
                      <p className="info-value">Hoteltheblackstone@gmail.com</p>
                    </div>
                  </div>
                </div>

                {/* Google Map Container */}
                <div className="contact-map-card">
                  <iframe
                    title="The Blackstone Hotel Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3690.669862804245!2d70.77457497605481!3d22.328328641551824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959c86445585b4d%3A0xb35a70ea6e680a6!2s150%20Feet%20Ring%20Rd%2C%20Rajkot%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1717316000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="map-iframe"
                  ></iframe>
                </div>

                {/* Driving Directions */}
                <div className="directions-container">
                  <span className="directions-label">Driving Directions:</span>
                  <div className="directions-links">
                    <a href="https://www.google.com/maps/dir/Rajkot+Airport,+Rajkot/150+Feet+Ring+Road,+Rajkot" target="_blank" rel="noopener noreferrer" className="direction-link">From Airport</a>
                    <span className="direction-separator">•</span>
                    <a href="https://www.google.com/maps/dir/Rajkot+Junction,+Rajkot/150+Feet+Ring+Road,+Rajkot" target="_blank" rel="noopener noreferrer" className="direction-link">From Railway Station</a>
                    <span className="direction-separator">•</span>
                    <a href="https://www.google.com/maps/dir/Rajkot+Central+Bus+Station,+Rajkot/150+Feet+Ring+Road,+Rajkot" target="_blank" rel="noopener noreferrer" className="direction-link">From Bus Stand</a>
                  </div>
                </div>
              </div>

              {/* Right Column: Premium Booking Enquiry Form */}
              <div className="contact-form-panel">
                <div className="contact-form-header">
                  <span className="contact-form-tag">RESERVE YOUR SANCTUARY</span>
                  <h2 className="contact-form-title">Booking Form</h2>
                </div>

                <form className="premium-enquiry-form" onSubmit={(e) => { e.preventDefault(); alert("Enquiry Sent Successfully. A dedicated associate will contact you shortly."); setIsContactOpen(false); }}>
                  <div className="form-row-2">
                    <div className="form-group floating-group">
                      <input type="text" id="fullname" required placeholder=" " className="premium-input" />
                      <label htmlFor="fullname" className="premium-label">Full Name *</label>
                      <div className="input-focus-line"></div>
                    </div>
                    <div className="form-group floating-group">
                      <input type="tel" id="phone" required placeholder=" " className="premium-input" />
                      <label htmlFor="phone" className="premium-label">Phone Number *</label>
                      <div className="input-focus-line"></div>
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group floating-group">
                      <input type="email" id="email" required placeholder=" " className="premium-input" />
                      <label htmlFor="email" className="premium-label">Email Address *</label>
                      <div className="input-focus-line"></div>
                    </div>
                    <div className="form-group select-group">
                      <select id="guests" defaultValue="2" className="premium-select">
                        <option value="1">1 Guest</option>
                        <option value="2">2 Guests</option>
                        <option value="3">3 Guests</option>
                        <option value="4">4 Guests</option>
                        <option value="5">5 Guests</option>
                        <option value="6">6 Guests</option>
                        <option value="7">7 Guests</option>
                        <option value="8">8+ Guests</option>
                      </select>
                      <label htmlFor="guests" className="select-label">Number of Guests</label>
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group date-group">
                      <input type="date" id="checkin" required className="premium-date-input" />
                      <label htmlFor="checkin" className="date-label">Check-in Date</label>
                    </div>
                    <div className="form-group date-group">
                      <input type="date" id="checkout" required className="premium-date-input" />
                      <label htmlFor="checkout" className="date-label">Check-out Date</label>
                    </div>
                  </div>

                  <div className="form-group select-group">
                    <select id="roomtype" defaultValue="club" className="premium-select">
                      <option value="club">Club Room</option>
                      <option value="quad">Quad Room</option>
                      <option value="suite">Suite Room</option>
                      <option value="super_deluxe">Super Deluxe Room</option>
                    </select>
                    <label htmlFor="roomtype" className="select-label">Room Type</label>
                  </div>

                  <div className="form-group textarea-group">
                    <textarea id="requirements" placeholder="Special Requirements (dietary preferences, airport pickup, bedding layout, etc.)" className="premium-textarea" rows="3"></textarea>
                  </div>

                  <button type="submit" className="premium-submit-btn">
                    <span>Send My Booking</span>
                    <svg className="submit-arrow" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Gallery Lightbox */}
      {activeLightboxImg && (
        <div className="gallery-lightbox" onClick={() => setActiveLightboxImg(null)}>
          <div className="lightbox-backdrop"></div>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setActiveLightboxImg(null)} aria-label="Close Lightbox">
              <svg viewBox="0 0 24 24" className="close-icon" style={{ width: "24px", height: "24px" }}>
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></line>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></line>
              </svg>
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={activeLightboxImg} alt="Enlarged wedding memory" className="lightbox-img" />
          </div>
        </div>
      )}
    </>
  );
}
