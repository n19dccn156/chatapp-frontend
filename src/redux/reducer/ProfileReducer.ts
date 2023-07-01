import { IAction } from "../../interface/redux";

const ProfileReducer = (state = 'FALSE', {type}: IAction) => {
    switch (type) {
		case 'OPEN_PROFILE':
			return true
		case 'CLOSE_PROFILE':
			return false;
		default:
			return state;
    }
}
  
  export default ProfileReducer;