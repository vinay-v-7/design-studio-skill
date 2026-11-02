# Mobile AI Tells (React Native, Flutter, SwiftUI, Jetpack Compose)

Read this file when the review target is a native or cross-platform mobile app. Most of the catalog still applies: color (CL), copy (CP), the UX states (UX) and system drift (SY). This file adds tells that are specific to mobile, plus the code signals for each framework.

There is less published research on mobile than on web. These tells come from the same convergence mechanism, and observation supports them, so treat them as strong candidates rather than certainties.

## Mobile-specific tells

### MB1 · Gradient onboarding carousel: P0 · scanner + visual
- **Signal:** Three swipeable intro slides, each with a centered illustration or emoji, a heading and a line of text, over a purple or blue gradient, with dot indicators and Skip/Next buttons.
- **Why it reads AI:** It is the default "app intro" in every generated app. Users skip it, and it delays the actual product.
- **Break it:** Drop the carousel and put the user into the product with a useful default state. Teach in context, with inline hints on first use. If an intro is really needed, make it one screen that shows the real UI.

### MB2 · Every list row as a floating shadowed card: P1 · scanner + visual
- **Signal:** `FlatList` / `ListView` / `List` rows wrapped in cards with margin, radius 12–20, and elevation or shadow on each one.
- **Why it reads AI:** It is the web-card reflex moved to mobile. It wastes vertical space and fights platform conventions.
- **Break it:** Use platform list patterns: full-width rows with separators or inset grouped lists, and reserve cards for rich, independently actionable items.

### MB3 · Emoji in tab bars, headers or buttons: P0 · scanner
- **Signal:** Emoji inside `<Text>` used as tab icons, section headings ("🔥 Trending"), or button glyphs.
- **Why it reads AI:** It is the same as IC1. On mobile it is even more visible, and it renders differently on iOS and Android.
- **Break it:** Use platform icon sets (SF Symbols, Material Symbols, or one consistent vector set) and label tabs with text.

### MB4 · Purple `LinearGradient` header or background: P0 · scanner
- **Signal:** `expo-linear-gradient` / `react-native-linear-gradient` with purple or indigo stops; Flutter `LinearGradient(colors: [Colors.deepPurple, …])`; SwiftUI `LinearGradient(colors: [.purple, .blue])`; Compose `Brush.linearGradient(listOf(Color(0xFF6200EE)…))`.
- **Why it reads AI:** It is CL1 in native form.
- **Break it:** Use a solid, brand-derived surface. Let content and real imagery carry the color.

### MB5 · The same large radius on everything: P1 · scanner
- **Signal:** `borderRadius: 16`/`20`/`24` in most StyleSheet entries; `BorderRadius.circular(16)` everywhere; `.cornerRadius(16)` on buttons, cards and images alike.
- **Why it reads AI:** It is LY4 and CM2 on mobile.
- **Break it:** Set radius by role, and match platform shape conventions: iOS continuous corners, Material shape scale.

### MB6 · Glass material everywhere (iOS): P1 · scanner
- **Signal:** `.ultraThinMaterial` / `.regularMaterial` / `BlurView` on cards and sheets with no content behind them.
- **Why it reads AI:** It is CM3 on mobile.
- **Break it:** Use materials only where content really scrolls underneath, such as navigation bars and sheets over content, as the platform intends.

### MB7 · Web-style hero on a mobile screen: P1 · visual
- **Signal:** The home screen opens with a big centered greeting ("Welcome back, Alex! 👋"), a gradient banner and a CTA. The user's actual content sits below the fold.
- **Why it reads AI:** These are landing-page instincts in an app people open many times a day.
- **Break it:** Put the user's content or primary task first. Keep the greeting to one small line, or drop it.

### MB8 · FAB plus tab bar plus header actions all at once: P2 · visual
- **Signal:** A floating action button over a five-tab bar, with three header icons, and no clear primary action.
- **Why it reads AI:** Every pattern was added at once.
- **Break it:** Choose one primary action pattern per screen. Keep the tab bar to 3–5 destinations.

### MB9 · Platform conventions ignored: P1 · visual / judgment
- **Signal:** Android back behavior is broken, iOS swipe-back is disabled, there are no safe-area insets, touch targets are under 44pt / 48dp, Dynamic Type or font scaling is ignored, and only one theme exists.
- **Why it reads AI:** Generated cross-platform code ignores both platforms equally.
- **Break it:** Respect safe areas (`SafeAreaView` / `SafeArea` / `.safeAreaInset`), the platform's back navigation, minimum touch targets, text scaling, and both light and dark themes.

### MB10 · Missing native states: P1 · scanner + judgment
- **Signal:** No pull-to-refresh on feeds, no offline state, no keyboard avoidance on forms, no skeleton loading, empty lists that render a blank screen.
- **Why it reads AI:** It is UX1 on mobile, and worse, because users hit these states constantly.
- **Break it:** Design offline, empty, loading and keyboard-open states for every main screen.

## Code signals by framework

| Tell | React Native | Flutter | SwiftUI | Compose |
|---|---|---|---|---|
| Purple gradient | `LinearGradient colors={['#7c3aed', …]}` | `LinearGradient(colors: [Colors.purple / deepPurple / indigo …])` | `LinearGradient(… .purple …)` | `Brush.linearGradient` with `0xFF6200EE`/`0xFF7C3AED`-like values |
| Default font | `fontFamily: 'Inter'` / none set | `GoogleFonts.inter(` / `GoogleFonts.poppins(` | `.font(.system(…))` only | `FontFamily.Default` only |
| Uniform radius | `borderRadius: 16+` in most styles | `BorderRadius.circular(16+)` | `.cornerRadius(16+)` / `RoundedRectangle(cornerRadius: 16+)` | `RoundedCornerShape(16.dp+)` |
| Shadow on every card | `elevation:` + `shadowOpacity` per style | `BoxShadow(` in most decorations | `.shadow(radius:` everywhere | `elevation = 8.dp+` / `.shadow(` |
| Glass | `BlurView` | `BackdropFilter(ImageFilter.blur` | `.ultraThinMaterial` | `Modifier.blur(` |
| Emoji UI | emoji inside `<Text>` | emoji inside `Text('…')` | emoji inside `Text("…")` | emoji inside `Text("…")` |

## Mobile direction moves

- Start from platform conventions (Human Interface Guidelines, Material 3), then add brand on top. Distinctiveness on mobile comes from color, type, iconography, motion and content, not from fighting native patterns.
- Use one signature interaction instead of animating everything: a satisfying completion moment or a meaningful transition between list and detail.
- Use real content density. Mobile users scan, so show more real items and less decoration.
