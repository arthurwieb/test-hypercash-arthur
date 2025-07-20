"use client";

import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css'; // Import Mantine styles here

// You might need these if you plan to use date pickers, notifications, etc.

import '@mantine/dates/styles.css';

const theme = createTheme({
  // Your Mantine theme override here
  // For dark mode, you might want to set default color scheme or use a hook
  // For example: primaryColor: 'blue', primaryShade: 7, colors: { dark: ['#d5d7e0', '#acaebf', '#8c8ea3', '#666980', '#4d4f62', '#34354a', '#2b2c3d', '#1d1e30', '#0c0d21', '#01010a'] }
});

export function MantineProviders({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      {children}
    </MantineProvider>
  );
}
