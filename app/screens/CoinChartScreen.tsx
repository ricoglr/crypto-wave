import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';

const CoinChartScreen = () => {
  const [loading, setLoading] = useState(true);
  const [chartHTML, setChartHTML] = useState<string>('');

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
        headers: {
          'X-CMC_PRO_API_KEY': 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c',
        },
      });

      const data = response.data.data;
      
      // Bu örnekte yalnızca ilk birkaç kripto paranın verilerini alıyoruz.
      const formattedData = data.slice(0, 10).map((crypto: any) => ({
        x: new Date(),
        y: [
          Math.random() * 100, // open
          Math.random() * 100, // high
          Math.random() * 100, // low
          Math.random() * 100  // close
        ],
      }));

      const newChartHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Candlestick Chart Example</title>
          <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
          <style>
            body, html {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: #f4f6f9;
              font-family: 'Roboto', sans-serif;
            }
            #chart {
              width: 100%;
              height: 100%;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              border-radius: 12px;
              background-color: #ffffff;
            }
          </style>
        </head>
        <body>
          <div id="chart"></div>
          <script>
            var options = {
              chart: {
                type: 'candlestick',
                height: '100%'
              },
              series: [{
                data: ${JSON.stringify(formattedData)}
              }],
              xaxis: {
                type: 'datetime'
              },
              yaxis: {
                tooltip: {
                  enabled: true
                }
              }
            };

            var chart = new ApexCharts(document.querySelector("#chart"), options);
            chart.render();
          </script>
        </body>
        </html>
      `;

      setChartHTML(newChartHTML);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching chart data", error);
      setLoading(false);
    }
  };

  const reloadChart = () => {
    setLoading(true);
    fetchChartData(); // Reload chart data
  };

  return (
    <View style={styles.container}>

      {/* WebView with Loading Indicator */}
      <View style={styles.webviewContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <WebView
            originWhitelist={['*']}
            source={{ html: chartHTML }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onLoadEnd={() => setLoading(false)}
            onError={(e) => console.error(e.nativeEvent.description)}
            onMessage={(e) => console.log(e.nativeEvent.data)}
            style={styles.webview}
          />
        )}
      </View>

      {/* Refresh Button */}
      <TouchableOpacity style={styles.refreshButton} onPress={reloadChart}>
        <Text style={styles.refreshText}>Refresh Chart</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Data from CoinMarketCap</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E0E0',
  },
  webviewContainer: {
    flex: 1,
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  webview: {
    flex: 1,
    borderRadius: 10,
  },
  refreshButton: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginVertical: 10,
  },
  refreshText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  footerText: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Roboto',
  },
});

export default CoinChartScreen;
