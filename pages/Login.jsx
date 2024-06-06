import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Dimensions, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { firebaseAuth, firestoreDB } from '../components/firebase.config';
import { getDoc, doc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { SET_USER } from '../store/actions/userActions';

const { width, height } = Dimensions.get('window');

const LoginPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);  // Add loading state
  const dispatch = useDispatch();

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
    setLoading(true);  
    try {
      const userCred = await signInWithEmailAndPassword(firebaseAuth, email, password);
      console.log("User Credential:", userCred); 
      if (userCred) {
        const userDocRef = doc(firestoreDB, "users", userCred.user.uid);
        const docSnap = await getDoc(userDocRef);
      
        if (docSnap.exists()) {
          console.log("User Data:", docSnap.data());
          await dispatch(SET_USER(docSnap.data())); 
          navigation.replace("Home");
        } else {
          console.log("User not registered fully!");
        }
      }
      
      
    } catch (err) {
      console.log("Error:", err.message);
      if (err.message.includes("invalid-credential")) {
        alert("Invalid credential");
      }
    } finally {
      setLoading(false);  // Set loading to false after login attempt
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Landing')} style={styles.backButton}>
          <Image source={require('../assets/Back.png')} style={styles.backButtonImage} />
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
        <Text style={styles.label}></Text>
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
          disabled={!isFormValid || loading}  // Disable button when loading
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />  // Show loading indicator when loading
          ) : (
            <Text style={styles.loginButtonText}>Log in</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => navigation.navigate('Login')} >
          <Text style={styles.forgotPasswordText}>Create an account</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05,
    paddingBottom: height * -1.7,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    marginTop: height * 0.15,
  },
  subtitle: {
    fontWeight: '700',
    fontSize: width * 0.035,
    lineHeight: width * 0.05,
    textAlign: 'center',
    color: '#797C7B',
    marginBottom: height * 0.07,
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
    height: height * 0.06,
    borderBottomWidth: 1,
    borderBottomColor: '#CDD1D0',
    marginBottom: 20,
    fontSize: width * 0.04,
  },
  forgotPasswordButton: {
    position: 'absolute',
    bottom: height * 0.05,
    width: '100%',
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
    top: height * 0.06,
    left: width * 0.03,
    zIndex: 1,
  },
  backButtonImage: {
    width: width * 0.06,
    height: width * 0.06,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: height * 0.05,
  },
  icon: {
    width: width * 0.14,
    height: width * 0.14,
    marginRight: width * 0.05,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.05,
  },
  line: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#CDD1D0',
  },
  orText: {
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
    backgroundColor: '#24786D',
    marginBottom: height * 0.1,
    marginTop: height * 0.04,
  },
  loginButtonText: {
    fontSize: width * 0.05,
    fontWeight: '700',
    color: '#fff',
  },
});

export default LoginPage;
