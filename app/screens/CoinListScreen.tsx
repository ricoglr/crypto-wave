import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { getCoinList } from '../services/CoinService';

// Coin veri modeli için TypeScript arayüzü tanımlıyoruz
interface Coin {
    symbol: string;      // Coin'in sembolü (örn. BTC, ETH)
    position: string;    // Coin'in mevcut pozisyonu (BUY, SELL, vb.)
    positionold: string; // Coin'in eski pozisyonu
    changeTime: string;  // Pozisyon değişim zamanı
}

// Ana CoinListScreen bileşeni
const CoinListScreen = () => {
    // Coin verilerini ve yüklenme durumunu tutmak için state'ler tanımlıyoruz
    const [coins, setCoins] = useState<Coin[]>([]);  // API'den alınacak coin'leri tutan state
    const [loading, setLoading] = useState(true);    // Yüklenme durumunu takip eden state


    // Bileşen yüklendiğinde veriyi çekmek için useEffect kullanıyoruz
    useEffect(() => {
        // API'den coin listesini çeken ve state'leri güncelleyen async fonksiyon
        const fetchCoins = async () => {
            try {
                // Coin listesini API'den alıyoruz
                const response = await getCoinList();
                
                // API'den gelen verinin doğru formatta olup olmadığını kontrol ediyoruz
                if (response && Array.isArray(response.advice)) {
                    // Coin listesini alfabetik olarak sıralıyoruz
                    const sortedCoins = sortCoinsBySymbol(response.advice);
                    setCoins(sortedCoins);  // Sıralanmış coin'leri state'e atıyoruz
                } else {
                    console.error('Data format is incorrect:', response);  // Hatalı veri formatı hatası
                }
            } catch (error) {
                console.error('Error fetching data:', error);  // API'den veri alınırken hata olursa yakalanıyor
            } finally {
                setLoading(false);  // Yükleme işlemi tamamlanınca yüklenme durumunu false yapıyoruz
            }
        };
        
        fetchCoins();  // Veriyi almak için fonksiyonu çağırıyoruz
    }, []);  // Bileşen sadece bir kez mount olduğunda çalışacak

    // Eğer veri yükleniyorsa ekranda "Loading..." yazısını gösteriyoruz
    if (loading) {
        return <Text>Loading...</Text>;
    }

    // Yükleme tamamlandıktan sonra coin listesini FlatList ile gösteriyoruz
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" hidden={false} translucent={false} />
            <>
                {/* Tablo başlıklarını gösteren View */}
                <View style={styles.header}>
                    <Text style={styles.headerText}>Symbol</Text>
                    <Text style={styles.headerText}>Position</Text>
                    <Text style={styles.headerText}>Old Position</Text>
                    <Text style={styles.headerText}>Change Time</Text>
                </View>

                {/* Coin listesini FlatList ile dinamik olarak render ediyoruz */}
                <FlatList
                    data={coins}  // Listeyi coin verisiyle dolduruyoruz
                    keyExtractor={(item) => item.symbol}  // Coin sembolünü benzersiz anahtar olarak kullanıyoruz
                    renderItem={({ item }) => (
                        // Her coin'i TouchableOpacity ile sarmalayarak dokunulabilir hale getiriyoruz
                        <TouchableOpacity onPress={() => handleCoinPress(item)}>
                            <View style={styles.row}>
                                <Text style={styles.text}>{item.symbol}</Text>
                                {/* Coin pozisyonuna göre stil uygulanıyor */}
                                <Text style={[styles.text, getPositionStyle(item.position)]}>
                                    {item.position}
                                </Text>
                                <Text style={styles.text}>{item.positionold}</Text>
                                <Text style={styles.text}>{item.changeTime}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </>
        </SafeAreaView>
    );
};

// Yardımcı fonksiyonlar (JsDoc)

/**
 * Coin listesini alfabetik olarak sembollere göre sıralar.
 * @param {Coin[]} coins - Sıralanacak coin listesi
 * @returns {Coin[]} - Alfabetik olarak sıralanmış coin listesi
*/
const sortCoinsBySymbol = (coins: Coin[]): Coin[] => {
    return coins.sort((b: Coin, a: Coin) => b.symbol.localeCompare(a.symbol));
};

/**
 * Coin'in mevcut pozisyonuna (BUY, SELL vb.) göre stil uygular.
 * @param {string} position - Coin'in pozisyonu
 * @returns {Object} - Pozisyona göre stil objesi döner
*/
const getPositionStyle = (position: string) => {
    switch (position) {
        case 'BUY':
            return styles.buy;   // "BUY" pozisyonu yeşil renkte gösteriliyor
        case 'SELL':
            return styles.sell;  // "SELL" pozisyonu kırmızı renkte gösteriliyor
        default:
            return styles.stagnant;  // Diğer pozisyonlar için mavi renk kullanılıyor
    }
};

/**
 * Coin'e tıklandığında yapılacak işlemi tanımlar.
 * @param {Coin} coin - Tıklanan coin objesi
*/
const handleCoinPress = (coin: Coin) => {
    console.log('Coin pressed:', coin);  // Tıklanan coin'in bilgilerini konsola yazdırıyoruz
    // Burada istediğiniz başka bir işlem yapabilirsiniz (örn. detay sayfasına yönlendirme)
};

// Tarzlar (Styles)
const styles = StyleSheet.create({
    // Güvenli alan stilini ayarlıyoruz, ekranın tamamını kaplayacak şekilde
    safeArea: {
        flex: 1,
    },
    // Başlık satırı için stil: arka plan rengi, hizalama ve padding ayarları
    header: {
        flexDirection: 'row',  // Yatayda elemanları hizalıyoruz
        justifyContent: 'space-between',  // Elemanlar arasında boşluk bırakıyoruz
        backgroundColor: '#ddd',  // Başlık arkaplanı
        padding: 10,  // İçerik kenar boşluğu
        borderRadius: 8,  // Köşeleri yuvarlatıyoruz
    },
    // Başlık metni için stil: kalın yazı stili ve ortalanmış metin
    headerText: {
        fontWeight: 'bold',  // Kalın yazı stili
        flex: 1,  // Her başlık eşit genişlikte olsun
        textAlign: 'center',  // Metni ortalıyoruz
    },
    // Satır stili: her bir coin bilgisi için yatay hizalama ve boşluk ayarları
    row: {
        flexDirection: 'row',  // Elemanları yatayda hizalıyoruz
        justifyContent: 'space-between',  // Elemanlar arasında boşluk bırakıyoruz
        padding: 10,  // Satır için padding ayarlıyoruz
        backgroundColor: '#FFF',  // Satır arkaplanı beyaz
        marginVertical: 4,  // Satırlar arası dikey boşluk bırakıyoruz
        borderRadius: 8,  // Köşeleri yuvarlatıyoruz
    },
    // Genel metin stili: her metni ortalıyoruz ve eşit genişlik veriyoruz
    text: {
        flex: 1,  // Metin alanlarının eşit genişlikte olmasını sağlıyoruz
        textAlign: 'center',  // Metni ortalıyoruz
    },
    // "BUY" pozisyonu için stil: yeşil renk ve kalın yazı
    buy: {
        color: '#009900',  // Yeşil renk
        fontSize: 16,  // Yazı boyutu
        fontWeight: '600',  // Orta kalınlıkta yazı
        textAlign: 'center',  // Ortalanmış metin
    },
    // "SELL" pozisyonu için stil: kırmızı renk ve kalın yazı
    sell: {
        color: '#CC0000',  // Kırmızı renk
        fontSize: 16,  // Yazı boyutu
        fontWeight: '600',  // Orta kalınlıkta yazı
        textAlign: 'center',  // Ortalanmış metin
    },
    // Diğer pozisyonlar (örn. STAGNANT) için stil: mavi renk ve kalın yazı
    stagnant: {
        color: '#0000CC',  // Mavi renk
        fontSize: 16,  // Yazı boyutu
        fontWeight: '600',  // Orta kalınlıkta yazı
        textAlign: 'center',  // Ortalanmış metin
    },
});

export default CoinListScreen;
