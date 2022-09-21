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
    pa


}