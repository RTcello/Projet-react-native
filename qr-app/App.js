import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function App() {
  const [tunnelUrl, setTunnelUrl] = useState('https://your-tunnel-url.expo.dev:3002');
  const [wifiUrl, setWifiUrl] = useState('http://192.168.184.242:3002');

  const openUrl = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Erreur lors de l\'ouverture de l\'URL:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>🎓 Gestion Enseignants</Text>
        <Text style={styles.subtitle}>Scannez pour accéder à l'application</Text>
        
        {/* QR Code pour WiFi partagé (téléphone hotspot) - PRINCIPAL */}
        <View style={styles.qrContainer}>
          <Text style={styles.urlLabel}>📶 WiFi Partagé (Hotspot téléphone):</Text>
          <Text style={styles.urlText}>{wifiUrl}</Text>
          {wifiUrl && (
            <QRCode
              value={wifiUrl}
              size={200}
              color="#000"
              backgroundColor="#fff"
            />
          )}
          <TouchableOpacity style={styles.smallButton} onPress={() => openUrl(wifiUrl)}>
            <Text style={styles.smallButtonText}>🔗 Ouvrir WiFi</Text>
          </TouchableOpacity>
        </View>

        {/* QR Code pour Tunnel (backup) */}
        <View style={styles.qrContainer}>
          <Text style={styles.urlLabel}>🌐 Tunnel (Partout):</Text>
          <Text style={styles.urlText}>{tunnelUrl}</Text>
          {tunnelUrl && (
            <QRCode
              value={tunnelUrl}
              size={200}
              color="#000"
              backgroundColor="#fff"
            />
          )}
          <TouchableOpacity style={styles.smallButton} onPress={() => openUrl(tunnelUrl)}>
            <Text style={styles.smallButtonText}>🔗 Ouvrir Tunnel</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => openUrl(wifiUrl)}>
          <Text style={styles.buttonText}>📱 Ouvrir application web</Text>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>📋 Instructions:</Text>
          <Text style={styles.infoText}>📶 WiFi Partagé: PC et téléphone sur même WiFi</Text>
          <Text style={styles.infoText}>🌐 Tunnel: Fonctionne partout, même sans WiFi</Text>
          <Text style={styles.infoText}>1. Activez le hotspot de votre téléphone</Text>
          <Text style={styles.infoText}>2. Connectez votre PC au WiFi du téléphone</Text>
          <Text style={styles.infoText}>3. Scannez le QR code "WiFi Partagé"</Text>
          <Text style={styles.infoText}>4. L'application fonctionne sur le même réseau !</Text>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 30,
    textAlign: 'center',
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  urlLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 5,
  },
  urlText: {
    fontSize: 12,
    color: '#3498db',
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  smallButton: {
    backgroundColor: '#27ae60',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: '80%',
  },
  smallButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#ecf0f1',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 5,
    lineHeight: 20,
  },
});
