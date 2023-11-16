import Visual from "@/components/canvas/visual";
import { AI } from "@/components/ai/main";

export default function Page() {
  return (
    <>
      <div className="w-screen h-screen">
        <Visual />
        {/* <Overlay /> */}
      </div>
      <AI />
    </>
  );
}
