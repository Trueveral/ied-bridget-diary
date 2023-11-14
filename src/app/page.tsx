import Visual from "@/components/visual";
import Overlay from "@/components/overlay";
import { Input } from "@/components/input";

export default function Page() {
  return (
    <>
      <div className="w-screen h-screen">
        <Visual />
        {/* <Overlay /> */}
      </div>
      <Input />
    </>
  );
}
