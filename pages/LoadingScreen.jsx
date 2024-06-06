import { View, Text, Image, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import React, { useLayoutEffect } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { firebaseAuth, firestoreDB } from '../components/firebase.config';
import { getDoc, doc } from 'firebase/firestore';
import { useDispatch } from "react-redux";
import { SET_USER } from '../store/actions/userActions';

const { width, height } = Dimensions.get('window');

const LoadingScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    checkLoggedUser();
  }, []);

  const checkLoggedUser = async () => {
    firebaseAuth.onAuthStateChanged(async (userCred) => {
      if (userCred?.uid) {
        const userDocRef = doc(firestoreDB, "users", userCred.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          console.log("User Data:", docSnap.data());
          dispatch(SET_USER(docSnap.data()));
        } 

        setTimeout(() => {
          navigation.replace("Home");
        }, 2000);
      } else {
    
           
            setTimeout(() => {
                navigation.replace("Landing");
              }, 2000);
       
      }
    });
  };

  return (
    <LinearGradient
      colors={['#24786D', '#000000']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Image
          source={require('../assets/Logo-uihut.png')}
          style={styles.image}
        />
        <ActivityIndicator size="large" color="white" />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.5, 
    height: width * 0.12, 
    marginBottom: height * 0.1, 
  },
});

export default LoadingScreen;
