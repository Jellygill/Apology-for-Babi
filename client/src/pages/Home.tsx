import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Heart, SkipForward, Play, Pause, Music2, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import letterImage from "@assets/letter.png";

const FORMSPREE_URL = "https://formspree.io/f/xbdabggo";

/* ── Music tracks ── */
const TRACKS = [
  { title: "From The Start", artist: "Laufey", src: "/Apology-for-Babi/assets/music/from-the-start.mp3" },
  { title: "Do I Wanna Know (BBC Live)", artist: "Hozier", src: "/Apology-for-Babi/assets/music/do-i-wanna-know.mp3" },
  { title: "I Wish You Love", artist: "Laufey", src: "/Apology-for-Babi/assets/music/i-wish-you-love.mp3" },
  { title: "I Thought I Saw Your Face Today", artist: "She & Him", src: "/Apology-for-Babi/assets/music/she-and-him.mp3" },
  { title: "Baby One More Time", artist: "The Marías", src: "/Apology-for-Babi/assets/music/baby-one-more-time.mp3" },
  { title: "No One Noticed", artist: "The Marías", src: "/Apology-for-Babi/assets/music/no-one-noticed.mp3" },
  { title: "Over The Moon", artist: "The Marías", src: "/Apology-for-Babi/assets/music/over-the-moon.mp3" },
  { title: "Sienna", artist: "The Marías", src: "/Apology-for-Babi/assets/music/sienna.mp3" },
  { title: "I Love You So", artist: "The Walters", src: "/Apology-for-Babi/assets/music/i-love-you-so.mp3" },
];

/* ── Floating Petals ── */
function Petals() {
  return (
    <div className="petal-container">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="petal" />
      ))}
    </div>
  );
}

/* ── Ambient Orbs ── */
function AmbientOrbs() {
  return (
    <>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
    </>
  );
}

/* ── Custom Cursor ── */
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", move);
    let raf: number;
    const animateRing = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }
      raf = requestAnimationFrame(animateRing);
    };
    raf = requestAnimationFrame(animateRing);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

/* ── Sparkle Trail ── */
function SparkleTrail() {
  useEffect(() => {
    const colors = ["hsl(335,90%,70%)", "hsl(320,85%,75%)", "hsl(350,80%,75%)", "hsl(340,95%,65%)"];
    let last = 0;
    const move = (e: MouseEvent) => {
      const now = Date.now();
      if (now - last < 40) return;
      last = now;
      const el = document.createElement("div");
      el.className = "sparkle";
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.width = el.style.height = `${4 + Math.random() * 5}px`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 800);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return null;
}

/* ── Confetti Burst ── */
function launchConfetti() {
  const colors = ["#ff6b9d", "#ff8fab", "#ffb3c6", "#ff4d6d", "#c77dff", "#e0aaff", "#ff9de2", "#ffccd5"];
  for (let i = 0; i < 70; i++) {
    const el = document.createElement("div");
    el.className = "confetti-piece";
    el.style.left = `${30 + Math.random() * 40}%`;
    el.style.top = `${20 + Math.random() * 30}%`;
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    el.style.width = el.style.height = `${6 + Math.random() * 8}px`;
    el.style.animationDelay = `${Math.random() * 0.5}s`;
    el.style.animationDuration = `${1 + Math.random() * 1}s`;
    el.style.transform = `translate(${(Math.random() - 0.5) * 400}px, 0)`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }
}

/* ── Floating Heart on click ── */
function FloatingHeartOnClick() {
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("form, button, textarea, audio")) return;
      const id = Date.now() + Math.random();
      setHearts(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setHearts(prev => prev.filter(h => h.id !== id)), 1400);
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);
  return (
    <>
      {hearts.map(h => (
        <motion.div key={h.id} initial={{ opacity: 1, y: 0, scale: 0.6 }} animate={{ opacity: 0, y: -80, scale: 1.2 }}
          transition={{ duration: 1.3, ease: "easeOut" }}
          style={{ position: "fixed", left: h.x, top: h.y, pointerEvents: "none", zIndex: 9996, translateX: "-50%", translateY: "-50%" }}>
          <Heart className="w-6 h-6 text-primary" fill="currentColor" />
        </motion.div>
      ))}
    </>
  );
}

/* ── Fade-in ── */
const FadeIn = ({ children, delay = 0, duration = 1.2, className = "", y = 30 }: {
  children: React.ReactNode; delay?: number; duration?: number; className?: string; y?: number;
}) => (
  <motion.div initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }} transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
    {children}
  </motion.div>
);

/* ── Typewriter ── */
function Typewriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setStarted(true), delay * 1000); return () => clearTimeout(t); }, [delay]);
  useEffect(() => {
    if (!started) return;
    let i = 0;
    const iv = setInterval(() => { setDisplayed(text.slice(0, i + 1)); i++; if (i >= text.length) clearInterval(iv); }, 55);
    return () => clearInterval(iv);
  }, [started, text]);
  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block ml-0.5 w-0.5 h-6 bg-primary align-middle" />
      )}
    </span>
  );
}

/* ════════════════════════════════════════
   MUSIC PLAYER (Spotify-style, compact)
════════════════════════════════════════ */
function MusicPlayer() {
  const [trackIdx, setTrackIdx] = useState(() => Math.floor(Math.random() * TRACKS.length));
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const track = TRACKS[trackIdx];

  const goNext = useCallback(() => {
    setTrackIdx(i => (i + 1) % TRACKS.length);
    setProgress(0);
  }, []);

  // When track changes, auto-play if was playing
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = track.src;
    audio.load();
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [trackIdx]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => goNext();
    const onTimeUpdate = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    return () => { audio.removeEventListener("ended", onEnded); audio.removeEventListener("timeupdate", onTimeUpdate); };
  }, [goNext]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handleSkip = () => {
    goNext();
    if (isPlaying) {
      setTimeout(() => {
        audioRef.current?.play().catch(() => setIsPlaying(false));
      }, 100);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={track.src} preload="none" />
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
            className="fixed bottom-5 left-1/2 z-50"
            style={{ translateX: "-50%" }}
          >
            <div className="glass-card-deep rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl shadow-primary/20 min-w-[280px] max-w-[340px]">
              {/* Album art placeholder — My Melody gif */}
              <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-primary/20">
                <img
                  src="/Apology-for-Babi/assets/images/melody-gif1.gif"
                  alt="My Melody"
                  className="w-full h-full object-cover"
                  style={{ imageRendering: "auto" }}
                />
              </div>

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <motion.p
                  key={track.title}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-sans font-medium text-foreground truncate"
                >
                  {track.title}
                </motion.p>
                <motion.p
                  key={track.artist}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] font-sans text-muted-foreground truncate"
                >
                  {track.artist}
                </motion.p>
                {/* Progress bar */}
                <div className="mt-1.5 h-0.5 bg-primary/15 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={togglePlay}
                  className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                >
                  {isPlaying
                    ? <Pause className="w-3.5 h-3.5 text-primary" />
                    : <Play className="w-3.5 h-3.5 text-primary ml-0.5" />}
                </button>
                <button
                  onClick={handleSkip}
                  className="w-8 h-8 rounded-full hover:bg-primary/10 flex items-center justify-center transition-colors"
                >
                  <SkipForward className="w-3.5 h-3.5 text-primary/70" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════ */
export default function Home() {
  const [showReveal, setShowReveal] = useState(false);
  const [address, setAddress] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const { toast } = useToast();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const handleRevealClick = () => {
    setShowReveal(true);
    setTimeout(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" }), 150);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    setIsPending(true);
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ address }),
      });
      if (res.ok) { setIsSubmitted(true); launchConfetti(); toast({ title: "Message sent.", description: "Thank you for sharing this with me. 🤍", duration: 5000 }); }
      else throw new Error("Failed");
    } catch { toast({ variant: "destructive", title: "Oops.", description: "Something went wrong, please try again." }); }
    finally { setIsPending(false); }
  };

  return (
    <div className="w-full overflow-hidden selection:bg-primary/20 relative">
      <AmbientOrbs />
      <Petals />
      <CustomCursor />
      <SparkleTrail />
      <FloatingHeartOnClick />
      <MusicPlayer />

      <AnimatePresence>
        {isLetterOpen && (
          <motion.div
            key="letter-lightbox"
            className="fixed inset-0 z-[9999] bg-black/45 backdrop-blur-sm flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLetterOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={letterImage}
                alt="Handwritten apology letter for Babi"
                className="w-full h-auto rounded-[32px] shadow-2xl shadow-rose-300/50 border border-white/70 bg-white object-contain touch-pan-y"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll progress bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-300 via-primary to-rose-400 origin-left z-50"
        style={{ scaleX: scrollYProgress }} />

      {/* ── 1. HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10">
          <FadeIn delay={0.1}>
            <motion.p className="font-script text-xl md:text-2xl text-primary/70 mb-6 tracking-widest"
              initial={{ opacity: 0, letterSpacing: "0.5em" }} animate={{ opacity: 1, letterSpacing: "0.2em" }}
              transition={{ duration: 2, delay: 0.3 }}>
              a message, just for you
            </motion.p>
          </FadeIn>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 flex justify-center"
          >
            <motion.img
              src="/Apology-for-Babi/assets/images/melody3.png"
              alt="My Melody"
              className="w-24 md:w-32 lg:w-36 object-contain drop-shadow-lg"
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3.6, ease: "easeInOut" }}
            />
          </motion.div>

          <FadeIn delay={0.4}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-medium text-foreground mb-6 glow-text">
              <motion.span className="inline-block" animate={{ scale: [1, 1.02, 1] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
                Hi babi
              </motion.span>{" "}
              <motion.span className="inline-block heartbeat"
                animate={{ color: ["hsl(335,80%,62%)", "hsl(350,90%,55%)", "hsl(320,80%,62%)", "hsl(335,80%,62%)"] }}
                transition={{ repeat: Infinity, duration: 3.5 }}>
                <Heart className="inline-block w-10 h-10 md:w-14 md:h-14 ml-3" strokeWidth={0} fill="currentColor" />
              </motion.span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.9}>
            <p className="text-lg md:text-2xl font-sans font-light tracking-widest text-muted-foreground">
              <Typewriter text="This little page is only for you." delay={1.2} />
            </p>
          </FadeIn>

          <FadeIn delay={2.2}>
            <motion.div className="mt-20 flex flex-col items-center gap-2 text-primary/40"
              animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <span className="text-xs uppercase tracking-[0.3em] font-sans">scroll</span>
              <div className="w-px h-10 bg-gradient-to-b from-primary/40 to-transparent" />
            </motion.div>
          </FadeIn>
        </motion.div>
      </section>

      {/* ── 2. BUILD-UP ── */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-6 py-24 text-center z-10">
        <FadeIn className="max-w-2xl mx-auto" y={40}>
          <div className="love-divider mb-12">
            <Heart className="w-4 h-4 text-primary/40" fill="currentColor" />
          </div>
          <p className="text-xl md:text-3xl font-display leading-relaxed text-foreground/85 text-balance">
            I didn't want to just send a message.{" "}
            <br className="hidden md:block" />
            <motion.span className="mt-4 block italic text-foreground font-medium"
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}>
              You deserve something more personal.
            </motion.span>
          </p>
        </FadeIn>
      </section>

      {/* ── 3. LETTER ── */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 py-24 z-10">
        <FadeIn className="w-full max-w-3xl" y={50}>
          <motion.div className="glass-card-deep rounded-3xl p-8 md:p-16 relative"
            initial={{ rotate: -1.5 }} whileInView={{ rotate: -0.5 }}
            whileHover={{ rotate: 0, scale: 1.01, boxShadow: "0 30px 80px rgba(220,80,130,0.20)" }}
            viewport={{ once: true }} transition={{ type: "spring", stiffness: 100, damping: 20 }}>

            {/* Melody sits in corner */}
            <motion.img
              src="/Apology-for-Babi/assets/images/melody-gif2.gif"
              alt="My Melody"
              className="absolute -top-10 -right-6 md:-right-10 w-20 md:w-28 object-contain drop-shadow-md pointer-events-none"
              animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            />

            <div className="flex flex-col items-center">
              <motion.button
                type="button"
                onClick={() => setIsLetterOpen(true)}
                className="group relative mb-8 focus:outline-none"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.img
                  src={letterImage}
                  alt="A handwritten apology letter for Babi"
                  className="w-full max-w-xl mx-auto rounded-[32px] shadow-xl shadow-rose-200/60 border border-white/70 bg-white object-contain"
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.button>

              <motion.div
                className="max-w-2xl mx-auto text-center space-y-4 font-sans text-base md:text-lg leading-relaxed text-foreground/85"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.9, delay: 0.1 }}
              >
                <p className="text-primary/75 text-sm md:text-base tracking-[0.18em] uppercase">
                  Every word on this page is for you
                </p>

                <p className="font-display text-lg md:text-xl text-foreground">
                  Hello my Babi,
                </p>

                <p>
                  I want to sincerely apologize for not being honest with you. I know my actions hurt you, and I am truly
                  sorry for the pain and disappointment I caused.
                </p>

                <p>
                  You are very important to me Babi, and it hurts me knowing that I became the reason for your sadness.
                  You never deserved anything less than honesty and respect from me.
                </p>

                <p>
                  I can’t change what happened babi, pero I still want you to know that I genuinely regret my mistake po
                  and I am willing to do better. What we have means so much to me. I love you so much my cutiepie, my
                  wifey, my constant, my babi, my Mary Iris!!!
                </p>

                <p className="font-display text-lg md:text-xl text-primary/85 mt-2">
                  With all my heart,
                  <br />
                  Matty your Babi
                </p>
              </motion.div>
            </div>
          </motion.div>
        </FadeIn>
      </section>

      {/* ── 4. EMOTIONAL WORDS ── */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 py-24 gap-12 md:gap-20 text-center z-10">
        {[
          { text: "No excuses.", opacity: "text-foreground/60", delay: 0 },
          { text: "Only my Babi.", opacity: "text-foreground/80", delay: 0.15 },
          { text: "Always you.", opacity: "text-foreground", delay: 0.3, italic: true },
        ].map(({ text, opacity, delay, italic }) => (
          <motion.h2 key={text} className={`text-3xl md:text-6xl font-display ${opacity} ${italic ? "italic" : ""}`}
            initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-15%" }} transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.04, color: "hsl(335, 80%, 55%)" }}>
            {text}
          </motion.h2>
        ))}

        {/* Floating melody gif between lines */}
        <motion.img
          src="/Apology-for-Babi/assets/images/melody-gif3.gif"
          alt=""
          className="w-20 md:w-28 object-contain pointer-events-none opacity-80"
          animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        />
      </section>

      {/* ── 5. REASSURANCE ── */}
      <section className="relative min-h-[50vh] flex items-center justify-center px-6 py-24 text-center z-10">
        <FadeIn y={30}>
          <motion.p className="text-2xl md:text-5xl font-sans font-light tracking-wide text-foreground/90 text-balance max-w-2xl"
            whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 200 }}>
            You are deeply important to me,{" "}
            <motion.span className="font-display italic text-primary"
              animate={{ color: ["hsl(335,80%,62%)", "hsl(350,90%,55%)", "hsl(320,80%,62%)", "hsl(335,80%,62%)"] }}
              transition={{ repeat: Infinity, duration: 4 }}>
              babi.
            </motion.span>
          </motion.p>

          {/* Melody holding heart — beside the text */}
          <motion.img
            src="/Apology-for-Babi/assets/images/melody2.jpg"
            alt="My Melody with heart"
            className="w-24 md:w-32 mx-auto mt-10 rounded-full object-cover ring-4 ring-primary/20 shadow-xl shadow-primary/20"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />
        </FadeIn>
      </section>

      {/* ── 6. CTA / FORM ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 pb-48 z-10">
        <AnimatePresence mode="wait">
          {!showReveal ? (
            <motion.div key="button-reveal" initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
              transition={{ duration: 1 }} viewport={{ once: true, margin: "-100px" }}
              className="text-center flex flex-col items-center gap-8">

              {/* Melody gif above button */}
              <motion.img
                src="/Apology-for-Babi/assets/images/melody-gif4.gif"
                alt="My Melody"
                className="w-28 md:w-36 object-contain drop-shadow-lg"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              />

              <div className="relative">
                <motion.div className="absolute inset-0 rounded-full bg-primary/20"
                  animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut" }} />
                <motion.div className="absolute inset-0 rounded-full bg-primary/10"
                  animate={{ scale: [1, 2.4, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2.5, delay: 0.4, ease: "easeOut" }} />
                <Button onClick={handleRevealClick}
                  className="relative px-10 py-8 md:px-16 md:py-9 rounded-full bg-primary hover:bg-primary/90 text-white font-sans text-lg md:text-xl font-light shadow-2xl shadow-primary/30 transition-all duration-500 hover:scale-105">
                  <motion.span animate={{ opacity: [1, 0.8, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                    Babi… one more thing.
                  </motion.span>
                </Button>
              </div>

              <motion.p className="text-sm text-muted-foreground/60 font-sans tracking-widest uppercase"
                animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 3 }}>
                tap when you're ready
              </motion.p>
            </motion.div>
          ) : (
            <motion.div key="form-reveal" initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-2xl mx-auto">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div key="form" exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }} transition={{ duration: 0.6 }}>
                    <div className="glass-card-deep rounded-3xl p-8 md:p-14 text-center">
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
                        <img src="/Apology-for-Babi/assets/images/melody1.jpg" alt="My Melody" className="w-16 h-16 rounded-full mx-auto mb-6 object-cover ring-4 ring-primary/20" />
                        <p className="text-xl md:text-2xl font-display leading-relaxed text-foreground/90 mb-8">
                          There's something I've been wanting to send you that is filled with my love po.{" "}
                          <br /><br />
                          If you're comfortable sharing it with me, may I know the address where I can send my little surprise? Yung accurate location po for delivery hehe.
                          <br /><br />
                          <motion.span className="text-muted-foreground text-base italic"
                            animate={{ opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 3 }}>
                            No pressure… I just wanted to ask you this in a special way.
                          </motion.span>
                        </p>
                      </motion.div>

                      <motion.form onSubmit={handleSubmit} className="space-y-5 mt-10"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}>
                        <Textarea value={address} onChange={(e) => setAddress(e.target.value)}
                          placeholder="Where can I send it?..."
                          className="min-h-[120px] resize-none bg-white/60 border-white/50 focus:border-primary/40 rounded-2xl text-lg p-6 shadow-inner placeholder:text-muted-foreground/50 transition-all duration-300 focus:bg-white/80"
                          disabled={isPending} />
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button type="submit" disabled={isPending || !address.trim()}
                            className="w-full sm:w-auto px-14 py-7 rounded-2xl bg-primary hover:bg-primary/90 text-white font-sans text-lg tracking-wide shadow-lg shadow-primary/25 disabled:opacity-50">
                            {isPending ? (
                              <span className="flex items-center gap-2">
                                <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>♥</motion.span>
                                Sending…
                              </span>
                            ) : "Share with me 🤍"}
                          </Button>
                        </motion.div>
                      </motion.form>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="text-center py-20">
                    {/* Celebration melody */}
                    <motion.img src="/Apology-for-Babi/assets/images/melody-gif5.gif" alt="My Melody celebrating"
                      className="w-32 md:w-40 mx-auto mb-6 object-contain drop-shadow-xl"
                      animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
                    <motion.h3 className="text-4xl md:text-5xl font-display text-foreground mb-4"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                      Thank you.
                    </motion.h3>
                    <motion.p className="text-xl font-sans font-light text-muted-foreground max-w-md mx-auto"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                      Your secret is safe with me.<br />I'll prepare something truly special. 🌸
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
