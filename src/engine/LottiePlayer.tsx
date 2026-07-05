import { useEffect, useState, type ComponentType } from 'react';
import * as LottieModule from 'lottie-react';

// Vite CJS interop can wrap the component as default(.default). Unwrap to the function.
function unwrap(m: unknown): unknown {
  let c: unknown = m;
  while (c && typeof c === 'object' && 'default' in (c as Record<string, unknown>)) {
    c = (c as Record<string, unknown>).default;
  }
  return c;
}
const Lottie = unwrap(LottieModule) as ComponentType<Record<string, unknown>>;

/* Loads a bodymovin JSON from /public/lottie and plays it.
   Assets ported from the master prototype (apps/health/public/assets/remedies). */
const cache: Record<string, unknown> = {};

export function LottiePlayer({ name, size = 44, loop = true }: { name: string; size?: number; loop?: boolean }) {
  const [data, setData] = useState<unknown>(cache[name] ?? null);

  useEffect(() => {
    if (cache[name]) {
      setData(cache[name]);
      return;
    }
    let alive = true;
    fetch(`${import.meta.env.BASE_URL}lottie/${name}.json`)
      .then((r) => r.json())
      .then((j) => {
        cache[name] = j;
        if (alive) setData(j);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [name]);

  const box = { width: size, height: size };
  if (!data) return <div style={box} />;
  return <Lottie animationData={data} loop={loop} autoplay style={box} rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }} />;
}
