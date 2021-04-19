// @flow

import Constants from "./constants";
import Functions from './functions';
import type {UtilInterface} from "./_flowType";
import Firebase from "./firebase";

class Utility {
    Constants = new Constants();
    Functions = new Functions();
    Firebase = new Firebase();
}

const Util: UtilInterface = new Utility();
export default Util
