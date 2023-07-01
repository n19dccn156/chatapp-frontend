import { IAction } from "../../interface/redux";

const AddFriendReducer = (state = 'FALSE', {type}: IAction) => {
    switch (type) {
		case 'OPEN_ADD_FRIEND':
			return true
		case 'CLOSE_ADD_FRIEND':
			return false;
		default:
			return state;
    }
}
  
export default AddFriendReducer;