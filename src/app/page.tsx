"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { easing } from "maath";
import Visual from "@/components/visual";
import Overlay from "@/components/overlay";

export default function Page() {
  return (
    <div className="w-screen h-screen">
      <Visual />
      <Overlay />
    </div>
  );
}

function CameraRig() {
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [
        -1 + (state.pointer.x * state.viewport.width) / 3,
        (1 + state.pointer.y) / 2,
        5.5,
      ],
      0.5,
      delta
    );
    state.camera.lookAt(0, 0, 0);
  });
}
