import { CommentOutlined, ContactsOutlined, LogoutOutlined } from '@ant-design/icons';
import { Image, message } from 'antd';
import { WIDTH_CELL, HEIGHT_CELL, WIDTH_ITEM, HEIGHT } from '../static/common/Constant';
import { useDispatch, useSelector } from 'react-redux';
import { openProfileAction } from '../redux/action/ProfileAction';
import { IStore } from '../interface/redux';
import ProfileMe from './modal/ProfileMe';
import { useEffect, useState } from 'react';
import { initAccount, accountMe } from '../api/user.me';

function TabbarMenu() {

    const isOpenProfile = useSelector((store: IStore) => store.profileState);
	const dispatch = useDispatch();
    const [account, setAccount] = useState(initAccount);

    useEffect(() => {
        accountMe()
        .then(res => {
            setAccount(res);
            localStorage.setItem('avatar', res.avatar);
            localStorage.setItem('nickname', res.nickname);
        })
        .catch(err => {
            message.error(err);
        })
    }, [])

    function onOpenProfile() {
        dispatch(openProfileAction());
    }
    
    return (
        <div>
            <div style={styles.item_normal}>
            <Image 
                src={account?.avatar} 
                style={{borderRadius: 12, cursor: 'pointer'}}
                preview={false}
                onClick={onOpenProfile}
            />
            </div>
            <div style={{marginTop: 48}}>
            <div style={styles.item_active}>
                <CommentOutlined style={styles.icon}/>
            </div>
            <div style={styles.item_normal}>
                <ContactsOutlined style={styles.icon}/>
            </div>
            <div style={styles.item_under}>
                <LogoutOutlined style={styles.icon}/>
            </div>
            </div>
            {isOpenProfile === true ? <ProfileMe/> : <></>}
        </div>
    )
}

  const styles = {
    icon: {
      display: 'flex', 
      justifyContent: 'center', 
      paddingTop: 16, 
      fontSize: 32, 
      color:'white',
    },
    item_normal: {
      width: WIDTH_CELL, 
      height: HEIGHT_CELL, 
      margin: 8,
      cursor: 'pointer'
    },
    item_active: {
      width: WIDTH_ITEM, 
      height: HEIGHT_CELL, 
      backgroundColor: '#0958d9',
      cursor: 'pointer',
    },
    item_under: {
      width: WIDTH_CELL, 
      height: HEIGHT_CELL, 
      margin: 8, 
      marginTop: HEIGHT/2,
      cursor: 'pointer'
    },
    item_under_active: {
      width: WIDTH_ITEM, 
      height: HEIGHT_CELL, 
      marginTop: HEIGHT/2,
      backgroundColor: '#0958d9'
    }
}

export default TabbarMenu;
