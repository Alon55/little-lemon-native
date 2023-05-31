import react, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TextInput, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckBox } from 'react-native';
import logo from '../assets/logo.png'
import * as ImagePicker from 'expo-image-picker';

export default function Profile({ navigation, route }) {
    const [fname, setFname] = useState('')
    const [email, setEmail] = useState('')
    const [userImg, setUserImg] = useState('')
    const [order, setOrder] = useState(true)
    const [password, setPassword] = useState(true)
    const [offers, setOffers] = useState(true)
    const [newsletter, setNewsletter] = useState(true)

    useEffect(() => {
        (async () => {
            try {
                const value = await AsyncStorage.multiGet([['firstName'], ['email'], ['userImg']]);
                setFname(value[0][1])
                setEmail(value[1][1])
                setUserImg(value[2][1])
            } catch (error) {
                console.log(error)
            }
        })()
    }, [])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            try {
                await AsyncStorage.setItem('userImg', result.assets[0].uri)
            } catch (error) {
                console.log(error)
            }
            setUserImg(result.assets[0].uri);
        }
    };

    return (
        <View style={{ height: '100%' }}>
            <header style={styles.header}>
                <Pressable onPress={() => { navigation.pop() }}>
                    <div style={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: 'gray', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 30, marginBottom: 5 }}>{'<'}</Text>
                    </div>
                </Pressable>
                <Image source={logo} style={{ height: 40, width: 200, margin: 20 }} />
                <Pressable onPress={pickImage}>
                    {userImg ? <Image source={{ uri: userImg }} style={{ width: 50, height: 50, borderRadius: '50%' }} /> :
                        <div style={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: 'gray', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 30, marginBottom: 5 }}>+</Text>
                        </div>}
                </Pressable>
            </header>
            <section style={styles.secttion}>
                <Text style={{ ...styles.label, fontSize: 14, fontWeight: 500, marginTop: 20 }}>Profile Information</Text>
                <Text style={styles.label}>First Name</Text>
                <TextInput value={fname} style={styles.input} />
                <Text style={styles.label}>Last Name</Text>
                <TextInput style={styles.input} />
                <Text style={styles.label}>Email</Text>
                <TextInput value={email} style={styles.input} />
                <Text style={styles.label}>Phone Number</Text>
                <TextInput style={styles.input} />
            </section>
            <section style={styles.secttion}>
                <Text style={{ ...styles.label, fontSize: 14, fontWeight: 500, marginTop: 20 }}>Email notifications</Text>
                <CheckBox value={order} onChange={() => setOrder(!order)} style={{ display: 'inline-block' }} />
                <Text style={{ ...styles.label, display: 'inline-block', marginLeft: 8 }}>Order statuses</Text>
                <br />
                <CheckBox value={password} onChange={() => setPassword(!password)} style={{ display: 'inline-block' }} />
                <Text style={{ ...styles.label, display: 'inline-block', marginLeft: 8 }}>Password changes</Text>
                <br />
                <CheckBox value={offers} onChange={() => setOffers(!offers)} style={{ display: 'inline-block' }} />
                <Text style={{ ...styles.label, display: 'inline-block', marginLeft: 8 }}>Special offers</Text>
                <br />
                <CheckBox value={newsletter} onChange={() => setNewsletter(!newsletter)} style={{ display: 'inline-block' }} />
                <Text style={{ ...styles.label, display: 'inline-block', marginLeft: 8 }}>Newsletter</Text>
                {/* </div> */}
            </section>
            <footer style={styles.footer}>
                <Pressable style={styles.logOut} onPress={async () => {
                    try {
                        await AsyncStorage.clear()
                    } catch (error) {
                        console.log(error)
                    }
                    route.params.handleSignedStatusd(false)
                }}>
                    <Text>Log out</Text>
                </Pressable>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Pressable style={styles.discard}>
                        <Text style={{ fontSize: 10 }}>Discard changes</Text>
                    </Pressable>
                    <Pressable style={styles.save}>
                        <Text style={{ color: '#fff', fontSize: 10 }}>Save changes</Text>
                    </Pressable>
                </div>
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
        justifyContent: 'space-between',
        paddingLeft: 30,
        paddingRight: 30
    },
    secttion: {
        paddingRight: 30,
        paddingLeft: 30
    },
    footer: {
        paddingRight: 30,
        paddingLeft: 30
    },
    label: {
        display: 'block',
        marginTop: 10,
        fontSize: 12
    },
    input: {
        width: '100%',
        height: 25,
        border: 'solid 1px black',
        borderRadius: 5,
        display: 'block',
        paddingRight: 15,
        paddingLeft: 15
    },
    button: {
        backgroundColor: 'gray',
        width: '15%',
        height: 40,
        borderRadius: 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logOut: {
        backgroundColor: '#F4CE14',
        width: '100%',
        height: 40,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 10
    },
    discard: {
        backgroundColor: '#FFF',
        width: '45%',
        height: 40,
        border: 'solid 1px #495E57',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    save: {
        backgroundColor: '#495E57',
        width: '45%',
        height: 40,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff'

    }
});
