import * as THREE from "three";
import React, { Suspense, useEffect, useRef, useState } from "react";
import "./App.css";
import {
  useTexture,
  Stats,
  Text,
  PerspectiveCamera,
  Shadow
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Block, useBlock } from "./components/Block";
import Box from "./components/Box";
import Plane from "./components/Plane";
import state from "./components/store";

function Image({ img, index }) {
  const ref = useRef();
  const { contentMaxWidth: w, viewportHeight, offsetFactor } = useBlock();
  useFrame(() => {
    const scrollOffset =
      state.top.current / (viewportHeight * state.pages - viewportHeight) +
      1 / state.pages / 2;
    const scale =
      1 -
      (offsetFactor - scrollOffset) * (offsetFactor > scrollOffset ? 1 : -1);
    ref.current.scale.setScalar(scale);
  });
  return (
    <group uuid={`img-frame-${index}`} ref={ref}>
      <Plane
        uuid={`plane-frame-${index}`}
        map={img}
        args={[1, 1, 32, 32]}
        shift={100}
        aspect={1.5}
        scale={[w, w / 1.5, 1]}
        frustumCulled={false}
      />
      <Text
        anchorX="left"
        position={[-w / 1.5 / 2 - 0.25, -w / 2, 0]}
        scale={1.5}
        color="white"
      >
        0{index}
      </Text>
      <Shadow
        scale={[w * 1.2, 1, 1]}
        rotation={[0.75, 0, 0]}
        position={[-w / 2, 0, 0]}
      />
    </group>
  );
}

function Content() {
  const images = useTexture(["/01.jpg", "/00.jpg", "/02.jpg"]);
  return images.map((img, index) => (
    <Block key={index} factor={1} offset={index}>
      <Image key={index} index={index} img={img} />
    </Block>
  ));
}

function App() {
  const scrollArea = useRef();
  const onScroll = (e) => (state.top.current = e.target.scrollTop);
  useEffect(
    () => void onScroll({ target: (state.ref = scrollArea.current) }),
    []
  );
  return (
    <>
      <Canvas
        mode="concurrent"
        raycaster={{
          computeOffsets: ({ offsetX, offsetY }) => ({
            offsetX: offsetX - scrollArea.current.scrollTop,
            offsetY
          })
        }}
        onCreated={(state) => state.events.connect(scrollArea.current)}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5.8]} />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <Content />
        </Suspense>
        {/* <OrbitControls /> */}
        {/* <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} /> */}
        <Stats />
      </Canvas>
      <div class="scrollArea" ref={scrollArea} onScroll={onScroll}>
        <div style={{ width: "100vh", height: `${state.pages * 100}vw` }} />
        <div className="content">
          <div className="container">
            <d<h2>Foo</h2>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
