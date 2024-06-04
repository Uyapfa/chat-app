import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import { Platform } from 'react-native';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { firestoreDB } from '../components/firebase.config';


const GroupChat = ({ route }) => {

  const navigation = useNavigation();
const user = useSelector((state) => state.user.user);


  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);


const {room} = route.params;
console.log("Room : " , room);


  useLayoutEffect(() => {
    
   const msgQuery = query(
    collection(firestoreDB, "chats", room?._id, "messages"),
    orderBy("timeStamp", "asc")
   );

   const unsubscribe = onSnapshot(msgQuery, (querySnap) => {
    const upMsg = querySnap.docs.map(doc => doc.data());
   setMessages(upMsg)
   setLoading(false)
   });
   
   return unsubscribe

  }, []);

  const handleBackPress = ({root}) => {
    navigation.goBack();
  };
  const handleTyping = (text) => {
    setInputText(text);
    setIsTyping(text.length > 0); // Check if text is typed to show/hide send button
  };

  const sendMessage = async() => {
    console.log("Send button pressed");
    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
        _id : id,
        roomId : room._id,
        timeStamp : timeStamp,
        message: message,
        user : user,
    };
    setMessage("");
    setInputText(""); // Clear the text input field
    await addDoc(collection(doc(firestoreDB, "chats" ,room._id), "messages"), _doc)
      .catch((err) => alert(err));
  };
  

//   const renderMessage = ({ item }) => (
//     <View style={styles.messageContainer}>
//       <Text style={styles.messageSender}>{item.sender}</Text>
//       <Text style={styles.messageText}>{item.text}</Text>
//       <Text style={styles.messageTime}>{item.time}</Text>
//     </View>
//   );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >

  
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
        <Image source={require('../assets/Back.png')} style={styles.backButton} />
        </TouchableOpacity>
        <Image source={{ uri: room.groupImage }} style={styles.groupIcon} /> 
        <Text style={styles.groupName}>{room.groupName}</Text>
        <View style={styles.headerIcons}>
        
          <Image source={require('../assets/Call1.png')} style={styles.callIcon} />
          
          <Image source={require('../assets/Video.png')} style={styles.callIcon} />
        </View>
      </View>
      {/* <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
      /> */}

        
<ScrollView>
{loading ? (
<>  
<View>

    <ActivityIndicator/>
</View>
</>
) : (
    <View></View>
)

}
            
</ScrollView>
      <View style={styles.inputContainer}>
      <Image source={require('../assets/Clip, Attachment.png')} style={styles.iconButton} />
        
      <TextInput
          style={styles.input}
          placeholder="Type a message"
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={handleTyping}
        />


       

        <TouchableOpacity style={styles.iconButton}>
        <Image source={require('../assets/files.png')} style={styles.iconButton} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
        <Image source={require('../assets/microphone.png')} style={styles.iconButton} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
        <Image source={require('../assets/camera.png')} style={styles.iconButton} />
        </TouchableOpacity>
       
        {isTyping && (
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage} >
            <Icon name="send" size={24} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    header: {
      height: 110,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      backgroundColor: '#ffffff',
      position: 'relative',
      paddingTop: 30,
    },
    backButton: {
      width: 30,
      height: 30,
     
      borderRadius: 25,
    },
    groupIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginLeft: 20,
      borderColor: '#000000',
      borderWidth: 1,
    },
    groupName: {
      fontSize: 20,
      Weight: '500',
      color: '#000000',
      alignSelf: 'center',
      flex: 1,
      textAlign: 'center',
      fontFamily: 'Poppins'
    },
    headerIcons: {
      flexDirection: 'row',
    },
    callIcon: {
      width: 30,
      height: 30,
      marginLeft: 16,
    },
    messagesList: {
      padding: 16,
    },
    messageContainer: {
      backgroundColor: '#f2f2f2',
      borderRadius: 10,
      padding: 10,
      marginVertical: 5,
    },
    messageSender: {
      fontWeight: 'bold',
      color: '#000',
    },
    messageText: {
      color: '#000',
    },
    messageTime: {
      color: '#888',
      fontSize: 12,
      textAlign: 'right',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: '#ccc',
      padding: 10,
      backgroundColor: '#fff',
    },
    input: {
      flex: 1,
      //borderWidth: 1,
    //  borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
    },
    sendButton: {
      backgroundColor: '#007bff',
      borderRadius: 5,
      padding: 10,
      width: 45,
      height:45,
      marginHorizontal: 5,
    },
    iconButton: {
      marginHorizontal: 8,
      width: 30,
      height:30
    },
    
  });
  

export default GroupChat;
