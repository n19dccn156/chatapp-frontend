import { Modal, Input, Button, message, Image, Radio, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { IStore } from "../../interface/redux";
import { closeAddFriendAction } from "../../redux/action/AddFriendAction";
import { useState } from "react";
import { searchEmail } from "../../api/friend.group";
import { initAccount } from "../../api/user.me";
import { CheckOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";

export default function FindFriend() {
    const isOpenAddFriend = useSelector((store: IStore) => store.addFriendState);
	const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [account, setAccount] = useState(initAccount);

    function onSearch() {
        searchEmail(email)
        .then(res => {
            setAccount(res);
        })
        .catch(err => {
            message.error(err);
        })
    }
    function onCancel() {
        dispatch(closeAddFriendAction());
    }

    const ButtonFriend = (state: string) => {
        switch (state) {
            case 'ME':
                return <></>
            case 'ADD':
                return <><div style={{display: 'flex', justifyContent: 'center'}}><Button type="primary" icon={<PlusOutlined/>}>Kết bạn</Button></div></>
            case 'ACCEPT':
                return <><div style={{display: 'flex', justifyContent: 'space-evenly'}}><Button type="primary" icon={<CheckOutlined/>}>Đồng ý</Button><Button danger type="default" icon={<CloseOutlined/>}>Hủy lời mời</Button></div></>
            case 'AWAIT':
                return <><div style={{display: 'flex', justifyContent: 'center'}}><Button danger type="default" icon={<CloseOutlined/>}>Hủy lời mời</Button></div></>
            case 'FRIEND':
                return <><div style={{display: 'flex', justifyContent: 'center'}}><Button danger type="default" icon={<CloseOutlined/>}>Xóa bạn bè</Button></div></>
            default:
                return <></>
        }
    }
    return (
        <Modal 
            open={isOpenAddFriend}
            title={'Thêm bạn'}
            onCancel={onCancel}
            footer={false}
            style={{display: 'flex', flexDirection: 'column', maxWidth: 400}}
        >
            <div style={{ border: '.2px solid rgb(0, 44, 140)', marginBottom: 8 }}></div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <Input type="email" placeholder="Nhập email" value={email} onChange={(data) => setEmail(data.target.value)} style={{marginRight: 16}}/>
                <Button type="primary" size="large" onClick={onSearch}>Tìm kiếm</Button>
            </div>
            <div style={{ border: '.2px solid rgb(0, 44, 140)', marginTop: 8 }}></div>
            {account.gender === "" ? <></> : (
                <> 
                    <Image
                        src={account.avatar}
                        preview={false} height={160} width={350}
                        style={{ paddingBottom: 40, marginTop: 16 }} />
                        {ButtonFriend(account.state)}
                    <div>
                        <Typography.Title level={4}>Thông tin cá nhân</Typography.Title>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <div>
                                <p style={{ fontWeight: 'bold' }}>Nickname</p>
                                <p style={{ fontWeight: 'bold' }}>Email</p>
                                <p style={{ fontWeight: 'bold' }}>Giới tính</p>
                                <p style={{ fontWeight: 'bold' }}>Quyền sử dụng</p>
                            </div>
                            <div style={{ marginLeft: 60 }}>
                                <p>{account.nickname}</p>
                                <p>{account.email}</p>
                                <Radio.Group value={account.gender}>
                                    <Radio value={'MALE'}>Male</Radio>
                                    <Radio value={'FEMALE'}>Female</Radio>
                                </Radio.Group>
                                <p>{account.role}</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Modal>
    )
}
