import { Group } from "three";
import { Loader, LoaderUtils,FileLoader } from "three";
import chevrotain from '../../../node_modules/three/examples/jsm/libs/chevrotain.module.min.js';


class GDMLLoader extends Loader{
    constructor (manager){
        super(manager)
    }

    group = new Group();
    defines;
    geometries;
    refs;
    meshes;

}