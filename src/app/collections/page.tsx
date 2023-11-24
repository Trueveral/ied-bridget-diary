import { CollectionBrief } from "@/components/Collection/Brief";
import {
  CollectionLeftButton,
  CollectionRightButton,
} from "@/components/Collection/Button";

export default function Page() {
  return (
    <>
      <CollectionLeftButton />
      <CollectionRightButton />
      <CollectionBrief
        title="Mingcute"
        content="Mingcute is a collection of Ming's cute photos."
      />
    </>
  );
}
