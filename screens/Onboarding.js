import react, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TextInput, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../assets/logo.png'

export default function Onboarding({ handleSignedStatusd }) {
    const [fname, setFname] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState(false)

    return (
        <View style={{ height: '100%', backgroundColor: 'lightgray' }}>
            <header style={styles.header}>
                <Image source={logo} style={{ height: 40, width: 200, margin: 20 }} />
            </header>
            <section style={styles.secttion}>
                <div style={{ textAlign: 'center' }}>
                    <Text style={{ ...styles.label, marginBottom: 40 }}>Let us get to know you</Text>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput onChange={e => setFname(e.target.value)} value={fname} style={{ ...styles.input, borderColor: error && !fname && 'red' }} />
                    <Text style={styles.label}>Email</Text>
                    <TextInput onChange={e => setEmail(e.target.value)} value={email} style={{ ...styles.input, borderColor: error && !email && 'red' }} />
                </div>
            </section>
            <footer style={styles.footer}>
                <Pressable style={styles.button} onPress={async () => {
                    if (fname && email) {
                        try {
                            await AsyncStorage.multiSet([['isOnboardingCompleted', true], ['firstName', fname], ['email', email]])
                        } catch (error) {
                        }
                        handleSignedStatusd(true)
                    } else { setError(true) }
                }}>
                    <Text>Next</Text>
                </Pressable>
            </footer>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 100,
        backgroundColor: 'lightGray',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    secttion: {
        backgroundColor: 'gray',
        height: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        marginTop: 35,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'right',
    },
    label: {
        display: 'block',
        marginTop: 15,
        marginBottom: 10
    },
    input: {
        width: 200,
        height: 45,
        border: 'solid 1px black',
        borderRadius: 15,
        display: 'block',
        paddingLeft: 20,
        paddingRight: 20,
        cursor: 'default'
    },
    button: {
        backgroundColor: 'gray',
        width: 80,
        height: 40,
        borderRadius: 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 40
    }
});
