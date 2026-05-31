"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

type Point = { x: number; y: number };

export interface ImageTrailProps {
  items: string[];
  variant?: number;
  threshold?: number;
  className?: string;
}

function lerp(a: number, b: number, n: number) {
  return (1 - n) * a + n * b;
}

function localPointerPosition(event: MouseEvent | TouchEvent, rect: DOMRect): Point {
  const source = "touches" in event ? event.touches[0] : event;
  return source ? { x: source.clientX - rect.left, y: source.clientY - rect.top } : { x: 0, y: 0 };
}

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

class TrailImage {
  readonly el: HTMLDivElement;
  readonly inner: HTMLDivElement | null;
  rect: DOMRect;
  private readonly resize: () => void;

  constructor(el: HTMLDivElement) {
    this.el = el;
    this.inner = el.querySelector(".content__img-inner");
    this.rect = el.getBoundingClientRect();
    this.resize = () => {
      gsap.set(this.el, { opacity: 0, scale: 1, x: 0, y: 0, rotation: 0, clearProps: "filter" });
      this.rect = this.el.getBoundingClientRect();
    };
    window.addEventListener("resize", this.resize);
  }

  destroy() {
    window.removeEventListener("resize", this.resize);
    gsap.killTweensOf([this.el, this.inner]);
  }
}

class ImageTrailEngine {
  private readonly images: TrailImage[];
  private readonly move: (event: MouseEvent | TouchEvent) => void;
  private readonly start: (event: MouseEvent | TouchEvent) => void;
  private pointer: Point = { x: 0, y: 0 };
  private lastPointer: Point = { x: 0, y: 0 };
  private cachedPointer: Point = { x: 0, y: 0 };
  private imageIndex = 0;
  private zIndex = 1;
  private active = 0;
  private rafId = 0;
  private started = false;
  private lastAngle = 0;

  constructor(
    private readonly container: HTMLDivElement,
    private readonly variant: number,
    private readonly threshold: number,
  ) {
    this.images = Array.from(container.querySelectorAll<HTMLDivElement>(".content__img")).map((image) => new TrailImage(image));
    this.move = (event) => {
      this.pointer = localPointerPosition(event, this.container.getBoundingClientRect());
    };
    this.start = (event) => {
      this.move(event);
      this.cachedPointer = { ...this.pointer };
      this.lastPointer = { ...this.pointer };
      this.started = true;
      this.render();
      container.removeEventListener("mousemove", this.start);
      container.removeEventListener("touchmove", this.start);
    };
    container.addEventListener("mousemove", this.move);
    container.addEventListener("touchmove", this.move, { passive: true });
    container.addEventListener("mousemove", this.start);
    container.addEventListener("touchmove", this.start, { passive: true });
  }

  private render = () => {
    const smoothing = this.variant === 6 || this.variant === 7 ? 0.3 : 0.1;
    const moved = distance(this.pointer, this.lastPointer);
    this.cachedPointer.x = lerp(this.cachedPointer.x, this.pointer.x, smoothing);
    this.cachedPointer.y = lerp(this.cachedPointer.y, this.pointer.y, smoothing);

    if (moved > this.threshold) {
      this.showNextImage();
      this.lastPointer = { ...this.pointer };
    }

    if (this.active === 0 && this.zIndex !== 1) this.zIndex = 1;
    this.rafId = requestAnimationFrame(this.render);
  };

  private showNextImage() {
    if (this.images.length === 0) return;

    this.zIndex += 1;
    this.imageIndex = this.imageIndex < this.images.length - 1 ? this.imageIndex + 1 : 0;
    const image = this.images[this.imageIndex];
    const width = image.rect.width / 2;
    const height = image.rect.height / 2;
    const from = { x: this.cachedPointer.x - width, y: this.cachedPointer.y - height };
    const to = { x: this.pointer.x - width, y: this.pointer.y - height };
    const dx = this.pointer.x - this.cachedPointer.x;
    const dy = this.pointer.y - this.cachedPointer.y;
    const speed = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const timeline = gsap.timeline({
      onStart: () => {
        this.active += 1;
      },
      onComplete: () => {
        this.active -= 1;
      },
    });

    gsap.killTweensOf([image.el, image.inner]);

    if (this.variant === 2) {
      timeline
        .fromTo(image.el, { opacity: 1, scale: 0, zIndex: this.zIndex, ...from }, { duration: 0.42, ease: "power2.out", scale: 1, ...to }, 0)
        .fromTo(image.inner, { scale: 2.5, filter: "brightness(250%) saturate(140%)" }, { duration: 0.42, ease: "power2.out", scale: 1, filter: "brightness(100%) saturate(100%)" }, 0)
        .to(image.el, { duration: 0.36, ease: "power3.in", opacity: 0, scale: 0.2 }, 0.5);
      return;
    }

    if (this.variant === 3) {
      timeline
        .fromTo(image.el, { opacity: 1, scale: 0.2, zIndex: this.zIndex, ...from }, { duration: 0.42, ease: "power2.out", scale: 1, ...to }, 0)
        .to(image.el, { duration: 0.7, ease: "power3.in", opacity: 0, scale: 0.25, xPercent: gsap.utils.random(-26, 26), yPercent: -180 }, 0.58);
      return;
    }

    if (this.variant === 4) {
      timeline
        .fromTo(image.el, { opacity: 1, scale: 0.2, zIndex: this.zIndex, ...from }, { duration: 0.4, ease: "power2.out", scale: 1, ...to }, 0)
        .fromTo(image.inner, { scale: 1.9, filter: `brightness(${Math.min(260, 120 + speed)}%) contrast(${Math.min(220, 110 + speed)}%)` }, { duration: 0.42, ease: "power2.out", scale: 1, filter: "brightness(100%) contrast(100%)" }, 0)
        .to(image.el, { duration: 0.52, ease: "power3.in", opacity: 0, x: `+=${dx * 1.1}`, y: `+=${dy * 1.1}` }, 0.42);
      return;
    }

    if (this.variant === 5) {
      const safeAngle = angle < 0 ? angle + 360 : angle;
      const movingClockwise = safeAngle >= this.lastAngle;
      this.lastAngle = safeAngle > 90 && safeAngle <= 270 ? safeAngle + 180 : safeAngle;
      timeline
        .fromTo(image.el, { opacity: 1, scale: 0.18, rotation: movingClockwise ? this.lastAngle - 14 : this.lastAngle + 14, zIndex: this.zIndex, ...from }, { duration: 0.72, ease: "power3.out", scale: 1, rotation: this.lastAngle, x: to.x + dx * 0.35, y: to.y + dy * 0.35 }, 0)
        .to(image.el, { duration: 0.42, ease: "expo.in", opacity: 0 }, 0.48);
      return;
    }

    if (this.variant === 6) {
      const scale = 0.35 + 1.45 * Math.min(speed / 220, 1);
      const blur = 18 * (1 - Math.min(speed / 100, 1));
      timeline
        .fromTo(image.el, { opacity: 1, scale: 0, zIndex: this.zIndex, ...from }, { duration: 0.68, ease: "power3.out", scale, filter: `brightness(${110 + Math.min(speed, 80)}%) blur(${blur}px)`, ...to }, 0)
        .to(image.el, { duration: 0.38, ease: "power3.in", opacity: 0, scale: 0.2 }, 0.48);
      return;
    }

    if (this.variant === 7) {
      timeline.fromTo(image.el, { opacity: 1, scale: gsap.utils.random(0.55, 1.2), rotation: gsap.utils.random(-4, 4), zIndex: this.zIndex, ...from }, { duration: 0.42, ease: "power3.out", x: to.x, y: to.y }, 0);
      const oldImage = this.images[(this.imageIndex - 8 + this.images.length) % this.images.length];
      if (oldImage !== image) gsap.to(oldImage.el, { duration: 0.44, ease: "power4.out", opacity: 0, scale: 1.24 });
      return;
    }

    if (this.variant === 8) {
      const rect = this.container.getBoundingClientRect();
      const relX = this.pointer.x - rect.width / 2;
      const relY = this.pointer.y - rect.height / 2;
      timeline
        .set(this.container, { perspective: 1000 })
        .fromTo(image.el, { opacity: 1, scale: 0.8, zIndex: this.zIndex, rotationX: -(relY / rect.height) * 52, rotationY: (relX / rect.width) * 52, ...from }, { duration: 0.82, ease: "expo.out", scale: 1.08, ...to }, 0)
        .to(image.el, { duration: 0.42, ease: "power2.in", opacity: 0, z: -420 }, 0.34);
      return;
    }

    timeline
      .fromTo(image.el, { opacity: 1, scale: 1, zIndex: this.zIndex, ...from }, { duration: 0.38, ease: "power1.out", ...to }, 0)
      .to(image.el, { duration: 0.42, ease: "power3.in", opacity: 0, scale: 0.2 }, 0.42);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.container.removeEventListener("mousemove", this.move);
    this.container.removeEventListener("touchmove", this.move);
    this.container.removeEventListener("mousemove", this.start);
    this.container.removeEventListener("touchmove", this.start);
    this.images.forEach((image) => image.destroy());
    if (this.started) gsap.set(this.container, { clearProps: "perspective" });
  }
}

export function ImageTrail({ items, variant = 1, threshold = 80, className }: ImageTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ImageTrailEngine | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!containerRef.current || items.length === 0 || prefersReducedMotion) return undefined;

    instanceRef.current = new ImageTrailEngine(containerRef.current, variant, threshold);
    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, [items, threshold, variant]);

  return (
    <div ref={containerRef} className={cn("relative h-full w-full touch-none overflow-visible rounded-lg bg-transparent", className)} aria-hidden>
      {items.map((url, index) => (
        <div
          className="content__img absolute left-0 top-0 aspect-[1.12] w-[clamp(118px,18vw,210px)] overflow-hidden rounded-lg opacity-0 shadow-[0_22px_60px_rgba(34,34,34,0.18)] [will-change:transform,filter,opacity]"
          key={`${url}-${index}`}
        >
          <div
            className="content__img-inner absolute -left-3 -top-3 h-[calc(100%+24px)] w-[calc(100%+24px)] bg-cover bg-center"
            style={{ backgroundImage: `url(${url})` }}
          />
        </div>
      ))}
    </div>
  );
}
