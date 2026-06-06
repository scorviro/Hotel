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
  const imageCache = useRef(new Map());
  const abortControllers = useRef(new Map());
  const TOTAL_FRAMES = 1073;
  const WINDOW_SIZE = 30;
  const screenMetrics = useRef({ width: 0, height: 0, scale: 1, offsetX: 0, offsetY: 0 });
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
  const [bgLoaded, setBgLoaded] = useState(false);
  const [scrollSpacerHeight, setScrollSpacerHeight] = useState("14000vh");
  const isGalleryActiveRef = useRef(false);
  const galleryTimelineRef = useRef(null);
  const galleryRef = useRef(null);
  const [isPreloading, setIsPreloading] = useState(true);

  const getScrollMultipliers = () => {
    if (typeof window === "undefined") {
      return {
        videoMax: 99,
        animationRange: 140,
        contactVisible: 138,
        spacerHeight: "14000vh"
      };
    }
    const isMobile = window.innerWidth <= 768;
    return {
      videoMax: isMobile ? 30 : 99,
      animationRange: isMobile ? 42 : 140,
      contactVisible: isMobile ? 40 : 138,
      spacerHeight: isMobile ? "4200vh" : "14000vh"
    };
  };
  const isPreloadingRef = useRef(true);
  const contactWrapperRef = useRef(null);
  const contactTitleRef = useRef(null);
  const contactInfoCardRef = useRef(null);
  const contactFormCardRef = useRef(null);
  const contactMapRef = useRef(null);
  const spacerRef = useRef(null);
  const contactWrapperHeightRef = useRef(1500);

  // Cache display dimensions to avoid layout reads in render loop
  const canvasDimensionsRef = useRef({ width: 1024, height: 768, dpr: 1 });
  // Sliding window active range tracking
  const windowRangeRef = useRef({ start: -1, end: -1 });

  // Secure Front-End Validation Helper (Cybersecurity Focused)
  const validateForm = (data) => {
    const { fullname, phone, email, checkin, checkout } = data;

    // 1. Cybersecurity Check: XSS Injection Detection
    const xssPattern = /<[^>]*>|javascript:|onerror|onload|onclick|eval/i;
    for (const key in data) {
      if (data[key] && xssPattern.test(data[key])) {
        return {
          valid: false,
          error: "Security Alert: Potential script injection attempt blocked."
        };
      }
    }

    // 2. Full Name Validation: Alphabets and spaces only, 2-50 chars
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    if (!fullname || !nameRegex.test(fullname.trim())) {
      return {
        valid: false,
        error: "Invalid Name: Name should be 2-50 characters long and contain only letters."
      };
    }

    // 3. Phone Validation: 10-15 digits, digits/spaces/dashes/plus sign allowed
    const phoneRegex = /^\+?[0-9\s\-]{10,15}$/;
    if (!phone || !phoneRegex.test(phone.replace(/\s+/g, ''))) {
      return {
        valid: false,
        error: "Invalid Phone Number: Please enter a valid phone number (10 to 15 digits)."
      };
    }

    // 4. Email Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email.trim())) {
      return {
        valid: false,
        error: "Invalid Email Address: Please enter a valid email format."
      };
    }

    // 5. Date Logic Validation
    if (!checkin || !checkout) {
      return {
        valid: false,
        error: "Booking Error: Check-in and check-out dates are required."
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkinDate = new Date(checkin);
    checkinDate.setHours(0, 0, 0, 0);
    const checkoutDate = new Date(checkout);
    checkoutDate.setHours(0, 0, 0, 0);

    if (checkinDate < today) {
      return {
        valid: false,
        error: "Booking Error: Check-in date cannot be in the past."
      };
    }

    if (checkoutDate <= checkinDate) {
      return {
        valid: false,
        error: "Booking Error: Check-out date must be after the check-in date."
      };
    }

    return { valid: true };
  };

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

  // Pre-load, resize, layout, sliding window memory cache, and render loops
  // Pre-calculated Layout Math (CPU Optimization)
  const calculateLayout = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset scale transform first
    ctx.scale(dpr, dpr);

    const scale = Math.max(window.innerWidth / 1920, window.innerHeight / 1080);
    const offsetX = (window.innerWidth - 1920 * scale) / 2;
    const offsetY = (window.innerHeight - 1080 * scale) / 2;

    screenMetrics.current = {
      scale,
      offsetX,
      offsetY
    };



    if (!isPreloadingRef.current) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const easedScrollRatio = scrollState.current.current;
      const easedScrollTop = easedScrollRatio * docHeight;
      const multipliers = getScrollMultipliers();
      const videoMaxScroll = window.innerHeight * multipliers.videoMax;
      const videoProgress = Math.min(1.0, Math.max(0.0, easedScrollTop / videoMaxScroll));
      const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(videoProgress * (TOTAL_FRAMES - 1))));
      drawFrame(frameIndex);
    }
  };

  // Preload individual frame off-main-thread and convert to ImageBitmap
  const preloadImage = (index) => {
    const paddedIndex = (index + 1).toString().padStart(6, "0");
    const imagePath = `/frames/frame_${paddedIndex}.webp`;

    if (abortControllers.current.has(index)) {
      abortControllers.current.get(index).abort();
    }
    const controller = new AbortController();
    abortControllers.current.set(index, controller);

    const promise = fetch(imagePath, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.blob();
      })
      .then((blob) => createImageBitmap(blob))
      .then((bitmap) => {
        if (imageCache.current.get(index) === promise) {
          imageCache.current.set(index, bitmap);
        } else {
          bitmap.close();
        }
        return bitmap;
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.warn(`Failed to preload frame ${index}:`, err.message);
        }
        if (imageCache.current.get(index) === promise) {
          imageCache.current.delete(index);
        }
        return null;
      })
      .finally(() => {
        if (abortControllers.current.get(index) === controller) {
          abortControllers.current.delete(index);
        }
      });
    return promise;
  };

  // Sliding Window Memory Cache / Garbage Collector (RAM Optimization)
  const manageMemoryWindow = (currentIndex) => {
    const start = Math.max(0, currentIndex - WINDOW_SIZE);
    const end = Math.min(TOTAL_FRAMES - 1, currentIndex + WINDOW_SIZE);

    for (let i = start; i <= end; i++) {
      if (!imageCache.current.has(i)) {
        const promise = preloadImage(i);
        imageCache.current.set(i, promise);
      }
    }

    for (const [key, entry] of imageCache.current.entries()) {
      if (key < start || key > end) {
        if (abortControllers.current.has(key)) {
          abortControllers.current.get(key).abort();
          abortControllers.current.delete(key);
        }
        if (entry) {
          if (!(entry instanceof Promise)) {
            entry.close(); // Instantly flush the dedicated GPU RAM allocation
          }
        }
        imageCache.current.delete(key);
      }
    }
  };

  // Dumb Render Loop (GPU Optimization)
  const drawFrame = (frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scrollVal = frameIndex / (TOTAL_FRAMES - 1);
    const displayIndex = frameIndex + 1;

    manageMemoryWindow(frameIndex);

    if (screenMetrics.current.scale === 1 && screenMetrics.current.offsetX === 0 && screenMetrics.current.offsetY === 0) {
      calculateLayout();
    }

    const img = imageCache.current.get(frameIndex);
    const { scale, offsetX, offsetY } = screenMetrics.current;

    const drawImg = (bitmap) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.drawImage(bitmap, offsetX, offsetY, 1920 * scale, 1080 * scale);
    };

    if (img && !(img instanceof Promise)) {
      drawImg(img);
    } else {
      let fallbackImg = null;
      let minDistance = Infinity;
      for (const [key, cachedImg] of imageCache.current.entries()) {
        if (cachedImg && !(cachedImg instanceof Promise)) {
          const dist = Math.abs(key - frameIndex);
          if (dist < minDistance) {
            minDistance = dist;
            fallbackImg = cachedImg;
          }
        }
      }
      if (fallbackImg) {
        drawImg(fallbackImg);
      }
    }

    // Update DOM sections based on frame index
    if (scrollTitleRef.current) {
      if (displayIndex >= 1 && displayIndex <= 118) {
        if (scrollVal > 0.001) {
          hasScrolledRef.current = true;
          let opacity = 1;
          if (displayIndex > 95) {
            opacity = Math.max(0, 1 - (displayIndex - 95) / 23);
          }

          const progress = (displayIndex - 1) / 117;
          const translateY = -progress * 60;

          if (scrollTitleRef.current.style.display !== "flex") {
            scrollTitleRef.current.style.display = "flex";
          }
          scrollTitleRef.current.style.opacity = opacity;
          scrollTitleRef.current.style.transform = `translate(-50%, calc(-50% + ${translateY}px))`;
        } else if (hasScrolledRef.current) {
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

    if (receptionRef.current) {
      if (displayIndex >= 270 && displayIndex <= 390) {
        let opacity = 1;
        if (displayIndex < 290) {
          opacity = (displayIndex - 270) / 20;
        } else if (displayIndex > 365) {
          opacity = Math.max(0, 1 - (displayIndex - 365) / 25);
        }

        const progress = (displayIndex - 270) / 120;
        const translateY = -progress * 50;

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

    if (diningRef.current) {
      if (displayIndex >= 450 && displayIndex <= 580) {
        let opacity = 1;
        if (displayIndex < 470) {
          opacity = (displayIndex - 450) / 20;
        } else if (displayIndex > 550) {
          opacity = Math.max(0, 1 - (displayIndex - 550) / 30);
        }

        const progress = (displayIndex - 450) / 130;
        const translateY = -progress * 50;

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

    if (elevatorRef.current) {
      if (displayIndex >= 620 && displayIndex <= 700) {
        let opacity = 1;
        if (displayIndex < 640) {
          opacity = (displayIndex - 620) / 20;
        } else if (displayIndex > 680) {
          opacity = Math.max(0, 1 - (displayIndex - 680) / 20);
        }

        const progress = (displayIndex - 620) / 80;
        const translateY = -progress * 55;

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

    if (floorRef.current) {
      if (displayIndex >= 700 && displayIndex <= 780) {
        let opacity = 1;
        if (displayIndex < 715) {
          opacity = (displayIndex - 700) / 15;
        } else if (displayIndex > 765) {
          opacity = Math.max(0, 1 - (displayIndex - 765) / 15);
        }

        const progress = (displayIndex - 700) / 80;
        const translateY = -progress * 40;

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

    if (bedroomRef.current) {
      if (displayIndex >= 840 && displayIndex <= 980) {
        let opacity = 1;
        if (displayIndex < 860) {
          opacity = (displayIndex - 840) / 20;
        } else if (displayIndex > 950) {
          opacity = Math.max(0, 1 - (displayIndex - 950) / 30);
        }

        const progress = (displayIndex - 840) / 140;
        const translateY = -progress * 50;

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

    if (banquetRef.current) {
      if (displayIndex >= 1000) {
        let opacity = 1;
        if (displayIndex < 1015) {
          opacity = (displayIndex - 1000) / 15;
        }

        const progress = Math.min(1, (displayIndex - 1000) / 73);
        const translateY = -progress * 45;

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
  };

  // Preload gallery images
  useEffect(() => {
    galleryImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Cleanup old service workers and caches from previous localhost projects (e.g. the industrial project)
  useEffect(() => {
    if (typeof window !== "undefined") {
      let needsReload = false;
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (let registration of registrations) {
            registration.unregister();
            needsReload = true;
          }
          if (needsReload) {
            console.log("Cleared old service worker from localhost. Reloading page...");
            window.location.reload();
          }
        });
      }
      if ("caches" in window) {
        caches.keys().then((keys) => {
          keys.forEach((key) => {
            caches.delete(key);
          });
        });
      }
    }
  }, []);

  // Chunked Initial Loading (Network Optimization)
  useEffect(() => {
    let active = true;

    const preloaderTimeout = setTimeout(() => {
      if (active && isPreloadingRef.current) {
        console.warn("Preloader safety timeout fallback triggered.");
        setIsPreloading(false);
        isPreloadingRef.current = false;
        if (typeof window !== 'undefined') {
          window.isPreloading = false;
        }
      }
    }, 5000);

    const preloadRemainingChunks = (currentChunkStart = 50) => {
      if (!active || currentChunkStart >= TOTAL_FRAMES) return;
      const CHUNK_SIZE = 50;

      const requestIdle = typeof window !== 'undefined' && window.requestIdleCallback
        ? window.requestIdleCallback
        : (cb) => setTimeout(cb, 1);

      requestIdle(() => {
        if (!active) return;
        const end = Math.min(TOTAL_FRAMES - 1, currentChunkStart + CHUNK_SIZE - 1);
        for (let i = currentChunkStart; i <= end; i++) {
          const paddedIndex = (i + 1).toString().padStart(6, "0");
          const imagePath = `/frames/frame_${paddedIndex}.webp`;
          fetch(imagePath, { priority: 'low' }).catch(() => { });
        }
        preloadRemainingChunks(currentChunkStart + CHUNK_SIZE);
      });
    };

    const loadFirstFifty = async () => {
      const promises = [];
      for (let i = 0; i < 50; i++) {
        const promise = preloadImage(i);
        imageCache.current.set(i, promise);
        promises.push(promise);
      }

      await Promise.all(promises);

      if (active && isPreloadingRef.current) {
        console.log("Preloaded initial 50 frames with ImageBitmap. Unlocking UI...");
        clearTimeout(preloaderTimeout);
        setIsPreloading(false);
        isPreloadingRef.current = false;
        if (typeof window !== 'undefined') {
          window.isPreloading = false;
        }
        // Start background chunking engine
        preloadRemainingChunks(50);
      }
    };

    loadFirstFifty();

    return () => {
      active = false;
      clearTimeout(preloaderTimeout);
    };
  }, []);

  // Drawing loop and lifecycle setup
  useEffect(() => {
    const handleResize = () => {
      calculateLayout();
      const multipliers = getScrollMultipliers();
      setScrollSpacerHeight(multipliers.spacerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    let animationFrameId;
    const tick = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      let scrollTop = window.scrollY;

      if (isPreloadingRef.current) {
        scrollState.current.current = 0;
        scrollState.current.target = 0;
        scrollTop = 0;
      }

      let target = docHeight > 0 ? scrollTop / docHeight : 0;
      if (scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 5) {
        target = 1.0;
      } else if (scrollTop <= 5) {
        target = 0.0;
      }
      scrollState.current.target = target;

      const diff = Math.abs(scrollState.current.target - scrollState.current.current);
      if (diff > 0.0001) {
        scrollState.current.current += (scrollState.current.target - scrollState.current.current) * 0.05;
      } else if (scrollState.current.current !== scrollState.current.target) {
        scrollState.current.current = scrollState.current.target;
      }

      const easedScrollRatio = scrollState.current.current;
      const easedScrollTop = easedScrollRatio * docHeight;
      const multipliers = getScrollMultipliers();
      const videoMaxScroll = window.innerHeight * multipliers.videoMax;
      const animationRange = window.innerHeight * multipliers.animationRange;

      const videoProgress = Math.min(1.0, Math.max(0.0, easedScrollTop / videoMaxScroll));
      const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(videoProgress * (TOTAL_FRAMES - 1))));
      drawFrame(frameIndex);

      const galleryProgress = Math.min(1.0, Math.max(0.0, (easedScrollTop - videoMaxScroll) / (animationRange - videoMaxScroll)));
      if (galleryTimelineRef.current) {
        galleryTimelineRef.current.progress(galleryProgress);
      }

      // Keep canvas and gallery fully visible in the background as the contact page scrolls over them
      const fixedOpacity = 1;
      if (canvasRef.current) {
        canvasRef.current.style.opacity = fixedOpacity;
      }
      if (galleryRef.current) {
        galleryRef.current.style.opacity = fixedOpacity;
        galleryRef.current.style.pointerEvents = "auto";
      }

      if (contactWrapperRef.current) {
        const contactVisible = easedScrollTop > (window.innerHeight * multipliers.contactVisible);
        if (contactVisible) {
          contactWrapperRef.current.classList.add("visible");
        } else {
          contactWrapperRef.current.classList.remove("visible");
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("resize", handleResize);
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
      // Grid-based layout for premium scattering on the right side
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

      // Add to animation timeline with stagger
      const startTime = index * 0.38;
      tl.to(card, {
        x: `${targetX}vw`,
        y: `${targetY}vh`,
        rotation: targetRot,
        opacity: 1,
        scale: 1,
        duration: 1.6,
        ease: "back.out(1.2)",
      }, startTime);
    });

    return () => {
      if (galleryTimelineRef.current) {
        galleryTimelineRef.current.kill();
      }
    };
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

    const handleGlobalError = (e) => {
      if (e && e.message && (
        e.message.includes("Blocked a frame with origin") ||
        e.message.includes("Failed to read a named property")
      )) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleUnhandledRejection = (e) => {
      if (e && e.reason && e.reason.message && (
        e.reason.message.includes("Blocked a frame with origin") ||
        e.reason.message.includes("Failed to read a named property")
      )) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener('error', handleGlobalError, true);
    window.addEventListener('unhandledrejection', handleUnhandledRejection, true);

    window.addEventListener('DOMMouseScroll', preventDefault, { passive: false });
    window.addEventListener(wheelEvent, preventDefault, { passive: false });
    window.addEventListener('touchmove', preventDefault, { passive: false });
    window.addEventListener('keydown', preventDefaultForScrollKeys, { passive: false });

    // Force page to 0 immediately on mount/reload
    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener('error', handleGlobalError, true);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
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
          <img
            src="/frames/frame_000001.webp"
            alt="First Frame placeholder"
            className="bg-frame"
            onLoad={() => setBgLoaded(true)}
            style={{ opacity: bgLoaded ? 1 : 0, transition: "opacity 0.2s ease" }}
          />
          <canvas ref={canvasRef}></canvas>
          {/* Gallery Collage Section */}
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

          {/* Dynamic Scroll Spacer aligned to adjusted animation range */}
          <div className="scroll-spacer" style={{ height: scrollSpacerHeight }}></div>

          {/* Wrapper for Contact & Footer in stable structural document flow */}
          <div
            className="contact-footer-wrapper"
            ref={contactWrapperRef}
          >
            {/* New Premium Contact Experience Section */}
            <section className="premium-contact-section" id="contact-experience">

              {/* Top Title Banner */}
              <div className="contact-banner-gradient">
                <h1 className="contact-banner-title">Contact Us</h1>
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
                            <path d="M6.62 10.79a15.15 15.15 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.11-.27c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.26 1.1l-2.2 2.22z" fill="currentColor" />
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
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor" />
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
                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor" />
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
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor" />
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

                    <form className="ui-enquiry-form" onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target;
                      const formData = {
                        fullname: form.querySelector('input[type="text"]').value,
                        phone: form.querySelector('input[type="tel"]').value,
                        email: form.querySelector('input[type="email"]').value,
                        checkin: form.querySelectorAll('input[type="date"]')[0].value,
                        checkout: form.querySelectorAll('input[type="date"]')[1].value,
                        requirements: form.querySelector('textarea').value,
                      };
                      const validation = validateForm(formData);
                      if (!validation.valid) {
                        alert(validation.error);
                        return;
                      }
                      const escapedName = formData.fullname.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                      alert(`Enquiry Sent Successfully for ${escapedName}! A dedicated associate will contact you shortly.`);
                    }}>
                      <div className="form-row-2-ui">
                        <div className="form-field-ui">
                          <label className="ui-field-label">Full Name *</label>
                          <input type="text" required maxLength={50} className="ui-input-field" />
                        </div>
                        <div className="form-field-ui">
                          <label className="ui-field-label">Phone Number *</label>
                          <input type="tel" required maxLength={15} className="ui-input-field" />
                        </div>
                      </div>

                      <div className="form-row-2-ui">
                        <div className="form-field-ui">
                          <label className="ui-field-label">Email Address *</label>
                          <input type="email" required maxLength={100} className="ui-input-field" />
                        </div>
                        <div className="form-field-ui">
                          <label className="ui-field-label">Number of Guests *</label>
                          <select defaultValue="2" required className="ui-select-field">
                            <option value="1">1 Guest</option>
                            <option value="2">2 Guests</option>
                            <option value="3">3 Guests</option>
                            <option value="4">4 Guests</option>
                            <option value="5">5 Guests</option>
                            <option value="6">6 Guests</option>
                            <option value="7">7 Guests</option>
                            <option value="8">8+ Guests</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-row-2-ui">
                        <div className="form-field-ui">
                          <label className="ui-field-label">Check-in Date *</label>
                          <input type="date" required className="ui-input-field" style={{ colorScheme: "light" }} />
                        </div>
                        <div className="form-field-ui">
                          <label className="ui-field-label">Check-out Date *</label>
                          <input type="date" required className="ui-input-field" style={{ colorScheme: "light" }} />
                        </div>
                      </div>

                      <div className="form-field-ui full-width-ui">
                        <label className="ui-field-label">Select Room / Service *</label>
                        <select defaultValue="club" required className="ui-select-field">
                          <option value="club">Club Room</option>
                          <option value="quad">Quad Room</option>
                          <option value="suite">Suite Room</option>
                          <option value="super_deluxe">Super Deluxe Room</option>
                          <option value="banquet">Banquet Hall Enquiry</option>
                          <option value="other">General Enquiry</option>
                        </select>
                      </div>

                      <div className="form-field-ui full-width-ui">
                        <label className="ui-field-label">Special Requirements</label>
                        <textarea maxLength={500} className="ui-textarea-field" rows="4"></textarea>
                      </div>

                      <button type="submit" className="ui-submit-btn">
                        <span>Send My Enquiry</span>
                        <div className="submit-btn-arrow-circle">
                          <svg viewBox="0 0 24 24" className="submit-btn-arrow-svg">
                            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
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
                        <svg viewBox="0 0 24 24" className="social-svg-ui"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="currentColor" /></svg>
                      </a>
                      <a href="#" className="social-btn-ui" aria-label="Instagram">
                        <svg viewBox="0 0 24 24" className="social-svg-ui"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" fill="currentColor" /></svg>
                      </a>
                      <a href="#" className="social-btn-ui" aria-label="LinkedIn">
                        <svg viewBox="0 0 24 24" className="social-svg-ui"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fill="currentColor" /></svg>
                      </a>
                      <a href="#" className="social-btn-ui" aria-label="YouTube">
                        <svg viewBox="0 0 24 24" className="social-svg-ui"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.555a3.003 3.003 0 0 0-2.11 2.108C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.482 20.5 12 20.5 12 20.5s7.518 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor" /></svg>
                      </a>
                    </div>
                  </div>

                  {/* Column 2: Contact Info */}
                  <div className="footer-col contact-col">
                    <h3 className="footer-col-title">Contact Us</h3>
                    <div className="footer-contact-info-list">
                      <p className="footer-contact-item">
                        <svg viewBox="0 0 24 24" className="footer-contact-icon-svg"><path d="M6.62 10.79a15.15 15.15 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.11-.27c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.26 1.1l-2.2 2.22z" fill="currentColor" /></svg>
                        <span>+91 82382 82341 | +91 82382 82361</span>
                      </p>
                      <p className="footer-contact-item">
                        <svg viewBox="0 0 24 24" className="footer-contact-icon-svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor" /></svg>
                        <span>150 Ft. Ring Road, Nr. Sokhda Chowkdi, Rajkot</span>
                      </p>
                      <p className="footer-contact-item">
                        <svg viewBox="0 0 24 24" className="footer-contact-icon-svg"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor" /></svg>
                        <span>Hoteltheblackstone@gmail.com</span>
                      </p>
                      <p className="footer-contact-item">
                        <svg viewBox="0 0 24 24" className="footer-contact-icon-svg"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor" /></svg>
                        <span>24/7 Front Desk / Guest Relations</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="footer-bottom-line"></div>

                <div className="footer-bottom-ui">
                  <p className="footer-copyright-ui">
                    &copy; 2026 The Blackstone Hotel. All Rights Reserved. | Website designed and developed by <a href="https://scorviro.vercel.app/" target="_blank" rel="noopener noreferrer" className="creator-link"><img src="/favicon.png" alt="scorviro logo" className="scorviro-footer-logo" /><span>scorviro</span></a>
                  </p>
                </div>

              </div>
            </footer>
          </div>
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

                <form className="premium-enquiry-form" onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target;
                  const formData = {
                    fullname: form.querySelector('#fullname').value,
                    phone: form.querySelector('#phone').value,
                    email: form.querySelector('#email').value,
                    checkin: form.querySelector('#checkin').value,
                    checkout: form.querySelector('#checkout').value,
                    requirements: form.querySelector('#requirements').value,
                  };
                  const validation = validateForm(formData);
                  if (!validation.valid) {
                    alert(validation.error);
                    return;
                  }
                  const escapedName = formData.fullname.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                  alert(`Booking Enquiry Sent Successfully for ${escapedName}! A dedicated associate will contact you shortly.`);
                  setIsContactOpen(false);
                }}>
                  <div className="form-row-2">
                    <div className="form-group floating-group">
                      <input type="text" id="fullname" required maxLength={50} placeholder=" " className="premium-input" />
                      <label htmlFor="fullname" className="premium-label">Full Name *</label>
                      <div className="input-focus-line"></div>
                    </div>
                    <div className="form-group floating-group">
                      <input type="tel" id="phone" required maxLength={15} placeholder=" " className="premium-input" />
                      <label htmlFor="phone" className="premium-label">Phone Number *</label>
                      <div className="input-focus-line"></div>
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group floating-group">
                      <input type="email" id="email" required maxLength={100} placeholder=" " className="premium-input" />
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
                    <textarea id="requirements" maxLength={500} placeholder="Special Requirements (dietary preferences, airport pickup, bedding layout, etc.)" className="premium-textarea" rows="3"></textarea>
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
