import * as THREE from "three";
import React, { createContext, useRef, useContext } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import state from "./store";
import "./CustomMaterial";

const offsetContext = createContext(0);

function Block({ children, offset, factor, ...props }) {
  const { offset: parentOffset, sectionHeight } = useBlock();
  const ref = useRef();
  offset = offset !== undefined ? offset : parentOffset;
  useFrame(() => {
    const curY = ref.current.position.y;
    const curTop = state.top.current;
    ref.current.position.y = THREE.MathUtils.lerp(
      curY,
      (-curTop / state.zoom) * factor,
      0.1
    );
  });
  return (
    <offsetContext.Provider value={offset}>
      <group
        uuid={`img-${offset}`}
        {...props}
        position={[0, sectionHeight * offset * factor, 0]}
      >
        <group ref={ref}>{children}</group>
      </group>
    </offsetContext.Provider>
  );
}

function useBlock() {
  const { sections, pages, zoom } = state;
  const { size } = useThree();
  const offset = useContext(offsetContext);
  const viewportHeight = size.height;
  const canvasHeight = size.height / zoom;
  const mobile = size.height < 700;
  const contentMaxWidth = canvasHeight * (mobile ? 0.7 : 0.5);
  const sectionHeight = canvasHeight * ((pages - 1) / (sections - 1));
  const offsetFactor = (offset + 1.0) / sections;
  return {
    offset,
    viewportHeight,
    contentMaxWidth,
    sectionHeight,
    offsetFactor
  };
}

export { Block, useBlock };
