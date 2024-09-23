// screens/MarketStatusScreen.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { getMarketStatus } from '../services/CoinService';

const MarketStatusScreen = () => {
    const [marketStatus, setMarketStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMarketStatus = async () => {
            const data = await getMarketStatus();
            if (data) {
                setMarketStatus(data);
            } else {
                console.error('No data received');
            }
            setLoading(false);
        };

        fetchMarketStatus();
    }, []);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{marketStatus.MarketStatus || 'N/A'}</Text>
                <Image
                    source={require('../../assets/images/buyHead.png')} // Okuz başı ikonu için geçerli bir dosya yolu
                    style={styles.icon}
                />
            </View>

            <View style={styles.statusContainer}>
                <Text style={styles.label}>Current Status:</Text>
                <Text style={styles.value}>{marketStatus.MarketStatus || 'N/A'}</Text>
            </View>
            <View style={styles.statusContainer}>
                <Text style={styles.label}>Change Time:</Text>
                <Text style={styles.value}>{marketStatus.MarketStatusChangeTime || 'N/A'}</Text>
            </View>
            <View style={styles.statusContainer}>
                <Text style={styles.label}>Previous Status:</Text>
                <Text style={styles.value}>{marketStatus.MarketStatusOld || 'N/A'}</Text>
            </View>
            <View style={styles.statusContainer}>
                <Text style={styles.label}>Code:</Text>
                <Text style={styles.value}>{marketStatus.code || 'N/A'}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
        borderColor: '#00aaff',
        borderWidth: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    icon: {
        width: 100,
        height: 100,
        marginLeft: 50,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00aaff',
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee',
    },
    label: {
        fontWeight: '500',
        color: '#333',
    },
    value: {
        fontWeight: '600',
        color: '#333',
    },
});

export default MarketStatusScreen;
