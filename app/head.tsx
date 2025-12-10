export default function Head() {
  return (
    <>
      {/* Basic Meta */}
      <meta charSet="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />
      <meta name="description" content="Stanect - AI-powered voice companion" />

      {/* PWA Manifest */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#1a3a80" />

      {/* iOS Support */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta name="apple-mobile-web-app-title" content="Stanect" />
      <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512.png" />

      {/* iOS Splash Screens */}
      <link
        rel="apple-touch-startup-image"
        href="/splash/splash-1170x2532.png"
        media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
      />
      <link
        rel="apple-touch-startup-image"
        href="/splash/splash-1284x2778.png"
        media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)"
      />
      {/* Add more as needed */}

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
    </>
  );
}
