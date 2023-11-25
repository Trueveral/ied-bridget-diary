import { useSnapshot } from "valtio";
import { CollectionObject } from "./Objects";
import { collectionState } from "@/States/states";

export const CollectionsScene = () => {
  const { total } = useSnapshot(collectionState);
  return (
    <>
      <group position={[0, -0.4, -5.5]}>
        <CollectionObject id={1} />
      </group>
      <group position={[0, 0, -5.5]}>
        {[...Array(total - 1)].map((_, i) => (
          <CollectionObject key={i} id={i + 2} />
        ))}
      </group>
    </>
  );
};
