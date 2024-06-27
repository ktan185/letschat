import { useSearchParams } from 'react-router-dom';
import styles from './chat.module.css'
function Chat(){
    let [searchParams, setSearchParams] = useSearchParams();
    const ownerEmailAddress = searchParams.get('ownerEmailAddress');
    const uniqueChatID = searchParams.get('uniqueChatID');


    return(
        <div className={styles.container}>Welcome the owner of this chat is {ownerEmailAddress} and the uniqueChatID is {uniqueChatID}</div>
    )
}
export default Chat