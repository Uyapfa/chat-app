import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Dimensions, Platform, ScrollView, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth, firestoreDB } from '../components/firebase.config';
import { doc, setDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { SET_USER_NULL } from '../store/actions/userActions';

const { width, height } = Dimensions.get('window');

const Register = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState("https://www.screenfeed.fr/wp-content/uploads/2013/10/default-avatar.png");
  const [isFormValid, setIsFormValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);

    try {
      const userCred = await createUserWithEmailAndPassword(firebaseAuth, email, password);

      const data = {
        _id: userCred?.user.uid,
        fullName: name,
        profilePic: avatar,
        user: null,
        providerData: userCred.user.providerData[0],
      };
      await setDoc(doc(firestoreDB, 'users', userCred?.user.uid), data);

  

      alert('User registered successfully!');
      navigation.navigate('Login')
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
    } catch (error) {
      alert('Registration error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Landing')} style={styles.backButton}>
          <Image source={require('../assets/Back.png')} style={styles.backButton} />
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>Log in to Chatbox</Text>
          <Text style={styles.subtitle}>
            Welcome back! Sign in using your {'\n'} social account or email to continue us
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Name"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={[styles.input, { borderBottomColor: passwordsMatch ? '#CDD1D0' : 'red' }]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm Password"
              secureTextEntry
            />
          </View>

          {!passwordsMatch && <Text style={styles.errorText}>Passwords do not match</Text>}
          <TouchableOpacity
            style={[styles.signUpButton, { backgroundColor: isFormValid ? '#24786D' : '#A9A9A9' }]}
            onPress={handleSignUp}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signUpButtonText}>Create an account</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText} onPress={() => navigation.navigate('Login')}>Existing account? Log in</Text>
          </TouchableOpacity>
        </View>
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
  },
  
  title: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginTop: height * 0.06,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: width * 0.035,
    lineHeight: width * 0.05,
    textAlign: 'center',
    marginTop: height * 0.04,
    color: '#797C7B',
    marginBottom: 60
  },
  label: {
    fontSize: width * 0.04,
    fontWeight: '500',
    marginBottom: 5,
    color: '#24786D',
  },
  inputContainer: {
    width: width - 40,
    marginBottom: height * 0.03,
  },
  input: {
    width: '100%',
    height: height * 0.05,
    borderBottomWidth: 1,
    borderBottomColor: '#CDD1D0',
    fontSize: width * 0.04,
    marginTop: 4,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  signUpButton: {
    width: width - 40,
    height: height * 0.07,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: height * 0.02,
    marginBottom: 10
  },
  signUpButtonText: {
    fontSize: width * 0.04,
    fontWeight: '700',
    color: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: height * 0.03,
    left: width * 0.03,
    width: width * 0.06,
    height: width * 0.06,
    zIndex: 1,
  },

  forgotPasswordText: {
    color: '#24786D',
    fontSize: width * 0.04,
    fontWeight: '500',
    alignSelf: 'center',
    marginTop: 20
  },
});

export default Register;
