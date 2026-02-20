
import { Link, Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function NotFoundScreen() {
  const theme = colors.dark;

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.iconContainer, { backgroundColor: theme.highlight }]}>
          <IconSymbol
            ios_icon_name="exclamationmark.triangle.fill"
            android_material_icon_name="warning"
            size={64}
            color={theme.error}
          />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>
          This screen doesn&apos;t exist.
        </Text>
        <Link href="/" style={styles.link}>
          <Text style={[styles.linkText, { color: theme.primary }]}>
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
