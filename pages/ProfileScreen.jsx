import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const ProfilePage = () => {
  const navigation = useNavigation();
  const [displayName, setDisplayName] = useState('Jhon Abraham');
  const [email, setEmail] = useState('jhonabraham20@gmail.com');
  const [status, setStatus] = useState("I’m not in the mood.");
  const [phoneNumber, setPhoneNumber] = useState('(320) 555-0104');
  const user = useSelector((state) => state.user.user);
  const handleSave = () => {
    // Logic to save updated profile details to backend/database
    console.log('Profile details saved');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" style={styles.backIcon} />
        </TouchableOpacity>
      
      </View>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={() => console.log('Change Profile Picture')}>
          <Image  source={{ uri: user.profilePic }} style={styles.profilePic} />
        </TouchableOpacity>
        <Text style={styles.fullName} >{user.fullName}</Text>
        <Text style={styles.email}>{user.providerData.email}</Text>






        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>
      {/* Rest of the profile info */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backIcon: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },

  fullName:{
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 25,
    marginBottom: 10,
  },
  email: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 13,
  },
  
  saveButton: {
    marginTop: 10,
    fontSize: 16,
    color: 'blue',
  },
  // Styles for profile info section
});

export default ProfilePage;
