import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { QuerySnapshot, collection, onSnapshot, orderBy, query, setDoc, getDocs } from 'firebase/firestore';
import { firestoreDB } from '../components/firebase.config';
import { doc } from 'firebase/firestore';

const Home = () => {
  const user = useSelector((state) => state.user.user);
  const navigation = useNavigation();
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [chats, setChats] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(firestoreDB, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const userData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        selected: doc.id === user.id  // Mark user as selected if ID matches logged-in user's ID
      }));
      setUsers(userData);

    };
    setSelectedUserIds([user.id]);
    setSelectedUsers([user]);
  
    fetchUsers();
  }, [user.id]);
  

  useLayoutEffect(() => {
    const chatQuery = query(collection(firestoreDB, "chats"), orderBy("_id", "desc"));
    const unsubscribe = onSnapshot(chatQuery, (querySnapShot) => {
      const chatRooms = querySnapShot.docs.map(doc => doc.data());
      setChats(chatRooms);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleProfilePress = () => {
    navigation.navigate('ProfilePage');
  };

  const handleAddNewChatRoom = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setGroupName('');
    setImageLink('');
    
  };

  const handleGroupNameChange = (text) => {
    setGroupName(text);
  };

  const handleImageLinkChange = (text) => {
    setImageLink(text);
  };

  const handleUserSelection = (userId) => {
    const index = selectedUserIds.indexOf(userId);
    if (index === -1) {
      setSelectedUserIds([...selectedUserIds, userId]);
      const user = users.find(user => user.id === userId);
      setSelectedUsers([...selectedUsers, user]);
    } else {
      setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
      setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
    }
  };

  const handleCreateChatRoom = async () => {
    let id = `${Date.now()}`;

    if (!groupName) {
      Alert.alert("Group name cannot be empty!");
      return;
    }

    if (!imageLink) {
      Alert.alert(
        "Image Link Empty",
        "The image link is empty. Do you want to continue with the default image?",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel"
          },
          {
            text: "OK",
            onPress: () => {
              setImageLink("https://tse1.mm.bing.net/th?id=OIP.4-7WHmM-lc_CFLvqaQpHUQAAAA&pid=Api&P=0&h=220");
              createChatRoom(id);
            }
          }
        ],
        { cancelable: false }
      );
    } else {
      createChatRoom(id);
    }
  };

  const createChatRoom = (id) => {
    const _doc = {
      _id: id,
      users: selectedUsers,
      groupName: groupName,
      groupImage: imageLink ? imageLink : "https://tse1.mm.bing.net/th?id=OIP.4-7WHmM-lc_CFLvqaQpHUQAAAA&pid=Api&P=0&h=220",
    };

    setDoc(doc(firestoreDB, "chats", id), _doc)
      .then(() => {
        setGroupName("");
        setImageLink("");
        setSelectedUsers([]);
        setSelectedUserIds([]);
      })
      .catch((err) => {
        Alert.alert("Error: " + err);
      });

    handleModalClose();
    Alert.alert("Success", "Group Chat created successfully!");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcons}>
          <Image
            source={require('../assets/search-icon.png')}
            style={styles.icon}
          />
          <TouchableOpacity onPress={handleAddNewChatRoom}>
            <Icon name="plus" size={24} color="#ffffff" style={styles.plusIcon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Home</Text>
        <TouchableOpacity onPress={handleProfilePress}>
          <Image
            source={{ uri: user.profilePic }}
            style={styles.profilePic}
          />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.statusContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.statusItem}>
              <Image
                source={require('../assets/status-icon1.png')}
                style={styles.statusIcon}
              />
              <Text style={styles.statusText}>My status</Text>
            </View>
            <View style={styles.statusItem}>
              <Image
                source={require('../assets/status-icon2.png')}
                style={styles.statusIcon}
              />
              <Text style={styles.statusText}>Adil</Text>
            </View>
            <View style={styles.statusItem}>
              <Image
                source={require('../assets/status-icon3.png')}
                style={styles.statusIcon}
              />
              <Text style={styles.statusText}>Status 3</Text>
            </View>
            <View style={styles.statusItem}>
              <Image
                source={require('../assets/status-icon4.png')}
                style={styles.statusIcon}
              />
              <Text style={styles.statusText}>Status 4</Text>
            </View>
            <View style={styles.statusItem}>
              <Image
                source={require('../assets/status-icon5.png')}
                style={styles.statusIcon}
              />
              <Text style={styles.statusText}>Status 5</Text>
            </View>
          </ScrollView>
        </View>
        <View style={[styles.messageView, { height: screenHeight - 200 }]}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="black" />
            </View>
          ) : (
            <>
              {chats && chats.length > 0 ? (
                chats.map(room => (
                  <MessageCard key={room._id} room={room} />
                ))
              ) : (
                <View><ActivityIndicator/></View>              )}
            </>
          )}
        </View>
      </ScrollView>
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <Image source={require('../assets/Message.png')} style={styles.navIcon} />
          <Text style={styles.navText}>Message</Text>
        </View>
        <View style={styles.navItem}>
          <Image source={require('../assets/Call.png')} style={styles.navIcon} />
          <Text style={styles.navText}>Calls</Text>
        </View>
        <View style={styles.navItem}>
          <Image source={require('../assets/user.png')} style={styles.navIcon} />
          <Text style={styles.navText}>Contacts</Text>
        </View>
        <View style={styles.navItem}>
          <Image source={require('../assets/settings.png')} style={styles.navIcon} />
          <Text style={styles.navText}>Settings</Text>
        </View>
      </View>

      <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={handleModalClose}
>
  <KeyboardAvoidingView
    style={styles.modalContainer}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    <View style={styles.modalContent}>
      <TextInput
        style={styles.input}
        placeholder="Enter group name"
        placeholderTextColor="#999"
        value={groupName}
        onChangeText={handleGroupNameChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Provide image link"
        placeholderTextColor="#999"
        value={imageLink}
        onChangeText={handleImageLinkChange}
      />
      <View style={styles.dropdownContainer}>
        <Text style={styles.dropdownLabel}>Select Users:</Text>
        <View style={styles.dropdown}>
          {users.map(user => (
            <View key={user.id} style={styles.userItem}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  selectedUserIds.includes(user.id) && styles.checkedCheckbox
                ]}
                onPress={() => handleUserSelection(user.id)}
              >
                {selectedUserIds.includes(user.id) && <Icon name="check" size={24} color="#fff" />}
              </TouchableOpacity>
              <Text style={styles.userName}>{user.fullName}</Text>
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleCreateChatRoom}>
        <Text style={styles.buttonText}>Create Chat Room</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.closeButton} onPress={handleModalClose}>
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </KeyboardAvoidingView>
</Modal>

    </View>
  );
};

const MessageCard = ({ room }) => {

  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.messageCard} onPress={() => navigation.navigate("GroupChat", {room : room})} >
      <Image
        source={{ uri: room.groupImage }}
        style={styles.groupIcon}
      />
      <View style={styles.messageContent}>
        <Text style={styles.groupName}>{room.groupName}</Text>
        <Text style={styles.messageText}>Another message</Text>
      </View>
      <Text style={styles.timeText}>1:45 PM</Text>
    </TouchableOpacity>
  );
};





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000E08',
  },
  header: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    backgroundColor: '#000E08',
    position: 'absolute',
    paddingTop: 30,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 44,
    height: 44,
    marginRight: 20,
  },
  plusIcon: {
    marginRight: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    left: '50%',
    transform: [{ translateX: -65 }],
  },
  profilePic: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  statusContainer: {
    flexDirection: 'row',
    marginTop: 110,
    paddingVertical: 16,
  },
  statusItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  statusIcon: {
    width: 58,
    height: 58,
  },
  statusText: {
    color: '#ffffff',
    marginTop: 8,
    fontSize: 16,
  },
  messageView: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: 20,
    padding: 18,
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 10,
    width: '100%',
  },
  groupIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  messageContent: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  messageText: {
    fontSize: 14,
    color: '#000',
  },
  timeText: {
    fontSize: 12,
    color: '#888',
  },
  customViewText: {
    color: '#000',
    fontSize: 18,
  },
  bottomNav: {
    width: '100%',
    height: 90,
    backgroundColor: '#EEFAF8',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    position: 'absolute',
    bottom: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    width: 26,
    height: 26,
  },
  navText: {
    marginTop: 4,
    fontSize: 12,
    color: '#797C7B',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkedCheckbox: {
    backgroundColor: '#007bff',
  },
  userName: {
    fontSize: 16,
    color: '#000',
  },
  
});

export default Home;
