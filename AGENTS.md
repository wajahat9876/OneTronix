# OneTronix — Agent Guide

OneTronix is a React Native (Expo) business banking/fintech mobile app. Use this file as the primary context when working in this repo.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Expo SDK 53, React Native 0.79, React 19 |
| Routing | Expo Router (file-based, typed routes) |
| State | Redux Toolkit + RTK Query + redux-persist |
| Storage | react-native-mmkv (via `store/mmkv/mmkvStorage.ts`) |
| Styling | NativeWind (Tailwind) + responsive helpers (`hs`, `vs`, `ms`) |
| Forms | Formik + Yup |
| UI libs | React Native Paper, Gorhom Bottom Sheet/Portal, FlashList |
| Build | EAS Build (`eas.json`) |
| Package manager | Yarn |

## Project Structure

```
app/                    # Expo Router screens & layouts (thin route files)
  (auth)/               # Welcome, Signin, Signup, Forgot password
  (main)/Business/      # Authenticated business flows (Home, Transaction, Settings, Info)
  context/              # App-level context (e.g. UserInactivity)
  _layout.tsx           # Root providers (Redux, Paper, Portal, Toast, Keyboard)

src/
  components/
    globals/            # Reusable UI (Button, Input, FormikInput, Screen, Toast, etc.)
    commons/            # Domain-specific shared UI (business charts, settings rows)
    steps/              # Multi-step flow screens (Auth, Business, QR, KYC)
    libraries/          # Wrapped RN primitives (Text, TouchableOpacity, SafeAreaView)
  hooks/                # Custom hooks (useMultiStepForm, useReduxHooks, useToasty)
  constants/            # Config, Colors, Layout, HeaderKeys, Business constants
  styles/               # Global style helpers

store/
  api/                  # RTK Query APIs (business/, kyc/)
  slices/               # Redux slices (business, config, signInType)
  selectors/            # Memoized selectors
  types/                # API request/response TypeScript types
  utils/                # hashUtils, errorHandler
  mmkv/                 # Persist storage adapter

utils/                  # Cross-cutting helpers (design, toast, animation, debug)
assets/                 # Fonts (Ranade, Excon), icons, images
layouts/                # Shared navigation layouts (tabs, stack, material-top-tabs)
modules/expo-encryption/ # Custom Expo native module
```

## Architecture Rules

### Route vs. UI separation

- **`app/` files are route shells.** Keep them thin: wire hooks, multi-step form orchestration, and layout wrappers.
- **Put screen UI and business logic in `src/components/steps/`** or `src/components/commons/`.
- Example: `app/(auth)/Signin/index.tsx` composes `Step1_BasicDetails` + `Step2_OTP` via `useMultistepForm`.

### Component layers

1. **`@lib/*`** — import wrapped primitives from `@src/components/libraries` (Text, TouchableOpacity, etc.).
2. **`@globals/*`** — app-wide reusable components with co-located `types.ts`.
3. **`@commons/*`** — feature-specific but shared across multiple screens.
4. **`@steps/*`** — full step screens for multi-step flows.

### State management

- Use **`useAppDispatch` / `useAppSelector`** from `@src/hooks/useReduxHooks` — never raw `useDispatch`/`useSelector`.
- **RTK Query** for all API calls. APIs live in `store/api/` grouped by domain (`business/`, `kyc/`).
- Request/response types go in `store/types/` — keep endpoints typed.
- Persisted slices: `business`, `config` (see `store/index.ts`).
- Auth tokens: read from `business` slice (`auth_token`, `tempToken`). Hash-signed requests use `store/slices/business/baseQueryWithHash/`.

### Forms

- Use **Formik + Yup** for validation.
- Prefer **`FormikInput`**, **`FormikDropDown`**, **`FormikPhoneInput`** wrappers over raw inputs.
- Multi-step auth/onboarding flows use **`useMultistepForm`** — pass `next`, `back`, `goTo` via step props.

### Styling

- Use **`className`** (NativeWind) for layout utilities.
- Use **`hs()`, `vs()`, `ms()`** from `@utils/design/design` for responsive spacing, sizing, and radii.
- Default app font: **Ranade-Regular** (set globally in `app/_layout.tsx`). Button/heading font: **Excon-Medium**.
- Colors: import from `@src/constants/Colors`.
- Set `allowFontScaling={false}` on Text when matching designs.

### Imports (path aliases)

Always use path aliases — never deep relative imports across top-level folders:

| Alias | Path |
|-------|------|
| `@/` | project root |
| `@src/*` | `src/*` |
| `@globals/*` | `src/components/globals/*` |
| `@commons/*` | `src/components/commons/*` |
| `@steps/*` | `src/components/steps/*` |
| `@lib/*` | `src/components/libraries/*` |
| `@hooks/*` | `src/hooks/*` |
| `@store/*` | `store/*` |
| `@utils/*` | `utils/*` |
| `@assets/*` | `assets/*` |

Asset imports require extensions: `.svg`, `.png`, `.jpg`, `.gif`.

### Navigation

- File-based routing via Expo Router. Auth gate in `app/index.tsx` redirects based on `auth_token` + `isVerifiedEmail`.
- Auth stack: `(auth)/` — main app: `(main)/Business/`.
- Use `useRouter()` from `expo-router` for programmatic navigation (`router.replace`, `router.push`).

### API & security

- Base URLs in `@src/constants/Config.ts` (`baseURL` v1, `baseURL2` v2).
- Some endpoints require HMAC hash headers via `createHash` (`store/utils/hashUtils.ts`) and `HeaderKeys`.
- Toast feedback: `renderToastSuccess` / `renderToastError` from `@src/hooks/useToasty`.
- Logout handling: `store/utils/errorHandler.ts`.

## Code Style

- **TypeScript strict mode** enabled.
- **Arrow function components** (ESLint enforced).
- **Single quotes**, trailing commas, arrow parens avoid (Prettier).
- **Default exports** for screen/component files; named exports for hooks, types, utilities.
- Co-locate **`types.ts`** next to components that need prop interfaces.
- Minimize scope: match existing patterns in the file you edit; don't refactor unrelated code.

## Commands

```bash
yarn start          # Expo dev server
yarn ios            # Run on iOS
yarn android        # Run on Android
yarn test           # Jest (watch mode)
yarn android-dev    # EAS development build (Android)
yarn ios-dev        # EAS development build (iOS)
yarn android-production / yarn ios-production  # EAS production builds
```

## Do Not

- Commit secrets, API keys, or `.env` files.
- Add new global state libraries — use existing Redux/RTK Query setup.
- Put heavy UI logic directly in `app/` route files.
- Use `StyleSheet.create` for new code when NativeWind `className` or existing `hs/vs/ms` patterns suffice.
- Bypass typed hooks or skip Yup validation on forms.
- Create commits unless explicitly requested.

## Key Files Reference

| File | Purpose |
|------|---------|
| `app/_layout.tsx` | Root providers, font defaults, splash |
| `app/index.tsx` | Auth redirect logic |
| `store/index.ts` | Store config, persist, middleware |
| `store/rootReducer.ts` | Combined reducers |
| `src/constants/Config.ts` | API base URLs, package IDs |
| `src/hooks/useMultiStepForm/` | Multi-step flow hook |
| `eas.json` | EAS build profiles |
| `babel.config.js` / `tsconfig.json` | Path alias config |
