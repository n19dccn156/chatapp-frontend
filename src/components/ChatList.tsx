import { SearchOutlined, UserAddOutlined, UsergroupAddOutlined } from "@ant-design/icons"
import { Avatar, Col, Input, Row, message } from "antd"
import { HEIGHT } from "../static/common/Constant"
import { useDispatch, useSelector } from "react-redux";
import { IStore } from "../interface/redux";
import { openAddFriendAction } from "../redux/action/AddFriendAction";
import FindFriend from "./modal/FindFriend";
import { useEffect, useState } from "react";
import { THIRD } from "../static/common/Colors";
import { initMessagesMe, messagesMe } from "../api/user.me";
import { chooseRoomAction } from "../redux/action/ChooseRoomAction";
// import { v4 as uuidv4 } from 'uuid';

function ChatList() {
    const [isAddFriend, setIsAddFriend] = useState(false);
    const [isCreateGroup, setIsCreateGroup] = useState(false);
    const [isMessage, setIsMessage] = useState("");
    const [isClickMessage, setIsClickMessage] = useState("");
    const [messages, setMessages] = useState(initMessagesMe)
    const isOpenAddFriend = useSelector((store: IStore) => store.addFriendState);
    const receiveMessage = useSelector((store: IStore) => store.receiveState);
	const dispatch = useDispatch();

    function onAddFriend() {
        dispatch(openAddFriendAction());
    }

    function handleDate(datetime: string) {
        return datetime.substring(11, 16)
    }

    useEffect(() => {
        messagesMe(Number(localStorage.getItem("accountId")))
        .then(res => {
            setMessages(res);
            if(res.length > 0) {
                setIsClickMessage(res[0].roomId)
                dispatch(chooseRoomAction(res[0].roomId));
                // if(res[0].type !== 'VIDEO') {
                //     localStorage.setItem("roomInfo", JSON.stringify(res[0]))
                // }
            }
        })
        .catch(err => message.error(err));
    }, [dispatch, receiveMessage])

    return (
        <div style={{display: 'flex', flex: 1, flexDirection: 'column', border: '0.2px solid rgb(140, 140, 140)'}}>
            <div style={{display: 'flex', height: 72}}>
                <Col offset={1} span={16} style={{display: 'flex', alignItems: 'center'}}>
                    <Input style={{display: 'flex', flex: 3}} size="large" height={40} placeholder="Tìm kiếm" prefix={<SearchOutlined/>}/>
                </Col>
                <Col offset={1} span={2} style={{display: 'flex', alignItems: 'center'}}>
                    <UserAddOutlined onMouseEnter={() => setIsAddFriend(true)} onMouseLeave={() => setIsAddFriend(false)} style={{display: 'flex', flex: 1, alignContent: 'center', fontSize: 24, backgroundColor: isAddFriend ? '#d9d9d9':'#FFFFFF', padding: '4px 4px 4px 4px', borderRadius: 4}} onClick={onAddFriend}/>
                </Col>
                <Col offset={1} span={2} style={{display: 'flex', alignItems: 'center'}}>
                    <UsergroupAddOutlined onMouseEnter={() => setIsCreateGroup(true)} onMouseLeave={() => setIsCreateGroup(false)} style={{display: 'flex', flex: 1, alignContent: 'center', fontSize: 24, backgroundColor: isCreateGroup ? '#d9d9d9' :'#FFFFFF', padding: '4px 4px 4px 4px', borderRadius: 4}}/>
                </Col>
            </div>
            <div>
                <div style={{border: '.2px solid rgb(140, 140, 140)'}}></div>
                {/* body list */}
                <Row style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignContent: 'flex-start', flex: 16, maxHeight: HEIGHT/1.1, overflow: 'scroll'}}>
                    {
                    messages.map((data) => (
                        <Col key={data.roomId} span={24} style={{display: 'flex', flexDirection: 'row', height: 80, backgroundColor: (isMessage === data.roomId || isClickMessage === data.roomId) ? THIRD : '#FFFFFF'}} onMouseEnter={() => setIsMessage(data.roomId)} onMouseLeave={() => setIsMessage("")} onClick={() => {dispatch(chooseRoomAction(data.roomId)); setIsClickMessage(data.roomId); localStorage.setItem("roomInfo", JSON.stringify(data));}}>
                            <Col span={6}>
                                <div style={{display: 'flex', justifyContent: 'center'}}>
                                <Avatar size="large" style={{marginTop: 8, width: 60, height: 60, fontSize: 40}} src={data.avatar}></Avatar>          
                                </div>
                            </Col>
                            <Col offset={2} span={16}>
                                <div style={{ marginTop: 16, fontSize: 18}}>{data.name}</div>
                                <div style={{ marginTop: 8, fontSize: 14, color: '#8c8c8c'}}>{handleDate(data.createdAt)}</div>
                            </Col>
                        </Col>
                    ))
                    }
                </Row>
            </div>
            {isOpenAddFriend === true ? <FindFriend/> : <></>}
        </div>
    )
}

export default ChatList;
