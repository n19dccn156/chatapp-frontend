import { IAction } from "../../interface/redux";

const ReceiveReducer = (state = false, {type}: IAction) => {
    switch (type) {
		case 'false':
			return false;
		case 'true':
			return true;
		default:
			return state;
    }
}
  
export default ReceiveReducer;