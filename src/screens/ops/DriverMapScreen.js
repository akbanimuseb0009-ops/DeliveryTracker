import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useAppStore } from '../../store/useAppStore';
import { getStatusColor } from '../../utils/helpers';
import { COLORS, CARD_STYLE } from '../../constants/theme';

const DriverMapScreen = ({ route }) => {
  const { orderId } = route.params;
  const orders = useAppStore((s) => s.orders);
  const order = orders.find((o) => o.id === orderId);
  const webViewRef = useRef(null);

  // Reload WebView or Inject JS when driver coordinates change
  useEffect(() => {
    if (webViewRef.current && order?.driverLocation) {
      const { latitude, longitude } = order.driverLocation;
      const script = `
        if (typeof marker !== 'undefined') {
          marker.setLatLng([${latitude}, ${longitude}]);
          map.panTo([${latitude}, ${longitude}]);
        }
      `;
      webViewRef.current.injectJavaScript(script);
    }
  }, [order?.driverLocation?.latitude, order?.driverLocation?.longitude]);

  if (!order || !order.driverLocation) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.noLocationEmoji}>🚫</Text>
          <Text style={styles.noLocationText}>Driver location not available</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { latitude, longitude, updatedAt } = order.driverLocation;

  const mapHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
      * { margin: 0; padding: 0; }
      #map { height: 100vh; width: 100vw; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      var map = L.map('map').setView([${latitude}, ${longitude}], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map);
      var truckIcon = L.divIcon({
        html: '<div style="font-size: 30px;">🚚</div>',
        className: '',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      var marker = L.marker([${latitude}, ${longitude}], { icon: truckIcon })
        .addTo(map)
        .bindPopup('Driver is here')
        .openPopup();
    </script>
  </body>
  </html>
  `;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          source={{ html: mapHtml }}
          style={styles.map}
          originWhitelist={['*']}
        />
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Latitude</Text>
            <Text style={styles.infoValue}>{latitude.toFixed(6)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Longitude</Text>
            <Text style={styles.infoValue}>{longitude.toFixed(6)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Updated</Text>
            <Text style={styles.infoValue}>{new Date(updatedAt).toLocaleTimeString()}</Text>
          </View>
        </View>
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Order: {order.id}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
              <Text style={styles.statusText}>{order.status}</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noLocationEmoji: { fontSize: 48, marginBottom: 12 },
  noLocationText: { fontSize: 16, color: COLORS.textSecondary },
  map: { height: 350, borderRadius: 12, overflow: 'hidden', marginBottom: 16 },
  infoCard: { ...CARD_STYLE },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  infoLabel: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
  infoValue: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '600' },
  statusCard: { ...CARD_STYLE },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusLabel: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
});

export default DriverMapScreen;
