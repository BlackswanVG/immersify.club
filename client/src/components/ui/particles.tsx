import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  refresh?: boolean;
}

export const Particles = ({
  className = "",
  quantity = 30,
  staticity = 50,
  ease = 50,
  refresh = false,
}: ParticlesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const particles = useRef<Array<Particle>>([]);
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const animationId = useRef<number>(0);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
      cancelAnimationFrame(animationId.current);
    };
  }, []);

  useEffect(() => {
    initCanvas();
  }, [dimensions, resolvedTheme]);

  useEffect(() => {
    if (refresh) {
      initCanvas();
    }
  }, [refresh]);

  const initCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      const containerWidth = canvasContainerRef.current.offsetWidth;
      const containerHeight = canvasContainerRef.current.offsetHeight;
      setDimensions({ width: containerWidth, height: containerHeight });

      canvasRef.current.width = containerWidth;
      canvasRef.current.height = containerHeight;

      particles.current = [];
      for (let i = 0; i < quantity; i++) {
        particles.current.push(
          new Particle(
            containerWidth,
            containerHeight,
            getParticleColor(),
            ease,
            staticity
          )
        );
      }
    }
  };

  const getParticleColor = () => {
    const isDarkMode = resolvedTheme === "dark";
    return isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.07)";
  };

  const animate = () => {
    if (context.current && canvasRef.current) {
      context.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      particles.current.forEach((particle) => {
        particle.update(mouse.current);
        particle.draw(context.current!);
      });

      animationId.current = requestAnimationFrame(animate);
    }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (canvasContainerRef.current) {
      const rect = canvasContainerRef.current.getBoundingClientRect();
      mouse.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  return (
    <div
      ref={canvasContainerRef}
      className={className}
      onMouseMove={onMouseMove}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

class Particle {
  private x: number;
  private y: number;
  private size: number;
  private vx: number;
  private vy: number;
  private color: string;
  private originX: number;
  private originY: number;
  private ease: number;
  private staticity: number;
  private dx: number;
  private dy: number;
  private distance: number;
  private force: number;
  private angle: number;

  constructor(
    canvasWidth: number,
    canvasHeight: number,
    color: string,
    ease: number,
    staticity: number
  ) {
    // Initial position
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;

    // Save initial position
    this.originX = this.x;
    this.originY = this.y;

    // Size
    this.size = Math.random() * 3 + 1;

    // Color
    this.color = color;

    // Settings
    this.ease = ease;
    this.staticity = staticity;

    // Velocity for floating effect
    this.vx = (Math.random() - 0.5) * 0.05;
    this.vy = (Math.random() - 0.5) * 0.05;

    // Mouse interaction properties
    this.dx = 0;
    this.dy = 0;
    this.distance = 0;
    this.force = 0;
    this.angle = 0;
  }

  update(mouse: { x: number; y: number }) {
    // Natural floating movement
    this.x += this.vx;
    this.y += this.vy;

    // Mouse interaction
    this.dx = mouse.x - this.x;
    this.dy = mouse.y - this.y;
    this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    this.force = Math.max(
      (this.staticity / this.distance) * 5,
      0
    );

    if (this.distance > 0) {
      this.angle = Math.atan2(this.dy, this.dx);
      this.vx += Math.cos(this.angle) * this.force;
      this.vy += Math.sin(this.angle) * this.force;
    }

    // Ease back to original position
    this.vx *= 0.95;
    this.vy *= 0.95;

    // Boundary checking
    if (this.x < 0 || this.x > window.innerWidth) {
      this.vx = -this.vx;
    }
    if (this.y < 0 || this.y > window.innerHeight) {
      this.vy = -this.vy;
    }
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
  }
}
