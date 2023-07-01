import { IAction } from "../../interface/redux";

const ChooseRoomReducer = (state = '', {type}: IAction) => {
    if(type !== '') return type
    return state;
}
  
  export default ChooseRoomReducer;