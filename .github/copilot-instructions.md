# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Next.js 14 mobile web banking application with Firebase integration for an electronic wallet (e-wallet) demo. The application includes:

- User authentication (login/registration)
- Wallet balance management
- Top-up functionality
- NFC payment integration (Web NFC API)
- QR code payment system
- Mobile-first responsive design

## Technology Stack
- **Frontend**: Next.js 14 with TypeScript and App Router
- **Styling**: Tailwind CSS
- **Authentication & Database**: Firebase (Auth, Firestore)
- **QR Code**: react-qr-code, html5-qrcode
- **Icons**: Lucide React
- **UI Components**: Headless UI

## Development Guidelines
- Focus on mobile-first responsive design
- Use TypeScript for all components and utilities
- Implement proper error handling and loading states
- Follow Next.js 14 App Router conventions
- Use Firebase security rules for data protection
- Implement proper form validation
- Use Tailwind CSS for consistent styling
- Consider PWA features for mobile experience

## Key Features to Implement
1. **Authentication**: Firebase Auth with email/password
2. **Wallet Management**: Balance display and transaction history
3. **Top-up**: Add money to wallet with simulated payment
4. **NFC Payment**: One-touch payment using Web NFC API (Android Chrome only)
5. **QR Payment**: Generate and scan QR codes for payments
6. **Security**: Proper authentication checks and data validation
