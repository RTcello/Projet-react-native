const { Constants } = require('expo-constants');

// Ce script sera utilisé pour mettre à jour les URLs automatiquement
// lors du démarrage avec tunnel

const getExpoTunnelUrl = () => {
  // Expo fournit l'URL du tunnel via Constants.expoConfig?.extra?.expoUrl
  // ou via les variables d'environnement
  const expoUrl = Constants.expoConfig?.extra?.expoUrl || 
                  process.env.EXPO_PUBLIC_TUNNEL_URL ||
                  'https://your-tunnel-url.expo.dev';
  
  return expoUrl;
};

module.exports = { getExpoTunnelUrl };
