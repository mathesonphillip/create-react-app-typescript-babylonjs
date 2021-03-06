import React, { useCallback } from 'react';
import "@babylonjs/core/Physics/physicsEngineComponent"  // side-effect adds scene.enablePhysics function
import { Vector3, PhysicsImpostor, Mesh, Nullable } from '@babylonjs/core';
import { CannonJSPlugin } from '@babylonjs/core/Physics/Plugins'
import { Scene, Engine, withBabylonJS } from 'react-babylonjs';
import './App.css';
import * as CANNON from 'cannon';
window.CANNON = CANNON;

const EngineWithContext = withBabylonJS(Engine);
const gravityVector = new Vector3(0, -9.81, 0);
let sphere: Nullable<Mesh> = null;

const onButtonClicked = () => {
  if (sphere !== null) {
    sphere.physicsImpostor!.applyImpulse(Vector3.Up().scale(10), sphere.getAbsolutePosition())
  }
}

const App: React.FC = () => {
  const sphereRef = useCallback(node => {
    sphere = node.hostInstance;
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>@babylonjs + `react-babylonjs`</p>
        <EngineWithContext antialias={true} adaptToDeviceRatio={true} canvasId="sample-canvas">
          <Scene enablePhysics={[gravityVector, new CannonJSPlugin()]}>
            <arcRotateCamera name="arc" target={ new Vector3(0, 1, 0) }
                  alpha={-Math.PI / 2} beta={(0.5 + (Math.PI / 4))}
                  radius={4} minZ={0.001} wheelPrecision={50} 
                  lowerRadiusLimit={8} upperRadiusLimit={20} upperBetaLimit={Math.PI / 2} />
            <hemisphericLight name='hemi' direction={new Vector3(0, -1, 0)} intensity={0.8} />
            <directionalLight name="shadow-light" setDirectionToTarget={[Vector3.Zero()]} direction={Vector3.Zero()} position = {new Vector3(-40, 30, -40)}
              intensity={0.4} shadowMinZ={1} shadowMaxZ={2500}>
              <shadowGenerator mapSize={1024} useBlurExponentialShadowMap={true} blurKernel={32}
                shadowCasters={["sphere1", "dialog"]} forceBackFacesOnly={true} depthScale={100} />
            </directionalLight>
            <sphere ref={sphereRef} name="sphere1" diameter={2} segments={16} position={new Vector3(0, 2.5, 0)}>
              <physicsImpostor type={PhysicsImpostor.SphereImpostor} _options={{ mass: 1, restitution: 0.9 }} />
              <plane name="dialog" size={2} position={new Vector3(0, 1.5, 0)}>
                <advancedDynamicTexture name="dialogTexture" height={1024} width={1024} createForParentMesh={true} hasAlpha={true}>
                  <rectangle name="rect-1" height={0.5} width={1} thickness={12} cornerRadius={12}>
                      <rectangle>
                        <babylon-button name="close-icon" background="green" onPointerDownObservable={onButtonClicked} >
                          <textBlock text={'\uf00d click me'} fontFamily="FontAwesome" fontStyle="bold" fontSize={200} color="white" />
                        </babylon-button>
                      </rectangle>
                  </rectangle>
                </advancedDynamicTexture>
              </plane>
            </sphere>
            
            <ground name="ground1" width={10} height={10} subdivisions={2} receiveShadows={true}>
              <physicsImpostor type={PhysicsImpostor.BoxImpostor} _options={{ mass: 0, restitution: 0.9 }} />
            </ground>
            <vrExperienceHelper webVROptions={{ createDeviceOrientationCamera: false }} enableInteractions={true} />
          </Scene>
        </EngineWithContext>
      </header>
    </div>
  );
}
export default App;