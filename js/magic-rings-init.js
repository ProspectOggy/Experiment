import { mountMagicRings } from "./MagicRings.js";

/** Matches primary CTA (--color-brand #29A8E0 + softer sky for ring gradient) */
const ctaRingProps = {
  color: "#29a8e0",
  colorTwo: "#5dc0ec",
  ringCount: 6,
  speed: 1,
  attenuation: 10,
  lineThickness: 2,
  baseRadius: 0.35,
  radiusStep: 0.1,
  scaleRate: 0.1,
  opacity: 1,
  blur: 0,
  noiseAmount: 0.1,
  rotation: 0,
  ringGap: 1.5,
  fadeIn: 0.7,
  fadeOut: 0.5,
  followMouse: false,
  mouseInfluence: 0.2,
  hoverScale: 1.2,
  parallax: 0.05,
  clickBurst: false,
};

const instances = [];

const hero = document.getElementById("magic-rings-hero");
const final = document.getElementById("magic-rings-final");

if (hero) {
  instances.push(mountMagicRings(hero, ctaRingProps));
}
if (final) {
  instances.push(mountMagicRings(final, ctaRingProps));
}

window.addEventListener("beforeunload", () => {
  instances.forEach((inst) => {
    if (inst && typeof inst.destroy === "function") inst.destroy();
  });
});
