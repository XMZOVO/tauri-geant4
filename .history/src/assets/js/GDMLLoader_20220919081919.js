import { Loader } from "three";
import chevrotain from '../../../node_modules/three/examples/jsm/libs/chevrotain.module.min.js';


class GDMLLoader extends Loader{
    constructor(manager){
        super(manager)
        if ( typeof chevrotain === 'undefined' ) { // eslint-disable-line no-undef

			throw Error( 'THREE.VRMLLoader: External library chevrotain.min.js required.' );

		}
    }
}