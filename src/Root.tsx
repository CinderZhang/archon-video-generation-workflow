// Stable root — do not edit. Compositions are registered through
// src/compositions.gen.ts, which is regenerated each workflow run
// by the `regenerate-registry` node.
import React from 'react';
import { Composition } from 'remotion';
import entries from './compositions.gen';

export const RemotionRoot: React.FC = () => (
  <>
    {entries.map((e) => (
      <Composition
        key={e.id}
        id={e.id}
        component={e.component}
        width={e.width}
        height={e.height}
        fps={e.fps}
        durationInFrames={e.durationInFrames}
        defaultProps={e.defaultProps}
        calculateMetadata={e.calculateMetadata}
      />
    ))}
  </>
);
