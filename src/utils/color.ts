function hslToHex(hue: number, saturation: number, lightness: number): string {
  const s = saturation / 100;
  const l = lightness / 100;
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const huePrime = hue / 60;
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1));
  const m = l - chroma / 2;

  let rgb: [number, number, number];
  if (huePrime < 1) rgb = [chroma, x, 0];
  else if (huePrime < 2) rgb = [x, chroma, 0];
  else if (huePrime < 3) rgb = [0, chroma, x];
  else if (huePrime < 4) rgb = [0, x, chroma];
  else if (huePrime < 5) rgb = [x, 0, chroma];
  else rgb = [chroma, 0, x];

  return (
    "#" +
    rgb
      .map((channel) =>
        Math.round((channel + m) * 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

// The HSL ranges vivid mid-tone colors are drawn from. Kept as named constants
// so `generateDistractor` can nudge a target *within* the same gamut instead of
// wandering off into near-white/near-black/gray.
const SATURATION_MIN = 65;
const SATURATION_MAX = 90;
const LIGHTNESS_MIN = 45;
const LIGHTNESS_MAX = 60;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// A single Math.random() draw per color: hue is uniform, while saturation and
// lightness are derived from the same draw but clamped to vivid mid-tones so
// a swatch can never be near-white, near-black, or gray — it must stay
// clearly visible against both the light and dark theme backgrounds.
export const generateRandomColor = () => {
  const r = Math.random();
  const hue = (r * 360) % 360;
  const saturation =
    SATURATION_MIN + ((r * 9973) % 1) * (SATURATION_MAX - SATURATION_MIN);
  const lightness =
    LIGHTNESS_MIN + ((r * 5417) % 1) * (LIGHTNESS_MAX - LIGHTNESS_MIN);
  return hslToHex(hue, saturation, lightness);
};

// Generates a distractor color for a given difficulty.
//
// At difficulty 0 (level 1) this is *exactly* `generateRandomColor()` — the
// target is ignored and a fresh vivid color is drawn — so the base game and its
// seeded tests are unaffected. At higher difficulty the distractor is nudged
// from the target's own hue/saturation/lightness by a delta that shrinks as
// difficulty rises, making the wrong options progressively closer (harder) to
// the correct swatch. The caller is still responsible for rejecting exact
// duplicates.
export const generateDistractor = (
  targetColor: string,
  difficulty: number,
): string => {
  if (difficulty <= 0) return generateRandomColor();

  const { h, s, l } = hexToHsl(targetColor);
  // Hue window narrows from ~90deg down toward ~18deg as difficulty climbs.
  const hueSpread = Math.max(18, 90 - (difficulty - 1) * 14);
  const satSpread = Math.max(6, 20 - (difficulty - 1) * 3);
  const lightSpread = Math.max(4, 14 - (difficulty - 1) * 2);

  const hue = (h + (Math.random() * 2 - 1) * hueSpread + 360) % 360;
  const saturation = clamp(
    s + (Math.random() * 2 - 1) * satSpread,
    SATURATION_MIN,
    SATURATION_MAX,
  );
  const lightness = clamp(
    l + (Math.random() * 2 - 1) * lightSpread,
    LIGHTNESS_MIN,
    LIGHTNESS_MAX,
  );
  return hslToHex(hue, saturation, lightness);
};

// Parses a #rrggbb string back into HSL degrees/percentages. Used by
// `generateDistractor` to perturb a color relative to the target.
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  return { h, s: s * 100, l: l * 100 };
}
