/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--ion-color-primary)',
        secondary: 'var(--ion-color-secondary)',
        tertiary: 'var(--ion-color-tertiary)',
        success: 'var(--ion-color-success)',
        warning: 'var(--ion-color-warning)',
        danger: 'var(--ion-color-danger)',
        dark: 'var(--ion-color-dark)',
        medium: 'var(--ion-color-medium)',
        light: 'var(--ion-color-light)',
        footPrimary: 'var(--ion-color-footPrimary)',
        footSecondary: 'var(--ion-color-footSecondary)',
        white: 'var(--ion-color-white)',
        light2: 'var(--ion-color-light2)',
        cream: 'var(--ion-color-cream)', /* Cream (custom) */
        dark2: 'var(--ion-color-dark2)',
        gray: 'var(--ion-color-gray)',
        yellow: 'var(--ion-color-yellow)',

        /* Colores personalizados */
        'text-primary-custom': 'var(--ion-color-text-primary-custom)', /* Texto primario */
        'text-secondary-custom': 'var(--ion-color-text-secondary-custom)', /* Texto secundario */
        'button-primary-custom': 'var(--ion-color-button-primary-custom)', /* Botón primario */
        'button-secondary-custom': 'var(--ion-color-button-secondary-custom)', /* Botón secundario */
        'border-custom': 'var(--ion-color-border-custom)', /* Bordes */
        'alert-custom': 'var(--ion-color-alert-custom)', /* Alerta */
        'link-custom': 'var(--ion-color-link-custom)', /* Enlaces */
        'light-custom': 'var(--ion-color-light-custom)', /* Fondo claro */
      },
    },
  },
  plugins: [],
};
