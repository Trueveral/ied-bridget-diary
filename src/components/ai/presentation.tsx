import { aiState } from '@/states/states';
import React from 'react';
import { useSnapshot } from 'valtio';

export const Presentation = () => {
  const { responseText } = useSnapshot(aiState);
  return (
    <div className="min-w-min w-4/5 mx-auto my-auto text-center text-xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      Test {responseText}
    </div>
  );
};