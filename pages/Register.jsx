import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth, firestoreDB } from '../components/firebase.config';
import { doc, setDoc } from 'firebase/firestore';


const { width, height } = Dimensions.get('window');

const Register = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState("https://www.screenfeed.fr/wp-content/uploads/2013/10/default-avatar.png")
  const [isFormValid, setIsFormValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const areFieldsValid = () => {
    return validateEmail(email) && password !== '' && name !== '' && password === confirmPassword;
  };

  useEffect(() => {
    setIsFormValid(areFieldsValid());
    setPasswordsMatch(password === confirmPassword);
  }, [email, password, confirmPassword, name]);

  const handleSignUp = async () => {
    if (!isFormValid) {
      alert('Please fill in all fields correctly.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(firebaseAuth, email, password).then(
        (userCred)=> {
          console.log(userCred.user)
          const data = {
            _id: userCred?.user.uid,
            fullName: name,
            profilePic: avatar,
            providerData: userCred.user.providerData[0],
          };
          setDoc(doc(firestoreDB, 'users', userCred?.user.uid), data).then(() => {
            navigation.navigate('Login');
          }
            
          )
        }
      );
     alert('User registered successfully!');
      
    } catch (error) {
      
      alert('Registration error: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Landing')} style={styles.backButton}>
        <Image source={require('../assets/Back.png')} style={styles.backButton} />
      </TouchableOpacity>

      <Text style={styles.title}>Log in to Chatbox</Text>
      <Text style={styles.subtitle}>
        Welcome back! Sign in using your {'\n'} social account or email to continue us
      </Text>
      
      <Text style={styles.label}>Your email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />
      <Text style={styles.label}>Your name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
        autoCapitalize="words"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={[styles.input, { borderBottomColor: passwordsMatch ? '#CDD1D0' : 'red' }]}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm Password"
        secureTextEntry
      />
      {!passwordsMatch && <Text style={styles.errorText}>Passwords do not match</Text>}
      <TouchableOpacity 
        style={[styles.signUpButton, { backgroundColor: isFormValid ? '#24786D' : '#A9A9A9' }]}
        onPress={handleSignUp}
        disabled={!isFormValid}
      >
        <Text style={styles.signUpButtonText}>Sign up</Text>
      </TouchableOpacity>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    position: 'absolute',
    top: height * 0.16,
  },
  subtitle: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: width * 0.035,
    lineHeight: width * 0.05,
    textAlign: 'center',
    position: 'absolute',
    top: height * 0.22,
    color: '#797C7B'
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: width * 0.04,
    fontWeight: '500',
    marginBottom: 5,
    color: '#24786D',
    top: height * 0.11,
  },
  input: {
    width: '100%',
    height: height * 0.07,
    borderBottomWidth: 1,
    borderBottomColor: '#CDD1D0',
    marginBottom: 20,
    fontSize: width * 0.04,
    top: height * 0.10,
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  forgotPasswordButton: {
    top: height * 0.17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#24786D',
    fontSize: width * 0.04,
    fontWeight: '500',
  },
  backButton: {
    position: 'absolute',
    top: height * 0.04,
    left: width * 0.03,
    width: width * 0.06,
    height: width * 0.06,
    zIndex: 1,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  icon: {
    width: width * 0.14,
    height: width * 0.14,
    marginHorizontal: width * 0.04,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.04,
    width: '80%',
  },
  line: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#CDD1D0',
  },
  orText: {
    fontFamily: 'Poppins',
    fontSize: width * 0.04,
    fontWeight: '500',
    color: '#797C7B',
    marginHorizontal: width * 0.05,
  },
  signUpButton: {
    width: '100%',
    height: height * 0.07,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    top: height * 0.17,
  },
  signUpButtonText: {
    fontFamily: 'Poppins',
    fontSize: width * 0.05,
    fontWeight: '700',
    color: '#fff',
  },
});

export default Register;
