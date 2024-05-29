import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { firebaseAuth, firestoreDB } from '../components/firebase.config';
import { getDoc, doc,docS } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

const LoginPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const areFieldsValid = () => {
    return validateEmail(email) && password !== '';
  };

  useEffect(() => {
    setIsFormValid(areFieldsValid());
  }, [email, password]);

  const handleLogin = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(firebaseAuth, email, password);
      if (userCred) {
        console.log("User Id", userCred.user.uid);
        const userDocRef = doc(firestoreDB, "users", userCred.user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          console.log("User Data:", docSnap.data());
        } else {
          console.log("User not registered fully!");

        }
      }
    } catch (err) {
      console.log("Error:", err.message);
      if(err.message.includes("invalid-credential")){
        alert("Invalid credential")
      }
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

      <View style={styles.iconContainer}>
        <Image source={require('../assets/facebook.png')} style={styles.icon} />
        <Image source={require('../assets/google.png')} style={styles.icon} />
        <Image source={require('../assets/apple.png')} style={styles.icon} />
      </View>
      
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>
      <Text style={styles.label}>Your email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />

      <TouchableOpacity 
        style={[styles.loginButton, { backgroundColor: isFormValid ? '#24786D' : '#A9A9A9' }]}
        onPress={handleLogin}
        disabled={!isFormValid}
      >
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.forgotPasswordButton}>
        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
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
  },
  input: {
    width: '100%',
    height: height * 0.03,
    borderBottomWidth: 1,
    borderBottomColor: '#CDD1D0',
    marginBottom: 20,
    fontSize: width * 0.04,
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
  loginButton: {
    width: '100%',
    height: height * 0.07,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    top: height * 0.15,
  },
  loginButtonText: {
    fontFamily: 'Poppins',
    fontSize: width * 0.05,
    fontWeight: '700',
    color: '#fff',
  },
});

export default LoginPage;
