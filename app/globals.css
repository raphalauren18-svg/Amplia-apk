@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;
  }

  * {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    -webkit-tap-highlight-color: transparent;
  }

  body {
    @apply bg-white text-gray-900 antialiased;
  }

  /* PWA safe-area para notch/barra de navegação */
  body {
    padding-env: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  }
}

@layer utilities {
  .bg-background  { background-color: hsl(var(--background)); }
  .text-foreground { color: hsl(var(--foreground)); }

  /* Esconder scrollbar mas manter funcionalidade */
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
}
