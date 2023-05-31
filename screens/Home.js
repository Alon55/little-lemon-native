import { useEffect, useState, useCallback, useMemo } from 'react';
import {
    Text,
    View,
    StyleSheet,
    SectionList,
    SafeAreaView,
    StatusBar,
    Alert,
    Pressable,
    Image,
    Button
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import debounce from 'lodash.debounce';
import {
    createTable,
    getMenuItems,
    saveMenuItems,
    filterByQueryAndCategories,
} from '../database';
import Filters from '../components/Filters';
import { getSectionListData, useUpdateEffect } from '../utils';
import logo from '../assets/logo.png';
import hero from '../assets/hero_image.png';
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_URL =
    'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
const sections = ['Starters', 'Mains', 'Desserts'];

const Item = ({ item: { name, price, description, image } }) => (
    <>
        <hr style={{ width: '100%' }} />
        <View style={styles.item}>
            <div style={{ display: 'grid' }}>
                <Text style={styles.title}>{name}</Text>
                <Text style={{ color: 'gray', fontSize: 'small', marginTop: 10, marginBottom: 12, paddingRight: 20 }}>{description}</Text>
                <Text style={{ color: 'gray' }}>${price}</Text>

            </div>
            <Image source={{ uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${image}?raw=true` }} style={{ height: 100, width: 100 }} />

        </View>
    </>

);

export default function Home({ navigation }) {
    const [data, setData] = useState([]);
    const [userImg, setUserImg] = useState(null)
    const [fname, setFname] = useState('')
    const [searchBarText, setSearchBarText] = useState('');
    const [query, setQuery] = useState('');
    const [filterSelections, setFilterSelections] = useState(
        sections.map(() => false)
    );

    useEffect(() => {
        (async () => {
            try {
                const value = await AsyncStorage.multiGet([['firstName'], ['userImg']]);
                setFname(value[0][1])
                setUserImg(value[1][1])

                await createTable();
                let menuItems = await getMenuItems();

                if (!menuItems.length) {
                    const response = await fetch(API_URL);
                    const json = await response.json();
                    menuItems = json.menu.map((item) => ({
                        ...item
                    }));

                    saveMenuItems(menuItems);
                }

                const sectionListData = getSectionListData(menuItems);
                setData(sectionListData);
            } catch (e) {
                Alert.alert(e.message);
            }
        })();
    }, []);

    useUpdateEffect(() => {
        (async () => {
            const activeCategories = sections.filter((s, i) => {
                if (filterSelections.every((item) => item === false)) {
                    return true;
                }
                return filterSelections[i];
            });
            try {
                const menuItems = await filterByQueryAndCategories(
                    query,
                    activeCategories
                );
                console.log(menuItems)
                const sectionListData = getSectionListData(menuItems);
                setData(sectionListData);
            } catch (e) {
                Alert.alert(e.message);
            }
        })();
    }, [filterSelections, query]);

    const lookup = useCallback((q) => {
        setQuery(q);
    }, []);

    const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

    const handleSearchChange = (text) => {
        setSearchBarText(text);
        debouncedLookup(text);
    };

    const handleFiltersChange = async (index) => {
        const arrayCopy = [...filterSelections];
        arrayCopy[index] = !filterSelections[index];
        setFilterSelections(arrayCopy);
    };

    return (
        <SafeAreaView style={styles.container}>
            <header style={styles.header}>
                <div />
                <Image source={logo} style={{ height: 40, width: 200, margin: 20 }} />
                <Pressable onPress={() => { navigation.navigate('Profile') }}>
                    {userImg ? <Image source={{ uri: userImg }} style={{ width: 50, height: 50, borderRadius: '50%' }} /> :
                        <div style={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: 'gray', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 18, marginBottom: 5 }}>{fname.slice(0, 2)}</Text>
                        </div>}
                </Pressable>
            </header>
            <section style={{ backgroundColor: '#495E57', padding: '0px 30px' }}>
                <Text style={styles.mainTitle}>Little Lemon</Text>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '65%' }}>
                        <Text style={styles.subMainTitle}>Chicago</Text>
                        <br />
                        <Text style={{ color: '#FFF' }}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text>
                    </div>
                    <Image source={hero} style={{ height: 100, width: 100, borderRadius: 25 }} />
                </div>
                <Searchbar
                    placeholder="Search"
                    placeholderTextColor="white"
                    onChangeText={handleSearchChange}
                    value={searchBarText}
                    style={styles.searchBar}
                    iconColor="white"
                    inputStyle={{ color: 'white' }}
                    elevation={0}
                />
            </section>
            <Filters
                selections={filterSelections}
                onChange={handleFiltersChange}
                sections={sections}
            />
            <SectionList
                style={styles.sectionList}
                sections={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Item key={item.name} item={item} />
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <Text key={title} style={styles.sectionHeader}>{title}</Text>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: '#FFF',
    },
    header: {
        height: 100,
        backgroundColor: 'lightGray',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 30,
        paddingLeft: 30
    },
    sectionList: {
        paddingHorizontal: 16,
        paddingRight: 30,
        paddingLeft: 30
    },
    searchBar: {
        marginBottom: 24,
        backgroundColor: '#495E57',
        shadowRadius: 0,
        shadowOpacity: 0,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16
    },
    sectionHeader: {
        fontSize: 24,
        paddingVertical: 8,
        color: 'black',
        fontWeight: 'bold'
    },
    mainTitle: {
        color: '#F4CE14',
        fontSize: 36,
        fontFamily: 'cursive'
    },
    subMainTitle: {
        color: '#FFF',
        fontSize: 24,
        fontFamily: 'cursive'
    },
    title: {
        fontSize: 20,
        color: 'black',
        fontWeight: '500'
    },

});
