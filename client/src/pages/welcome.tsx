import { useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";
import { getLoginData, isLoggedIn, updateVerificationStatus } from "@/lib/login";
import { initializeAnimations, checkReducedMotion } from "@/lib/meta-utils";
import "@/styles/fonts.css";
import "@/styles/index.css";
import "@/styles/welcome-animations.css";
import "aos/dist/aos.css";

interface WelcomeData {
  discordId: string;
  username: string;
  name: string;
  avatar: string;
}

interface AnimationStage {
  tickMarkInitial: boolean;
  showAvatar: boolean;
  showCelebrations: boolean;
  showButtons: boolean;
}

function WelcomePage() {
  const [welcomeData, setWelcomeData] = useState<WelcomeData | null>(null);
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [stage, setStage] = useState<AnimationStage>({
    tickMarkInitial: true,
    showAvatar: false,
    showCelebrations: false,
    showButtons: false,
  });

  const fireworksIntervalRef = useRef<number | null>(null);
  const colorParticlesIntervalRef = useRef<number | null>(null);
  const twinkleStarsRef = useRef<HTMLDivElement>(null);
  const tickMarkPlayerRef = useRef<any>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const discordId = urlParams.get("discordId");
    const username = urlParams.get("username");

    if (!discordId || !username) {
      window.location.href = "/error?msg=don't visiting directly on welcome page";
      return;
    }

    const name = urlParams.get("name") || username;
    const avatarParam = urlParams.get("avatar");
    
    let avatar: string;
    if (avatarParam) {
      avatar = `https://cdn.discordapp.com/avatars/${discordId}/${avatarParam}.webp?size=256`;
    } else {
      avatar = name.charAt(0).toUpperCase();
    }

    setWelcomeData({ discordId, username, name, avatar });

    const loginData = getLoginData();
    if (loginData) {
      if (loginData.userid.toString() === discordId) {
        updateVerificationStatus(true);
        setIsUserVerified(true);
      }
    }

    // Initialize AOS animations
    if (!checkReducedMotion()) {
      const timer = setTimeout(() => {
        initializeAnimations();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (tickMarkPlayerRef.current) {
      const player = tickMarkPlayerRef.current;
      player.addEventListener('complete', handleTickMarkComplete);
      return () => {
        player.removeEventListener('complete', handleTickMarkComplete);
      };
    }
  }, [stage.tickMarkInitial]);

  useEffect(() => {
    if (stage.showCelebrations) {
      startFireworks();
      startColorParticles();
      createTwinkleStars();

      return () => {
        if (fireworksIntervalRef.current) clearInterval(fireworksIntervalRef.current);
        if (colorParticlesIntervalRef.current) clearInterval(colorParticlesIntervalRef.current);
      };
    }
  }, [stage.showCelebrations]);

  const handleTickMarkComplete = () => {
    setTimeout(() => {
      setStage((prev) => ({ 
        ...prev, 
        tickMarkInitial: false,
        showAvatar: true,
        showCelebrations: true 
      }));

      setTimeout(() => {
        setStage((prev) => ({ ...prev, showButtons: true }));
      }, 5000);
    }, 500);
  };

  const startFireworks = () => {
    const launchFirework = () => {
      const container = document.getElementById("fireworks-container");
      if (!container) return;

      const firework = document.createElement("div");
      firework.className = "firework";
      
      const colors = [
        "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", 
        "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2",
        "#F8B500", "#FF1493", "#00CED1", "#FFD700"
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      firework.style.setProperty("--color", color);
      firework.style.left = `${Math.random() * 100}%`;
      firework.style.bottom = "0";
      
      container.appendChild(firework);

      setTimeout(() => {
        createExplosion(
          firework.offsetLeft,
          container.offsetHeight - (container.offsetHeight * 0.3),
          color,
          container
        );
        firework.remove();
      }, 1500);
    };

    fireworksIntervalRef.current = setInterval(launchFirework, 800);
    launchFirework();
  };

  const createExplosion = (
    x: number,
    y: number,
    color: string,
    container: HTMLElement
  ) => {
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "firework-particle";
      particle.style.setProperty("--color", color);
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 50 + Math.random() * 50;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;
      
      particle.style.transform = `translate(${tx}px, ${ty}px)`;
      
      container.appendChild(particle);
      
      setTimeout(() => particle.remove(), 800);
    }
  };

  const startColorParticles = () => {
    const createParticle = () => {
      const container = document.getElementById("color-particles-container");
      if (!container) return;

      const particle = document.createElement("div");
      particle.className = "color-particle";
      
      const colors = [
        "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A",
        "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2"
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 10 + Math.random() * 20;
      const duration = 2 + Math.random() * 3;
      
      particle.style.setProperty("--color", color);
      particle.style.setProperty("--size", `${size}px`);
      particle.style.setProperty("--duration", `${duration}s`);
      particle.style.setProperty("--tx", `${(Math.random() - 0.5) * 300}px`);
      particle.style.setProperty("--ty", `${(Math.random() - 0.5) * 300}px`);
      
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      container.appendChild(particle);
      
      setTimeout(() => particle.remove(), duration * 1000);
    };

    colorParticlesIntervalRef.current = setInterval(createParticle, 300);
    for (let i = 0; i < 5; i++) {
      setTimeout(createParticle, i * 100);
    }
  };

  const createTwinkleStars = () => {
    const container = twinkleStarsRef.current;
    if (!container) return;

    for (let i = 0; i < 30; i++) {
      const star = document.createElement("div");
      star.className = "twinkle-star";
      star.style.setProperty("--duration", `${2 + Math.random() * 3}s`);
      star.style.setProperty("--delay", `${Math.random() * 2}s`);
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      container.appendChild(star);
    }
  };

  const getAvatarElement = () => {
    if (!welcomeData) return null;

    if (welcomeData.avatar.startsWith("http")) {
      return (
        <img
          src={welcomeData.avatar}
          alt={welcomeData.name}
          className="w-full h-full object-cover"
        />
      );
    } else {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-shimmer"></div>
          <span className="text-7xl md:text-8xl font-bold text-white drop-shadow-2xl relative z-10" style={{ textShadow: "0 0 30px rgba(255,255,255,0.5)" }}>
            {welcomeData.avatar}
          </span>
        </div>
      );
    }
  };

  const discordUrl = "https://discord.com/channels/1005766057480421466";

  if (stage.tickMarkInitial) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-950 via-purple-950/20 to-dark-950">
        <div className="fixed inset-0 flex flex-col items-center justify-center z-20">
          <DotLottiePlayer
            src="/cdn/animation/tick-mark.lottie"
            autoplay
            loop={false}
            speed={0.8}
            style={{ width: "100vw", height: "100vh" }}
            lottieRef={tickMarkPlayerRef}
          />
        </div>
        <div className="fixed inset-0 flex items-center justify-center z-30 pointer-events-none" style={{ marginTop: "45vh" }}>
          <p className="text-center text-white text-lg md:text-xl font-medium">
            verification successful<br />please wait...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-dark-950 via-purple-950/20 to-dark-950">
      <div ref={twinkleStarsRef} className="absolute inset-0 pointer-events-none z-0" />
      
      <div id="fireworks-container" className="absolute inset-0 pointer-events-none z-10" />
      <div id="color-particles-container" className="absolute inset-0 pointer-events-none z-10" />

      {welcomeData && (
        <>
          <div className="fixed inset-0 flex items-center justify-center -translate-y-12 md:-translate-y-16 z-30 pointer-events-none">
            <DotLottiePlayer
              src="/cdn/animation/sky-short.lottie"
              autoplay
              loop={false}
              speed={1}
              style={{ width: "100vw", height: "90vh" }}
            />
          </div>

          <div className="fixed inset-0 flex items-center justify-center -translate-y-12 md:-translate-y-16 z-30 pointer-events-none">
            <DotLottiePlayer
              src="/cdn/animation/celebration-confetti.lottie"
              autoplay
              loop={false}
              speed={1}
              style={{ width: "100vw", height: "90vh" }}
            />
          </div>

          <div className="fixed inset-0 flex items-center justify-center -translate-y-12 md:-translate-y-16 z-30 pointer-events-none">
            <DotLottiePlayer
              src="/cdn/animation/celebration-confetti2.lottie"
              autoplay
              loop={false}
              speed={1}
              style={{ width: "100vw", height: "90vh" }}
            />
          </div>

          <div className="fixed inset-0 flex items-center justify-center z-30 pointer-events-none">
            <DotLottiePlayer
              src="/cdn/animation/multi-color-bubble.lottie"
              autoplay
              loop={false}
              speed={1}
              style={{ width: "90vw", height: "70vh", maxWidth: "900px" }}
            />
          </div>

          <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden pointer-events-none pb-12 md:pb-16">
            <div className="avatar-container relative flex flex-col items-center gap-6" data-aos="zoom-in" data-aos-duration="800">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50" style={{ transform: "scale(1.3)" }}>
                  <DotLottiePlayer
                    src="/cdn/animation/circle-wave.lottie"
                    autoplay
                    loop
                    speed={1}
                    style={{ width: "280px", height: "280px" }}
                  />
                </div>
                <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-purple-500/50 pulse-glow bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 z-40">
                  {getAvatarElement()}
                </div>
              </div>
              <h1 className="name-text text-3xl md:text-5xl font-bold text-center px-4" style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 20px rgba(147, 51, 234, 0.9)) drop-shadow(0 0 40px rgba(147, 51, 234, 0.6))",
                  textShadow: "0 0 40px rgba(147, 51, 234, 0.8)"
                }}>
                {welcomeData.name}
              </h1>
            </div>
          </div>

          {stage.showButtons && (
            <>
              <div className="fixed bottom-[8rem] left-0 right-0 flex justify-center z-[55] pointer-events-none sm:bottom-[8.5rem] md:bottom-[9rem]" data-aos="fade-down" data-aos-delay="200">
                <DotLottiePlayer
                  src="/cdn/animation/chiken-love.lottie"
                  autoplay
                  loop
                  speed={1}
                  style={{ width: "160px", height: "160px" }}
                />
              </div>

              <div className="fixed bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col items-center gap-3 md:gap-4 z-[60] bg-gradient-to-t from-dark-950 via-dark-950/95 to-transparent pt-16 md:pt-20 pointer-events-auto" data-aos="fade-up" data-aos-delay="300">
              {isUserVerified && isLoggedIn() ? (
                <>
                  <a
                    href={discordUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button-enter w-full max-w-md px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center text-base md:text-lg cursor-pointer"
                    style={{ animationDelay: "0s" }}
                  >
                    Go to Discord
                  </a>
                  <a
                    href="/portal"
                    className="button-enter w-full max-w-md px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center text-base md:text-lg cursor-pointer"
                    style={{ animationDelay: "0.2s" }}
                  >
                    Go to Portal
                  </a>
                </>
              ) : (
                <a
                  href={discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-enter w-full max-w-md px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center text-base md:text-lg cursor-pointer"
                >
                  Go to Discord
                </a>
              )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<WelcomePage />);