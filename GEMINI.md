# BibleApp Project Guidelines

Welcome to the **BibleApp** repository! This document outlines the project's architecture, technologies, coding standards, and development workflows. All contributors and AI assistants must strictly adhere to these practices to maintain a clean, stable, and highly performant codebase.

---

## 🚀 Technology Stack Overview

- **Frontend Framework**: React Native (v0.86.0) & React (v19.2.3)
- **Language**: TypeScript (v5.8.3)
- **Navigation**: React Navigation (v7) with full type-safety
- **Database**: High-performance SQLite via `react-native-quick-sqlite` (v8.2.7)
- **Testing**: Jest & `react-test-renderer`
- **Linting & Formatting**: ESLint & Prettier

---

## 📂 Project Structure

All application source code resides within the `src/` directory:

```text
src/
├── data/           # Static metadata (e.g., book configurations)
├── database/       # SQLite manager, connections, repositories, and DB files (See src/database/GEMINI.md)
├── models/         # TypeScript domain interfaces/models (e.g., Verse)
├── navigation/     # Navigators, type configurations, and tab setups
├── screens/        # Screen components, organized by feature/tab
├── services/       # External service adapters and APIs
└── types/          # Global application types and enums
```

---

## 🎨 Design & Styling Conventions

### 1. In-Component Styles (Local Pattern)
Unlike typical React Native apps where stylesheets are defined at the bottom of files, this project uses **in-component styles**. Always define the stylesheet **inside** the functional component body:

```tsx
export default function MyScreen() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#00191A',
    },
  });

  return <View style={styles.container} />;
}
```

### 2. Standard Color Palette (Dark Theme Default)
The application has a unified dark, deep-teal color palette. Do not hardcode random values; use the following tokens where appropriate:
- **Primary Background**: `#00191A` (Deep dark teal)
- **Primary Text**: `#F5F5F5` (Off-white)

---

## 📱 Navigation & Routing

Type-safe navigation is configured in `src/navigation/Types.ts`. When adding screens or passing routes, always use the strongly typed navigation hooks and props:

- Screen parameters are registered in `ReadStackParamList` (or corresponding stack parameter lists).
- Retrieve type-safe navigators in screens using:
  ```tsx
  type ScreenProp = NativeStackNavigationProp<ReadStackParamList, 'RouteName'>;
  const navigation = useNavigation<ScreenProp>();
  ```

---

## 🗄️ Database Strategy

We package pre-populated Bible databases inside the application. SQLite queries are processed through high-speed native bindings using `react-native-quick-sqlite`.

- **Database Files**: Pre-built `.db` files (e.g., `AKJV.db`, `ASV.db`, `KJV.db`, `Tamil.db`) must be packaged into platform-specific directories for bundling:
  - **Android**: `android/app/src/main/assets/databases/`
  - **iOS**: `ios/` (must also be added to the Xcode file bundle)
  - **Source/Backup**: `resources/databases/` and `src/asset/db/`
- **Database Scope**: Dedicated SQLite patterns and management are covered in the database subdirectory instructions.
- **Reference**: Refer to [src/database/GEMINI.md](./src/database/GEMINI.md) for database connection architecture, querying practices, and instructions for introducing new Bible versions.

---

## 🧪 Testing Guidelines

- **Command**: Run tests using `npm test` or `npm run test`.
- **Framework**: Jest with `react-test-renderer` is used to write snapshot and behavioral component tests.
- **Test Organization**: Unit and integration tests are located in the `__tests__/` directory. Always write a corresponding test file when introducing new screens, repositories, or services.

---

## 🛠️ Development Workflows

- Run Metro Bundler: `npm run start`
- Run on iOS: `npm run ios`
- Run on Android: `npm run android`
- Lint code: `npm run lint`
