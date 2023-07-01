import AddFriendReducer from "./reducer/AddFriendReducer";
import ChooseRoomReducer from "./reducer/ChooseRoomReducer";
import ProfileReducer from "./reducer/ProfileReducer";
import ReceiveReducer from "./reducer/ReceiveReducer";

const store = {
    "profileState": ProfileReducer,
    "addFriendState": AddFriendReducer,
    "chooseRoomState": ChooseRoomReducer,
    "receiveState": ReceiveReducer,
}

export default store;