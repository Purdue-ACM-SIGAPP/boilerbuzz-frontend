// ClubBanner.tsx
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import type { GestureResponderEvent } from 'react-native';

type ClubBannerProps = {
  onPress?: (e: GestureResponderEvent) => void;
  title?: string;
  subtitle?: string;
};

const ClubBanner: React.FC<ClubBannerProps> = ({ onPress, title = 'Clubs', subtitle = '0 Following' }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <Text style={styles.chev}>{'>'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // approx colors — you can override with your global styles
    borderColor: '#cfcfcf',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 6,
  },
  chev: {
    fontSize: 22,
    color: '#333',
    marginLeft: 12,
  },
});

export default ClubBanner;
