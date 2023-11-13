import { useMemo } from "react";
import { z } from "zod";

export const particleSchema = z.object({
  t: z.number(),
  factor: z.number(),
  speed: z.number(),
  xFactor: z.number(),
  yFactor: z.number(),
  zFactor: z.number(),
  mx: z.number(),
  my: z.number(),
});

export type Particle = z.infer<typeof particleSchema>;

export const useParticles = (count: number) => {
  const particles: Particle[] = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 7 + Math.random() * 70;
      const speed = 0.01 + Math.random() / 250;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  return particles;
};
