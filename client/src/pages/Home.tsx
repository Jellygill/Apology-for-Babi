import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Reusable soft fade-in component
const FadeIn = ({
  children,
  delay = 0,
  duration = 1.2,
  className = ""
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 25 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-15%" }}
    transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    className={className}
  >
    {children}
  </motion.div>
);

const FORMSPREE_URL = "https://formspree.io/f/xbdabggo";

export default function Home() {
  const [showReveal, setShowReveal] = useState(false);
  const [address, setAddress] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const { toast } = useToast();

  const handleRevealClick = () => {
    setShowReveal(true);
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth"
      });
    }, 100);
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

      if (res.ok) {
        setIsSubmitted(true);
        toast({
          title: "Message sent.",
          description: "Thank you for sharing this with me. 🤍",
          duration: 5000,
        });
      } else {
        throw new Error("Failed to send");
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Oops.",
        description: "Something went wrong, please try again.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full overflow-hidden selection:bg-primary/20">

      {/* 1. Landing / Emotional Hook */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <FadeIn>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-medium text-foreground mb-16 italic">
            Hi babi <Heart className="inline-block w-8 h-8 md:w-12 md:h-12 ml-2 text-primary/80" strokeWidth={1.5} fill="currentColor" />
          </h1>
        </FadeIn>

        <FadeIn delay={0.8}>
          <p className="text-lg md:text-2xl font-sans font-light tracking-wide text-muted-foreground text-balance">
            This little page is only for you.
          </p>
        </FadeIn>
      </section>

      {/* 2. Gentle Build-Up */}
      <section className="min-h-[70vh] flex items-center justify-center px-6 py-24 text-center">
        <FadeIn className="max-w-2xl mx-auto">
          <p className="text-xl md:text-3xl font-display leading-relaxed text-foreground/80 text-balance">
            I didn't want to just send a message. <br className="hidden md:block" />
            <span className="mt-4 block italic text-foreground">You deserve something more personal.</span>
          </p>
        </FadeIn>
      </section>

      {/* 3. Handwritten Letter (Main Focus) */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-24">
        <FadeIn className="w-full max-w-3xl">
          <div className="glass-card rounded-3xl p-8 md:p-16 relative transform -rotate-1 hover:rotate-0 transition-transform duration-700 ease-out">
            <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
              <Heart className="w-24 h-24 text-primary" strokeWidth={1} />
            </div>

            <p className="font-sans text-muted-foreground text-sm uppercase tracking-widest mb-10">
              Every word here is sincere.
            </p>

            <div className="space-y-8 font-display text-lg md:text-2xl leading-loose text-foreground/90">
              <p>
                I've been thinking a lot about you lately. About the moments we share, the quiet understandings, and how much light you bring into my life.
              </p>
              <p>
                Sometimes words on a screen aren't enough to capture how much I appreciate you. I wanted to create a little space, far away from the noise, just to remind you of that.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 4. Emotional Micro-Lines */}
      <section className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-24 gap-16 md:gap-24 text-center">
        <FadeIn delay={0.1}>
          <h2 className="text-3xl md:text-5xl font-display text-foreground/70">No excuses.</h2>
        </FadeIn>
        <FadeIn delay={0.3}>
          <h2 className="text-3xl md:text-5xl font-display text-foreground/80">Only honesty.</h2>
        </FadeIn>
        <FadeIn delay={0.5}>
          <h2 className="text-3xl md:text-5xl font-display text-foreground italic">Only you.</h2>
        </FadeIn>
      </section>

      {/* 5. Warm Reassurance */}
      <section className="min-h-[50vh] flex items-center justify-center px-6 py-24 text-center">
        <FadeIn>
          <p className="text-2xl md:text-4xl font-sans font-light tracking-wide text-foreground/90 text-balance">
            You are deeply important to me, babi.
          </p>
        </FadeIn>
      </section>

      {/* 6. Button Moment & 7. Reveal */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24 pb-48">
        <AnimatePresence mode="wait">
          {!showReveal ? (
            <motion.div
              key="button-reveal"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center"
            >
              <motion.div
                animate={{
                  boxShadow: ["0px 0px 0px 0px rgba(220,130,150,0.4)", "0px 0px 30px 10px rgba(220,130,150,0)", "0px 0px 0px 0px rgba(220,130,150,0)"]
                }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="rounded-full"
              >
                <Button
                  onClick={handleRevealClick}
                  className="px-8 py-8 md:px-12 md:py-8 rounded-full bg-primary hover:bg-primary/90 text-white font-sans text-lg md:text-xl font-light shadow-xl shadow-primary/25 transition-all duration-500 hover:scale-105"
                >
                  Babi… one more thing.
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="form-reveal"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="w-full max-w-2xl mx-auto"
            >
              {!isSubmitted ? (
                <div className="glass-card rounded-3xl p-8 md:p-12 text-center">
                  <p className="text-xl md:text-2xl font-display leading-relaxed text-foreground/90 mb-8">
                    There's something I've been wanting to send you — something small, but filled with love.
                    If you're comfortable sharing it with me, may I know the address where I can send my little surprise?
                    <br /><br />
                    <span className="text-muted-foreground text-lg italic">
                      No pressure… I just wanted to ask you this in a special way.
                    </span>
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6 mt-10">
                    <div className="relative">
                      <Textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Where can I send it?..."
                        className="min-h-[120px] resize-none bg-white/50 border-white/40 focus:border-primary/50 focus:ring-primary/20 rounded-2xl text-lg p-6 shadow-inner placeholder:text-muted-foreground/60 transition-all duration-300"
                        disabled={isPending}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isPending || !address.trim()}
                      className="w-full sm:w-auto px-12 py-7 rounded-2xl bg-primary hover:bg-primary/90 text-white font-sans text-lg tracking-wide shadow-lg shadow-primary/20 transition-all duration-300 disabled:opacity-50 disabled:scale-100 hover:scale-[1.02]"
                    >
                      {isPending ? "Sending..." : "Share with me 🤍"}
                    </Button>
                  </form>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <Heart className="w-16 h-16 text-primary mx-auto mb-8 animate-pulse" strokeWidth={1} fill="currentColor" />
                  <h3 className="text-3xl font-display text-foreground mb-4">Thank you.</h3>
                  <p className="text-xl font-sans font-light text-muted-foreground">
                    Your secret is safe with me. I'll prepare something special.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

    </div>
  );
}
