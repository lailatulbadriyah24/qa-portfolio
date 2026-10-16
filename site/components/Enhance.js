"use client";
import { useEffect } from "react";

// Progressive enhancement: reveal-on-scroll, active nav link, header shadow.
// Everything is visible without JavaScript, and animation is skipped for reduced motion.
export default function Enhance() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups = [];

    if (!reduce && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
      );
      const targets = document.querySelectorAll(
        "main section > h2, .entry, .figures > div, .bugs, .statusbar, .skillrow, .range, .contact, .fold"
      );
      targets.forEach((el) => {
        // Only hide what is below the fold, so nothing flashes on load.
        if (el.getBoundingClientRect().top > window.innerHeight * 0.92) {
          el.classList.add("reveal");
          io.observe(el);
        }
      });
      cleanups.push(() => io.disconnect());
    }

    const links = [...document.querySelectorAll('.site-head nav a[href^="#"]')];
    const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const sections = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
    if ("IntersectionObserver" in window) {
      const spy = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              links.forEach((a) => a.removeAttribute("aria-current"));
              byId.get(e.target.id)?.setAttribute("aria-current", "true");
            }
          }
        },
        { rootMargin: "-30% 0px -60% 0px" }
      );
      sections.forEach((s) => spy.observe(s));
      cleanups.push(() => spy.disconnect());
    }

    const head = document.querySelector(".site-head");
    const onScroll = () => head?.classList.toggle("stuck", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
