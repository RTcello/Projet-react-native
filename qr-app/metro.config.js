const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuration pour supporter le tunnel et le développement
config.resolver.assetExts.push('bin', 'txt', 'jpg', 'png', 'json');

module.exports = config;
