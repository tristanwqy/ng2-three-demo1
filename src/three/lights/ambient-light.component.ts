/**
 * Created by XKool2 on 2017/3/2.
 */
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({ selector: 'three-ambient-light' })
export class AmbientLightComponent {

  @Input() color: string = '#ababab';

  light: THREE.AmbientLight;

  ngOnInit() {
    this.light = new THREE.AmbientLight(this.color);
  }

}
