import React, { useEffect, useRef, useState } from "react";
import type { Theme } from "../types/theme";


const BackgroundCanvas: React.FC= () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const targetScrollYRef = useRef(0);
  const currentScrollYRef = useRef(0);
  const animationFrameRef = useRef<number>(0);
const [theme, setTheme] = useState<Theme>(
      localStorage.getItem("theme") === "light" ||
        localStorage.getItem("theme") === "dark"
        ? (localStorage.getItem("theme") as Theme)
        : window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark"
    );
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    class Particle {
      x: number;
      y: number;
      sz: number;
      sx: number;
      sy: number;
      color: string;

      constructor(c: HTMLCanvasElement, color: string) {
        this.x = Math.random() * c.width;
        this.y = Math.random() * c.height;
        this.sz = Math.random() * 2 + 1;   //1.5 + 0.5
        this.sx = Math.random() * 0.5 - 0.25;
        this.sy = Math.random() * 0.5 - 0.25;
        this.color = color;
      }

      update() {
        this.x += this.sx;
        this.y += this.sy;
        if (this.x < 0 || this.x > canvas.width) this.sx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.sy *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      const particleColor =
        theme === "light" ? "rgba(55, 65, 81, 0.3)" : "rgba(251, 191, 36, 0.3)";
      particlesRef.current = [];
      const num = (canvas.height * canvas.width) / 9000;
      for (let i = 0; i < num; i++) {
        particlesRef.current.push(new Particle(canvas, particleColor));
      }
    };

    const animate = () => {
      currentScrollYRef.current +=
        (targetScrollYRef.current - currentScrollYRef.current) * 0.08;
      canvas.style.transform = `translateY(-${currentScrollYRef.current * 0.3}px)`;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) => {
        p.update();
        p.draw(ctx);
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      targetScrollYRef.current = window.scrollY;
    };

    resizeCanvas();
    animate();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      id="particle-canvas"
      className="fixed top-0 left-0 w-full h-screen z-[-1]"
    ></canvas>
  );
};

export default BackgroundCanvas;
