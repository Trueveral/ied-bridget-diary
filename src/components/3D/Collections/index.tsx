import { CollectionObject } from "./Objects";

const NUM_COLLECTIONS = 7;
export const CollectionsScene = () => {
  return (
    <group position={[0, 0, -5.5]}>
      {[...Array(NUM_COLLECTIONS)].map((_, i) => (
        <CollectionObject key={i} id={i + 1} />
      ))}
    </group>
  );
};
