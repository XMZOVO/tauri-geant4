import { Loader } from "three";
import chevrotain from '../../../node_modules/three/examples/jsm/libs/chevrotain.module.min.js';


class GDMLLoader extends Loader{
    constructor(manager){
        super(manager)
        if ( typeof chevrotain === 'undefined' ) { // eslint-disable-line no-undef

			throw Error( 'THREE.VRMLLoader: External library chevrotain.min.js required.' );

		}
    }
    load(url, onLoad, onProgress, onError){
		const scope = this;
        const path = ( scope.path === '' ) ? LoaderUtils.extractUrlBase( url ) : scope.path;

		const loader = new FileLoader( scope.manager );
		loader.setPath( scope.path );
		loader.setRequestHeader( scope.requestHeader );
		loader.setWithCredentials( scope.withCredentials );
    }
}