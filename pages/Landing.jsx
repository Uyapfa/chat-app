import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const LandingPage = () => {
    const navigation = useNavigation();
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
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        Connect {'\n'}friends
                    </Text>
                    <Text style={[styles.text, styles.span]}>
                        easily & {'\n'}quickly
                    </Text>
                    <Text style={styles.bodyText}>
                        Our chat app is the perfect way to stay connected with friends and family.
                    </Text>
                </View>
                <View style={styles.iconContainer}>
                    <Image
                        source={require('../assets/icon1.png')}
                        style={styles.icon}
                    />
                    <Image
                        source={require('../assets/icon2.png')}
                        style={styles.icon}
                    />
                    <Image
                        source={require('../assets/icon3.png')}
                        style={styles.icon}
                    />
                </View>
                <View style={styles.orContainer}>
                    <View style={styles.line} />
                    <Text style={styles.orText}>OR</Text>
                    <View style={styles.line} />
                </View>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.buttonText}>Sign up</Text>
                </TouchableOpacity>
                <Text style={styles.loginText}>
                    <Text style={styles.loginSpan} onPress={() => navigation.navigate('Login')}>Existing account? Log in</Text>
                </Text>
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
        paddingHorizontal: '5%',
        
    },
    image: {
        width: '22%',
        height: 19.2,
       // aspectRatio: 6 / 0.5,
        marginBottom: '6%',
        marginTop: '11%',
    },
    textContainer: {
        width: '90%',
        marginTop: '3%',
        alignItems: 'flex-start',
    },
    text: {
        fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'Roboto',
        fontSize: width * 0.12,
        fontWeight: '400',
        color: '#FFFFFF',
    },
    span: {
        fontWeight: '700',
    },
    bodyText: {
        fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'Roboto',
        fontSize: width * 0.05,
        fontWeight: '500',
        color: '#FFFFFF',
        paddingTop: '5%',
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '70%',
        marginTop: '10%',
    },
    icon: {
        width: width * 0.15,
        height: width * 0.15,
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: '5%',
        width: '80%',
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: 'gray',
    },
    orText: {
        fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'Roboto',
        fontSize: width * 0.05,
        fontWeight: '500',
        color: '#D6E4E0',
        marginHorizontal: '3%',
    },
    button: {
        width: '90%',
        height: 50,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 24,
        marginVertical: '5%',
    },
    buttonText: {
        fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'Roboto',
        fontSize: width * 0.05,
        fontWeight: '600',
        color: '#24786D',
    },
    loginText: {
        marginTop: '5%',
        fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'Roboto',
        fontSize: width * 0.04,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    loginSpan: {
        fontWeight: '600',
    },
});

export default LandingPage;
