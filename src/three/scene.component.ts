import { Directive, ContentChild, ContentChildren } from '@angular/core';
import * as THREE from 'three';

import { PerspectiveCameraComponent } from './cameras/perspective-camera.component';
import { PointLightComponent } from './lights/point-light.component';

import { ElementsComponent } from './objects/element.component';
import { TextureComponent } from './objects/texture.component';
import { SkyboxComponent } from './objects/skybox.component';
import { AmbientLightComponent } from './lights/ambient-light.component';

@Directive({ selector: 'three-scene' })
export class SceneComponent {

  @ContentChild(PerspectiveCameraComponent) cameraComp: any;
  @ContentChild(PointLightComponent) lightComp: any;
  @ContentChild(AmbientLightComponent) ambientLightComp: any;

  @ContentChild(ElementsComponent) sphereComps: any;
  @ContentChildren(TextureComponent) textureComps: any;
  @ContentChild(SkyboxComponent) skyboxComp: any;

  scene: THREE.Scene = new THREE.Scene();

  get camera() {
    return this.cameraComp.camera;
  }

  get multi(){
    return this.sphereComps.multi;
  }

  get pointLight(){
    return this.lightComp.light;
  }

  get ambientLight(){
    return this.ambientLight.light;
  }

  ngAfterContentInit() {
    this.camera.lookAt(this.scene.position);
    this.scene.add(this.camera);

    const meshes = [
      this.skyboxComp,
      ...this.textureComps.toArray()
    ];

    for(let mesh of meshes) {
      if(mesh.object) {
        this.scene.add(mesh.object);
      } else if(mesh.attachScene) {
        mesh.attachScene(this.scene);
      }
    }
    this.scene.add(this.pointLight);
    this.scene.add(new THREE.AmbientLight(0xcccccc));
    // this.scene.add(this.ambientLight);
    this.scene.add(this.multi);
  }

}
