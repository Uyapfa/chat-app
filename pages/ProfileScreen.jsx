import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { doc, updateDoc } from 'firebase/firestore';
import { firestoreDB } from '../components/firebase.config';
import { SET_USER } from '../store/actions/userActions'; // Ensure correct import
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';


const ProfilePage = () => {
    const navigation = useNavigation();
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch(); // Initialize dispatch

    const [displayName, setDisplayName] = useState(user.fullName);
    const [email, setEmail] = useState(user.providerData.email);
    const [status, setStatus] = useState(user.status || "Add status");
    const [phoneNumber, setPhoneNumber] = useState(user.providerData.phoneNumber || "Add Phone");
    const [changesMade, setChangesMade] = useState(false);


    const [profilePicture, setProfilePicture] = useState(user.profilePic);



    const selectProfilePicture = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [2, 1],
            quality: 1,
        });

        console.log("Picker Result:", pickerResult); // Log the entire pickerResult object

        if (pickerResult.cancelled) {
            console.log("Image selection cancelled");
            return;
        }

        if (!pickerResult.assets || pickerResult.assets.length === 0 || !pickerResult.assets[0].uri) {
            console.log("No URI selected");
            return;
        }

        console.log("Setting profile picture with URI:", pickerResult.assets[0].uri);
        setProfilePicture(pickerResult.assets[0].uri);
        setChangesMade(true);
    };





    const updateProfileData = async (userId, newData) => {
        const userRef = doc(firestoreDB, 'users', userId);

        try {
            await updateDoc(userRef, newData);
            console.log('Profile data updated successfully');
            return true;
        } catch (error) {
            console.error('Error updating profile data: ', error);
            return false;
        }
    };

    const handleSave = async () => {
        const updatedData = {
            fullName: displayName,
            email: email,
            status: status,
            phoneNumber: phoneNumber,
            profilePic: profilePicture // Ensure profilePicture is included
        };

        const success = await updateProfileData(user._id, updatedData);
        if (success) {
            dispatch(SET_USER({ ...user, ...updatedData }));
            console.log('Profile details saved');
            Alert.alert('Success', 'Profile details saved');
            setChangesMade(false);
        } else {
            console.log('Failed to save profile details');
        }
    };


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -500}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                    <View style={styles.topContainer}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Ionicons name="arrow-back" size={24} color="white" style={styles.backIcon} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.profileHeader}>
                            <TouchableOpacity onPress={selectProfilePicture}>
                                <Image source={{ uri: profilePicture }} style={styles.profilePic} />

                            </TouchableOpacity>
                            <Text style={styles.fullName}>{user.fullName}</Text>
                            <Text style={styles.email}>{user.providerData.email}</Text>
                        </View>
                        <View style={styles.iconsContainer}>
                            <TouchableOpacity onPress={() => console.log('Icon 1 pressed')}>
                                <View style={styles.iconContainer}>
                                    <Image source={require('../assets/MessageP.png')} style={styles.icon} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => console.log('Icon 2 pressed')}>
                                <View style={styles.iconContainer}>
                                    <Image source={require('../assets/VideosP.png')} style={styles.icon} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => console.log('Icon 3 pressed')}>
                                <View style={styles.iconContainer}>
                                    <Image source={require('../assets/CallP.png')} style={styles.icon} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => console.log('Icon 4 pressed')}>
                                <View style={styles.iconContainer}>
                                    <Image source={require('../assets/More.png')} style={styles.icon} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.bottomContainer}>
                        <Text style={styles.detailText}>Display Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Display Name"
                            value={displayName}
                            onChangeText={text => { setDisplayName(text); setChangesMade(true); }}
                            textAlign="left"
                        />
                        <Text style={styles.detailText}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            value={email}
                            onChangeText={text => { setEmail(text); setChangesMade(true); }}
                            keyboardType="email-address"
                            textAlign="left"
                        />
                        <Text style={styles.detailText}>Status</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Status"
                            value={status}
                            onChangeText={text => { setStatus(text); setChangesMade(true); }}
                            textAlign="left"
                        />
                        <Text style={styles.detailText}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChangeText={text => { setPhoneNumber(text); setChangesMade(true); }}
                            keyboardType="phone-pad"
                            textAlign="left"
                        />
                        {changesMade && (
                            <TouchableOpacity onPress={handleSave}>
                                <Text style={styles.saveButton}>Save</Text>
                            </TouchableOpacity>
                        )}
                        <View style={styles.imagesContainer}>
                            <View style={styles.titlesRow}>
                                <Text style={styles.leftTitle}>Media Shared</Text>
                                <Text style={styles.rightTitle}>View All</Text>
                            </View>
                            <View style={styles.imagesRow}>
                                <Image source={require('../assets/media1.png')} style={styles.image} />
                                <Image source={require('../assets/media2.png')} style={styles.image} />
                                <Image source={require('../assets/media3.png')} style={styles.image} />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000E08',
    },
    topContainer: {
        height: "40%",
        backgroundColor: '#000E08',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backIcon: {
        marginRight: 20,
        marginTop: 30
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profilePic: {
        width: 85,
        height: 85,
        borderRadius: 60,
        marginBottom: 10,
    },
    fullName: {
        fontFamily: 'Poppins',
        fontWeight: '700',
        fontSize: 25,
        marginBottom: 10,
        color: "#FFFFFF"
    },
    email: {
        fontFamily: 'Poppins',
        fontWeight: '700',
        fontSize: 13,
        color: "#FFFFFF"
    },
    saveButton: {
        marginTop: 10,
        fontSize: 16,
        color: 'blue',
    },
    iconsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    icon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        overflow: 'hidden',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 25,
        backgroundColor: '#051D13',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    bottomContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        elevation: 3, // Adds shadow for Android
        shadowColor: '#000', // Adds shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        marginTop: 20
    },
    input: {
        width: '100%',
        borderRadius: 5,
        textAlign: 'left', // Align text to the left
    },
    detailText: {
        color: '#797C7B',
        fontSize: 16,
        marginTop: 20,
        alignSelf: 'flex-start',
        fontFamily: 'Poppins',
        fontWeight: '700',
    },
    imagesContainer: {
        marginTop: 30,
    },
    titlesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    leftTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: "#797C7B"
    },
    rightTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: "#20A090"
    },
    imagesRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',

    },
    image: {
        width: 100,
        height: 100,
    },
});

export default ProfilePage;
