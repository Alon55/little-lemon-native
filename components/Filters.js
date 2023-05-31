import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Filters = ({ onChange, selections, sections }) => {
    return (
        <View style={styles.filtersContainer}>
            {sections.map((section, index) => (
                <TouchableOpacity
                    key={section}
                    onPress={() => {
                        onChange(index);
                    }}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 16,
                        borderRadius: 25,
                        backgroundColor: selections[index] ? '#EE9972' : 'lightgray',
                        borderWidth: 1,
                        border: 'none',
                    }}>
                    <View>
                        <Text style={{ color: '#495E57', fontSize: 'medium', fontWeight: 'bold' }}>
                            {section}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    filtersContainer: {
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 16,
        paddingRight: 30,
        paddingLeft: 30
    },
});

export default Filters;
