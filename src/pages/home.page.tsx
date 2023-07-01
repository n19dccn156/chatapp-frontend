import ChatList from "../components/ChatList";
import ChatMain from "../components/ChatMain";
import FileManagement from "../components/FileManagement";
import TabbarMenu from "../components/SibarMenu";
import { THIRD, PRIMARY } from "../static/common/Colors";
import { HEIGHT } from "../static/common/Constant";

export default function HomePage() {
    return (
        <div style={{display: 'flex', margin: -8, position: 'fixed'}}>
        {/* Tabbar */}
        <div style={styles.tab_item}>
            <TabbarMenu/>
        </div>
        {/* List Menu */}
        <div style={{display: 'flex', flex: 2}}>
            <ChatList/>
        </div>
        {/* Main chat */}
        <div style={styles.main_item}>
            <ChatMain/>
        </div>
        {/* manage file */}
        <div style={{display: 'flex', flex: 2, backgroundColor: THIRD}}>
            <FileManagement/>
        </div>
        </div>
    )
}

const styles = {
  tab_item: {
    width: 80,
    height: HEIGHT, 
    backgroundColor: PRIMARY, 
    paddingTop: 8
  },
  main_item: {
    display: 'flex', 
    flex: 4,
    backgroundColor: 'WHITE'
  }
}