import { Group } from "three";
import { Loader, LoaderUtils, FileLoader } from "three";
import chevrotain from '../../../node_modules/three/examples/jsm/libs/chevrotain.module.min.js';


class GDMLLoader extends Loader {
    constructor(manager) {
        super(manager)
    }

    group = new Group();
    defines;
    geometries;
    refs;
    meshes;

    load(url, onLoad, onProgress, onError) {
        const scope = this;
        const path = (scope.path === '') ? LoaderUtils.extractUrlBase(url) : scope.path;

        const loader = new FileLoader(scope.manager);
        loader.setPath(scope.path);
        loader.setRequestHeader(scope.requestHeader);
        loader.setWithCredentials(scope.withCredentials);
        loader.load(url, function (text) {

            try {

                onLoad(scope.parse(text, path));

            } catch (e) {

                if (onError) {

                    onError(e);

                } else {

                    console.error(e);

                }

                scope.manager.itemError(url);

            }

        }, onProgress, onError);
    }
    parse(data, path) {
        GDML = new DOMParser().parseFromString(text, 'text/xml');

        function parseDefines() {
            var elements = GDML.querySelectorAll('define');
            var defs = elements[0].childNodes;
            var name = '';
            var value;

            for (var i = 0; i < defs.length; i++) {

                var nodeName = defs[i].nodeName;
                var def = defs[i];

                if (nodeName === 'constant') {

                    name = def.getAttribute('name');
                    value = def.getAttribute('value');

                }

                if (nodeName === 'position') {

                    name = def.getAttribute('name');

                    var x = def.getAttribute('x');

                    if (!x) {
                        x = 0.0;
                    }

                    var y = def.getAttribute('y');

                    if (!y) {
                        y = 0.0;
                    }

                    var z = def.getAttribute('z');

                    if (!z) {
                        z = 0.0;
                    }

                    var position = new THREE.Vector3(x, y, z);
                    this.defines[name] = position;

                }

                if (nodeName === 'rotation') {

                    // Note: need to handle constants
                    // before this can be implemented

                    name = def.getAttribute('name');

                    var x = def.getAttribute('x');
                    var y = def.getAttribute('y');
                    var z = def.getAttribute('z');

                }

                if (nodeName === 'quantity') {

                    // Note: need to handle units

                    name = def.getAttribute('name');
                    var type = def.getAttribute('type');

                }

                if (nodeName === 'expression') {

                    name = def.getAttribute('name');

                }

            }

        }

        parseDefines();
        parseSolids();
        parseVolumes();
        parsePhysVols();
        parseSetup();
    }


}