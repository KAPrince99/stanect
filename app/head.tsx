export default function Head() {
  return (
    <>
      {/* Basic Meta */}
      <meta charSet="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />
      <meta
        name="description"
        content="Stanect - AI-powered voice companion to improve communication skills"
      />

      {/* PWA Manifest */}
      <link rel="manifest" href="/manifest.json" />

      {/* Theme Colors */}
      <meta name="theme-color" content="#1a3a80" />
      <meta name="msapplication-TileColor" content="#1a3a80" />

      {/* iOS Specific */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta name="apple-mobile-web-app-title" content="Stanect" />
      <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512.png" />

      {/* iOS Splash Screens (example for iPhone 12 / 13 / 14) */}
      <link
        rel="apple-touch-startup-image"
        href="/splash/1170x2532.png"
        media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
      />
      <link
        rel="apple-touch-startup-image"
        href="/splash/1284x2778.png"
        media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)"
      />
      {/* Add more splash images for other iPhones as needed */}

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
    </>
  );
}
