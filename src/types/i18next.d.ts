import 'i18next';

// Import your JSON translations
import type en from '../../public/locales/en.json';

declare module 'i18next' {
  // Extend DefaultResources interface with your namespace structure
  interface DefaultResources {
    translation: typeof en;
  }
}
