import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({ selector: 'three-sphere' })
export class ElementsComponent {

  @Input() buildings: any;
  multi: THREE.Object3D;

  ngOnInit() {
    // Create sphere
    console.log('buildings', this.buildings);
    let multi = new THREE.Object3D();
    let planeGeometry = new THREE.PlaneGeometry(2000, 2000);
    let planMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    let planeMesh = new THREE.Mesh(planeGeometry, planMaterial);
    planeMesh.position.set(0, -150, 0);
    planeMesh.rotation.x = -Math.PI / 2;
    planeMesh.receiveShadow = true;
    multi.add(planeMesh);

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
      let material = new THREE.MeshLambertMaterial({color: 0xffffff});
      let mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(posx, posy, 0);
      mesh.rotation.x = -Math.PI / 2;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      multi.add(mesh);
    }
    this.multi = multi;

  }

}
