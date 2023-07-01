import { Button, Col, Image, Typography, message } from "antd";
import { THIRD } from "../static/common/Colors";
import { HEIGHT } from "../static/common/Constant";
import { useEffect, useState } from "react";
import { getMessageInfo, imagesInRoom, initMembers, membersInRoom } from "../api/message";
import { UsergroupAddOutlined, UsergroupDeleteOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { IStore } from "../interface/redux";
import { initMessagesInfo } from "../api/user.me";
import { IMessagesMeList } from "../interface/user.me";

function FileManagement() {

    const roomSelected = useSelector((store: IStore) => store.chooseRoomState);
    const [images, setImages] = useState([""])
    const [messageInfo, setMessageInfo] = useState(initMessagesInfo);
    const [members, setMembers] = useState(initMembers)
    const receiveMessage = useSelector((store: IStore) => store.receiveState);

    useEffect(() => {
        const room = JSON.parse(localStorage.getItem('roomInfo') ?? '') as IMessagesMeList
        if(room?.roomId?.length > 30) {
            imagesInRoom(room.roomId)
            .then(res => {
                setImages(res);
            })
            .catch(err => {
                message.error(err);
            })
            getMessageInfo(room.roomId)
            .then(res => {
                setMessageInfo(res);
            })
            .catch(err => {
                message.error(err);
            })
            membersInRoom(room.roomId)
            .then(res => {
                setMembers(res);
            })
            .catch(err => {
                message.error(err);
            })
        }
    }, [roomSelected, receiveMessage, messageInfo])

    return (
        <div style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
            <div style={{display: 'flex', height: 72.5, justifyContent: 'center', fontSize: 22, backgroundColor: 'white'}}>
                <Typography.Title level={3}>Thông tin hội thoại</Typography.Title>
            </div>
            <div style={{border: '.1px solid rgb(140, 140, 140)'}}></div>
            <div style={{display: 'flex', flex: 1, flexDirection: 'column', alignContent: 'flex-start', backgroundColor: THIRD, maxHeight: HEIGHT/1.1, overflow: 'scroll'}}>
                <div style={{display: 'flex', flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', height: 400, backgroundColor: 'white'}}>
                    <Image width={80} height={100} style={{marginTop: 8, marginBottom: -8}} src={messageInfo.avatar}/>
                    <div>
                        <Typography.Title level={5}>{messageInfo.name}</Typography.Title>
                        {messageInfo.type === 'GROUP' ? (<><Typography.Text>Số lượng thành viên: {members.length}</Typography.Text> </>):(<></>)} 
                    </div>    
                    {messageInfo.type === 'GROUP' ? 
                    (<div>
                        <Button style={{marginRight: 16}} size="large" icon={<UsergroupAddOutlined size={40}/>}/>    
                        <Button style={{marginLeft: 16}} size="large" icon={<UsergroupDeleteOutlined sizes="large"/>}/>            
                    </div>):(<></>)} 
                </div>
                <div style={{display: 'flex', flex: 3, alignContent: 'flex-start', flexWrap: 'wrap', marginTop: 8, height: 400, backgroundColor: 'white', overflow: 'scroll'}}>
                    {images.map((img, index) => {
                        return(<Col key={index} span={12}><Image height={100} src={img}/></Col>)
                    })}
                </div>
            </div>
        </div>
    )
}
export default FileManagement;
