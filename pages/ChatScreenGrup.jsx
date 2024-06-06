import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import { Platform } from 'react-native';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { firestoreDB } from '../components/firebase.config';
import moment from 'moment';

const GroupChat = ({ route }) => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);

  const { room } = route.params;
  console.log("Room : ", room);

  useLayoutEffect(() => {
    setLoading(true);
    const msgQuery = query(
      collection(firestoreDB, "chats", room?._id, "messages"),
      orderBy("timeStamp", "asc")
    );
  
    const unsubscribe = onSnapshot(msgQuery, (querySnap) => {
      const upMsg = querySnap.docs.map(doc => doc.data());
      setMessages(upMsg);
      setLoading(false);
    }, error => {
      console.error("Error fetching messages:", error);
      setLoading(false);
    });
  
    return unsubscribe;
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleTyping = (text) => {
    setMessage(text);
    setIsTyping(text.length > 0); 
  };

  const sendMessage = async () => {
    console.log("Send button pressed");
    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      roomId: room._id,
      timeStamp: timeStamp,
      message: message,
      user: user,
    };
    setMessage("");

    await addDoc(collection(doc(firestoreDB, "chats", room._id), "messages"), _doc)
      .catch((err) => alert(err));
  };

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

        <ScrollView contentContainerStyle={styles.messagesList}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            messages?.map((msg, i) => (
              <View key={i} style={styles.messageWrapper}>
                {msg.user.providerData.email === user.providerData.email ? (
                  <View style={[styles.messageContainer, styles.myMessage]}>
                    <View style={styles.boxMessageTextUser}>
                      <Text style={styles.messageTextUser}>{msg.message}</Text>
                    </View >

                    <View style={styles.boxTimeText}>
                      <Text style={styles.timeText}>{moment(msg.timeStamp?.toDate()).format('h:mm A')}</Text>
                    </View>

                  </View>
                ) : (
                  <View style={[styles.messageContainer, styles.otherMessage]}>
                    <Image source={{ uri: msg.user.profilePic }} style={styles.profilePic} />
                    <View>
                      <View>
                        <Text style={styles.senderName}>{msg.user.fullName}</Text>
                      </View>

                      <View style={styles.boxMessageText}>
                        <Text style={styles.messageText}>{msg.message}</Text>
                      </View >

                      <View style={styles.boxTimeText}>
                        <Text style={styles.timeText}>{moment(msg.timeStamp?.toDate()).format('h:mm A')}</Text>
                      </View>

                    </View>
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <Image source={require('../assets/Clip, Attachment.png')} style={styles.iconButton} />
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            placeholderTextColor="#999"
            value={message}
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
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
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
    fontWeight: '500',
    color: '#000000',
    alignSelf: 'center',
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Poppins',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageWrapper: {
    marginVertical: 5,
  },
  messageContainer: {
    borderRadius: 10,
    padding: 10,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {

    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'flex-start',

  },
  messageText: {
    color: '#000',
    fontSize: 16,
  },
  boxMessageText: {


    backgroundColor: '#f2f2f2',
    padding: 12,
    marginTop: 5,
    borderRadius: 10,

  },

  messageTextUser: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  boxMessageTextUser: {
    backgroundColor: '#20A090',
    padding: 12,
    marginTop: 5,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  timeText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    alignSelf: 'flex-end'

  },

  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderColor: '#00',
    borderWidth: 0.5,
  },
  senderName: {
    fontSize: 18,
    
    color: '#000',
    fontFamily: 'Poppins',
    fontWeight: '500',
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
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 10,
    width: 45,
    height: 45,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    marginHorizontal: 8,
    width: 30,
    height: 30,
  },
});

export default GroupChat;
