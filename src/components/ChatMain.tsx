import { CloseCircleFilled, PaperClipOutlined, PhoneOutlined, PictureOutlined, SendOutlined, VideoCameraFilled, VideoCameraOutlined } from "@ant-design/icons";
import { Avatar, Badge, Col, Image, Input, Modal, Row, Typography, Upload, UploadProps, message } from "antd";
import { SECOND, THIRD } from "../static/common/Colors";
import { HEIGHT, WS_HOST } from "../static/common/Constant";
import { useDispatch, useSelector } from "react-redux";
import { IStore } from "../interface/redux";
import { useEffect, useRef, useState } from "react";
import { initMessageReceive, messagesRoom } from "../api/user.me";
import { IMessageReceive, IMessagesMe } from "../interface/user.me";
import { Stomp } from "@stomp/stompjs";
import { receiveAction } from "../redux/action/ReceiveAction";
import { onSaveFiles } from "../api/file";
import { chooseRoomAction } from "../redux/action/ChooseRoomAction";
import bell from "../static/audio/bell-audio.mp3";
import busy from "../static/audio/busy-audio.mp3";
import axios from "axios";

const bellAudio = new Audio(bell);
const busyAudio = new Audio(busy);
let stompClient: any;
let count = 0;
let awaiting = false;
let calling = false;
let link = '';

export default function ChatMain() {

    const dispatch = useDispatch();
    const accountId = localStorage.getItem('accountId');
    const [roomInfo, setRoomInfo] = useState(Object);
    const roomSelected = useSelector((store: IStore) => store.chooseRoomState);
    const receiveMessage = useSelector((store: IStore) => store.receiveState);
    const [messages, setMessages] = useState(initMessageReceive);
    const [text, setText] = useState('');
    const [isImage, setIsImage] = useState(false);
    const [isFile, setIsFile] = useState(false);
    const [isCall, setIsCall] = useState(false);
    const [isVideo, setIsVideo] = useState(false);
    const [avatarCall, setAvatarCall] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages])

    useEffect(() => {
        function onConnected() {
            stompClient.subscribe(`/topic/${roomSelected}`, function(payload: any) {
                const messageReceive = JSON.parse(payload.body) as IMessageReceive;
                const data: IMessageReceive = {
                    message: {
                        messageId: messageReceive.message.messageId,
                        senderId: messageReceive.message.senderId,
                        roomId: messageReceive.message.roomId,
                        type: messageReceive.message.type,
                        text: messageReceive.message.text,
                        avatar: messageReceive.message.avatar,
                        createdAt: messageReceive.message.createdAt,
                    },
                    files: messageReceive.files
                }
                dispatch(chooseRoomAction(roomInfo.roomId))
                dispatch(receiveAction(String(!receiveMessage)));
                if(data.message.type === 'VIDEO') {
                    setAvatarCall(data.message.avatar);
                    setRoomInfo(roomInfo);
                    link = data.message.text;
                    if(data.message.senderId === Number(localStorage.getItem('accountId'))) awaiting = true;
                    else calling = true;
                    playAudio();
                } else {
                    if(data.message.type === 'CANCEL') {
                        onClose();
                    }
                    if(data.message?.type === 'ACCEPT') {
                        onClose();
                        openInNewTab();
                    }
                    setMessages(messages => [...messages, data]);
                }
            });
        }

        const onError = (error: any) => {
            console.log(error);
        }

        stompClient = Stomp.over(function() {
            return new WebSocket(WS_HOST)
        });
        stompClient.connect({}, onConnected, onError);
    }, [roomInfo]);
    
    const sendTextMessage = (text: string, type: string, files: string[]) => {
        if(stompClient && stompClient && roomSelected) {
            stompClient.send(`/app/message/${roomSelected}`,
            {},
            JSON.stringify({
                senderId: localStorage.getItem('accountId'), 
                roomId: roomInfo.roomId,
                type: type,
                text: text,
                avatar: localStorage.getItem('avatar'),
                files: files
            }))
        }
    };

    async function videoCallOnclick() {
        await axios({
            method: 'GET',
            url: `https://10.252.2.0:8000/create`
        })
        .then((res) => {
            console.log('...................................');
            console.log(res.data.room);
            sendTextMessage(res.data.httpResponseURl, 'VIDEO', []);
        })
        .catch(err => {
            throw new Error(err.response.data.message);
        });
    }

    useEffect(() => {
        if(roomSelected.length > 30) {
            messagesRoom(roomSelected)
            .then(res => {
                setMessages(res);
                setRoomInfo(JSON.parse(localStorage.getItem("roomInfo") ?? '') as IMessagesMe);
            })
            .catch(err => {
                message.error(err);
            })
        }
    }, [roomSelected])

    function onClose() {
        calling = false;
        awaiting = false;
        bellAudio.pause();
    }

    function handleDate(datetime: string) {
        return datetime.substring(11, 16)
    }

    function playAudio() {
        bellAudio.currentTime = 0;
        bellAudio.play();
        setTimeout(() => {
            if(awaiting) {
                busyAudio.currentTime=0;
                busyAudio.play();
                sendTextMessage('', 'CANCEL', []);
            }
        }, 20000);
    }

    const handleOnChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        count += 1;
        const fileList = newFileList.map(file => file.originFileObj) as Blob[];
        if(fileList.length === count) {
            console.log('upload file')
            onSaveFiles(fileList)
            .then(res => {
                console.log(res);
                sendTextMessage('', 'IMAGE', res);
            })
            .catch(err => {
                console.log(err);
            });
        }
    }

    const openInNewTab = () => {
        window.open(link, '_blank', 'noopener,noreferrer');
    }

    return (
        <div style={{display: 'flex', flex: 1, flexDirection: 'column', border: '.2px solid rgb(140,140,140)'}}>
            <div style={{display: 'flex', alignItems: 'flex-start', backgroundColor: 'white'}}>
                <div style={{display: 'flex', flex: 1, height: 72, flexDirection: 'row'}}>
                    <Col offset={1} span={2} style={{display: 'flex', alignItems: 'center'}}>
                    <Image
                        src={roomInfo?.avatar} 
                        style={{borderRadius: 12, cursor: 'pointer'}}
                        preview={false}
                    />
                    </Col>
                    <Col offset={1} span={8} style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                        <Typography.Title style={{marginTop: 8}} level={4}>{roomInfo?.name}</Typography.Title>
                        <Badge style={{marginTop: -8}} status="processing" text="Đang hoạt động" color="#237804"/>
                    </Col>
                    <Col offset={4} span={2} style={{display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
                        <Upload accept="image/*" beforeUpload={() => false} showUploadList={false} onChange={handleOnChange} fileList={[]} listType="text" maxCount={10} multiple><PictureOutlined onMouseEnter={() => setIsImage(true)} onMouseLeave={() => setIsImage(false)} style={{fontSize: 24, marginTop: 4, backgroundColor: isImage ? '#d9d9d9' :'#FFFFFF', padding: '4px 4px 4px 4px', borderRadius: 4}}/></Upload>
                    </Col>
                    <Col span={2} style={{display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
                        <PaperClipOutlined onMouseEnter={() => setIsFile(true)} onMouseLeave={() => setIsFile(false)} style={{fontSize: 24, marginTop: 4, backgroundColor: isFile ? '#d9d9d9' :'#FFFFFF', padding: '4px 4px 4px 4px', borderRadius: 4}}/>
                    </Col>
                    <Col span={2} style={{display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
                        <PhoneOutlined onMouseEnter={() => setIsCall(true)} onMouseLeave={() => setIsCall(false)} style={{fontSize: 24, marginTop: 4, backgroundColor: isCall ? '#d9d9d9' :'#FFFFFF', padding: '4px 4px 4px 4px', borderRadius: 4}}/> 
                    </Col>
                    <Col span={2} style={{display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
                        <VideoCameraOutlined onMouseEnter={() => setIsVideo(true)} onMouseLeave={() => setIsVideo(false)} style={{fontSize: 24, marginTop: 4, backgroundColor: isVideo ? '#d9d9d9' :'#FFFFFF', padding: '4px 4px 4px 4px', borderRadius: 4}} onClick={() => videoCallOnclick()}/>
                    </Col>
                </div>
            </div>
            <div style={{border: '.1px solid rgb(140, 140, 140)'}}></div>
            {/* body list */}
            <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignContent: 'flex-start', flex: 16, height: HEIGHT/1.25, maxHeight: HEIGHT/1.25, overflow: 'auto', backgroundColor: THIRD}}>
                {messages.map(data => {
                    if(data.message.type === 'SYSTEM') 
                        return (
                            <Col key={data.message.messageId} span={24} style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 8, marginBottom: 8}}>
                                <Avatar src={data.message.avatar}/>
                                <div style={{display: 'flex', flexDirection: 'row', backgroundColor: '#d9d9d9', padding: '2px 16px 2px', marginLeft: 8, borderRadius: 16}}>
                                    {/* <Avatar src={data.avatar}/> */}
                                    <div style={{marginTop: 6}}>{data.message.text}</div>
                                </div>
                            </Col>
                        )
                    else if (data.message.senderId === Number(accountId ?? 0) && data.message.type === 'TEXT') 
                        return (
                            <Col key={data.message.messageId} push={7} span={16}  style={{display: 'flex', flexDirection: 'row', justifyContent: 'right', alignItems: 'center', marginTop: 16, marginBottom: 8}}>
                                <Col style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', backgroundColor: SECOND, padding: '8px 16px 8px 16px', marginRight: 16, borderRadius: 16}}>
                                    {/* <Avatar style={{display: 'flex', maxHeight: 32, minWidth: 32}} src={data.avatar}/> */}
                                    <div style={{marginTop: 6, overflowWrap: 'anywhere'}}>&emsp;{data.message.text}</div>
                                    <div style={{marginTop: 16, whiteSpace: 'pre-wrap'}}>{'\n'}{handleDate(data.message.createdAt)}</div>
                                </Col>
                                <Avatar style={{display: 'flex', maxHeight: 32, minWidth: 32}} src={data.message.avatar}/>
                            </Col>
                        )
                    else if (data.message.senderId === Number(accountId) && data.message.type === 'IMAGE')
                        return (
                            <Col key={data.message.messageId} push={7} span={16}  style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 16, marginBottom: 8}}>
                                <Col style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: '8px 16px 8px 16px', marginRight: 16, borderRadius: 16}}>
                                    {data.files.map(file => (
                                        <Col key={file} span={12}>
                                            <Image src={file}/>
                                        </Col>
                                    ))}
                                    <Col style={{marginTop: 16}}>{handleDate(data.message.createdAt)}</Col>
                                </Col>
                                <Avatar style={{display: 'flex', maxHeight: 32, minWidth: 32}} src={data.message.avatar}/>
                            </Col>
                        )
                    else if (data.message.senderId !== Number(accountId) && data.message.type === 'IMAGE')
                        return (
                            <Col key={data.message.messageId} push={1} span={16}  style={{display: 'flex', flexDirection: 'row', justifyContent: 'left', alignItems: 'center', marginTop: 16, marginBottom: 8}}>
                                <Avatar style={{display: 'flex', maxHeight: 32, minWidth: 32}} src={data.message.avatar}/>
                                <Col style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: '8px 16px 8px 16px', marginRight: 16, borderRadius: 16}}>
                                    {data.files.map(file => (
                                        <Col key={file} span={12}>
                                            <Image src={file}/>
                                        </Col>
                                    ))}
                                </Col>
                                <Col span={2} style={{marginTop: 16}}>{handleDate(data.message.createdAt)}</Col>
                            </Col>
                        )
                    else if (data.message.senderId === Number(accountId ?? 0) && data.message.type === 'ACCEPT') 
                        return (
                            <Col key={data.message.messageId} push={7} span={16}  style={{display: 'flex', flexDirection: 'row', justifyContent: 'right', alignItems: 'center', marginTop: 16, marginBottom: 8}}>
                                <Col style={{display: 'flex', flexDirection: 'column', flexWrap: 'wrap', backgroundColor: SECOND, padding: '16px 32px 0px 32px', marginRight: 16, borderRadius: 16}}>
                                    <VideoCameraFilled style={{fontSize: 50, color: 'green'}}/>
                                    <div style={{marginTop: 6, overflowWrap: 'anywhere'}}>Đánh giá cuộc gọi</div>
                                    <div style={{ whiteSpace: 'pre-wrap', paddingBottom: 16}}>{'\n'}{handleDate(data.message.createdAt)}</div>
                                </Col>
                                <Avatar style={{display: 'flex', maxHeight: 32, minWidth: 32}} src={data.message.avatar}/>
                            </Col>
                        )
                    else if (data.message.senderId !== Number(accountId ?? 0) && data.message.type === 'ACCEPT') 
                        return (
                            <Col key={data.message.messageId} push={1} span={16}  style={{display: 'flex', flexDirection: 'row', justifyContent: 'left', alignItems: 'center', marginTop: 16, marginBottom: 8}}>
                                <Avatar style={{display: 'flex', maxHeight: 32, minWidth: 32, marginRight: 16}} src={data.message.avatar}/>
                                <Col style={{display: 'flex', flexDirection: 'column', flexWrap: 'wrap', backgroundColor: 'white', padding: '16px 32px 0px 32px', marginRight: 16, borderRadius: 16}}>
                                    <VideoCameraFilled style={{fontSize: 50, color: 'green'}}/>
                                    <div style={{marginTop: 6, overflowWrap: 'anywhere'}}>Đánh giá cuộc gọi</div>
                                    <div style={{ whiteSpace: 'pre-wrap', paddingBottom: 16}}>{'\n'}{handleDate(data.message.createdAt)}</div>
                                </Col>
                            </Col>
                        )
                    else if (data.message.senderId === Number(accountId ?? 0) && data.message.type === 'CANCEL') 
                        return (
                            <Col key={data.message.messageId} push={7} span={16}  style={{display: 'flex', flexDirection: 'row', justifyContent: 'right', alignItems: 'center', marginTop: 16, marginBottom: 8}}>
                                <Col style={{display: 'flex', flexDirection: 'column', flexWrap: 'wrap', backgroundColor: SECOND, padding: '16px 32px 0px 32px', marginRight: 16, borderRadius: 16}}>
                                    <VideoCameraFilled style={{fontSize: 50, color: 'red'}}/>
                                    <div style={{marginTop: 6, overflowWrap: 'anywhere'}}>Cuộc gọi bị huỷ</div>
                                    <div style={{ whiteSpace: 'pre-wrap', paddingBottom: 16}}>{'\n'}{handleDate(data.message.createdAt)}</div>
                                </Col>
                                <Avatar style={{display: 'flex', maxHeight: 32, minWidth: 32}} src={data.message.avatar}/>
                            </Col>
                        )
                    else if (data.message.senderId !== Number(accountId ?? 0) && data.message.type === 'CANCEL') 
                        return (
                            <Col key={data.message.messageId} push={1} span={16}  style={{display: 'flex', flexDirection: 'row', justifyContent: 'left', alignItems: 'center', marginTop: 16, marginBottom: 8}}>
                                <Avatar style={{display: 'flex', maxHeight: 32, minWidth: 32, marginRight: 16}} src={data.message.avatar}/>
                                <Col style={{display: 'flex', flexDirection: 'column', flexWrap: 'wrap', backgroundColor: 'white', padding: '16px 32px 0px 32px', marginRight: 16, borderRadius: 16}}>
                                    <VideoCameraFilled style={{fontSize: 50, color: 'red'}}/>
                                    <div style={{marginTop: 6, overflowWrap: 'anywhere'}}>Cuộc gọi bị huỷ</div>
                                    <div style={{ whiteSpace: 'pre-wrap', paddingBottom: 16}}>{'\n'}{handleDate(data.message.createdAt)}</div>
                                </Col>
                            </Col>
                        )
                    else 
                        return (
                            <Col key={data.message.messageId} push={1} span={16}  style={{display: 'flex', flexDirection: 'row', justifyContent: 'left', alignItems: 'center', marginTop: 16, marginBottom: 8}}>
                                <Avatar style={{display: 'flex', maxHeight: 32, minWidth: 32}} src={data.message.avatar}/>
                                <Col style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', backgroundColor: 'white', padding: '8px 16px 8px 16px', marginLeft: 16, borderRadius: 16}}>
                                    <div style={{marginTop: 6, overflowWrap: 'anywhere'}}>&emsp;{data.message.text}</div>
                                    <div style={{marginTop: 16, whiteSpace: 'pre-wrap'}}>{'\n'}{handleDate(data.message.createdAt)}</div>
                                </Col>
                            </Col>
                        )
                })}
                <div ref={messagesEndRef}/>
            </div>
            <div style={{border: '.5px solid #0091ff'}}></div>
            <Row style={{display: 'flex', flex: 1, flexDirection: 'row'}}>
                <Input style={{display: 'flex', flex: 10, alignItems: 'center'}} placeholder="Gửi tin nhắn ở đây" bordered={false} value={text} onChange={(text) => setText(text.target.value)}/>
                <SendOutlined style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', fontSize: 20}} disabled={text.length > 0 ? true : false} onClick={() => {sendTextMessage(text, 'TEXT', []); setText('')}}/>
            </Row>
            <Modal open={calling} style={{height: 100, maxWidth: 200}} closable={false} footer={false}>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', backgroundImage: `url(${avatarCall})`, height: 150, backgroundSize: '100% auto', backgroundRepeat: 'no-repeat'}}></div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: 16}}>
                    <div style={{backgroundColor: 'red', width: 50, height: 50, borderRadius: 25}}>
                        <CloseCircleFilled  style={{display: 'flex', justifyContent: 'center', paddingTop: 12, fontSize: 24, color: 'white'}} onClick={() => sendTextMessage('', 'CANCEL', [])}/>
                    </div>
                    <div style={{backgroundColor: 'green', width: 50, height: 50, borderRadius: 25}}>
                        <VideoCameraFilled  style={{display: 'flex', justifyContent: 'center', paddingTop: 12, fontSize: 24, color: 'white'}} onClick={() => sendTextMessage(link, 'ACCEPT', [])}/>
                    </div>
                </div>
                <source src={bell} type="audio/ogg"/>
            </Modal>
            <Modal open={awaiting} style={{maxWidth: 200}} closable={false} footer={false}>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', backgroundImage: `url(${roomInfo.avatar})`, height: 150, backgroundSize: '100% auto', backgroundRepeat: 'no-repeat'}}></div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: 16}}>
                    <div style={{backgroundColor: 'red', width: 50, height: 50, borderRadius: 25, zIndex: 10}}>
                        {/* {link} */}
                        <CloseCircleFilled  style={{display: 'flex', justifyContent: 'center', paddingTop: 12, fontSize: 24, color: 'white'}} onClick={() => sendTextMessage('', 'CANCEL', [])}/>
                    </div>
                </div>
            </Modal>
        </div>
    )
}