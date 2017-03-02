import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({ selector: 'three-sphere' })
export class SphereComponent {

  @Input() buildings: any;
  multi: THREE.Object3D;

  ngOnInit() {
    // Create sphere
    console.log('buildings', this.buildings);
    let multi = new THREE.Object3D();
    for (let building of this.buildings) {
      let baseEnvelope = building.base_envelope;
      for (let point of baseEnvelope){
        point[0] = point[0] / 1000;
        point[1] = point[1] / 1000;
      }
      let x = Math.abs(baseEnvelope[0][0] - baseEnvelope[2][0]);
      let y = Math.abs(baseEnvelope[0][1] - baseEnvelope[2][1]);
      let posx = baseEnvelope[0][0] + x;
      let posy = baseEnvelope[0][1] + y;
      let geometry = new THREE.BoxGeometry(x, y, 300);
      let material = new THREE.MeshNormalMaterial();
      let mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(posx, posy, 0);
      mesh.rotation.x = -Math.PI / 2;
      multi.add(mesh);
    }
    this.multi = multi;

  }

}
