import { Modal, Typography, Radio, Image, message } from "antd";
import { IStore } from "../../interface/redux";
import { useDispatch, useSelector } from "react-redux";
import { closeProfileAction } from "../../redux/action/ProfileAction";
import { useEffect, useState } from "react";
import { accountMe, initAccount } from "../../api/user.me";

export default function ProfileMe() {

    const isOpenProfile = useSelector((store: IStore) => store.profileState);
	const dispatch = useDispatch();
    const [account, setAccount] = useState(initAccount);

    useEffect(() => {
        accountMe()
        .then(res => {
            setAccount(res);
        })
        .catch(err => {
            message.error(err);
        })
    }, [])

    function onCancel() {
        dispatch(closeProfileAction());
    }

    return (
        <Modal
            open={isOpenProfile}
            onCancel={onCancel}
            title={'Thông tin tài khoản'}
            footer={false}
            style={{display: 'flex', flexDirection: 'column', maxWidth: 400}}
        >
            <Image 
                src={account.avatar}
                preview={false} height={160} width={350}
                style={{paddingBottom: 40}}/>
            <div>
                <Typography.Title level={4}>Thông tin cá nhân</Typography.Title>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <div>
                        <p style={{fontWeight: 'bold'}}>Nickname</p>
                        <p style={{fontWeight: 'bold'}}>Email</p>
                        <p style={{fontWeight: 'bold'}}>Giới tính</p>
                        <p style={{fontWeight: 'bold'}}>Quyền sử dụng</p>
                    </div>
                    <div style={{marginLeft: 60}}>
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
        </Modal>
    )
}
