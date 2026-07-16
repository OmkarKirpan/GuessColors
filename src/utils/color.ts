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

// A single Math.random() draw per color: hue is uniform, while saturation and
// lightness are derived from the same draw but clamped to vivid mid-tones so
// a swatch can never be near-white, near-black, or gray — it must stay
// clearly visible against both the light and dark theme backgrounds.
export const generateRandomColor = () => {
  const r = Math.random();
  const hue = (r * 360) % 360;
  const saturation = 65 + ((r * 9973) % 1) * 25;
  const lightness = 45 + ((r * 5417) % 1) * 15;
  return hslToHex(hue, saturation, lightness);
};
