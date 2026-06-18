# RegistroBot Identity Design Guidelines

Source: Stitch project `13965910987355224643`, "SmartLog: WhatsApp Business Tracker".

## Product Direction

RegistroBot is a mobile-first business tracker for small business owners who manage sales, inventory, payments, and customer activity through WhatsApp. The interface should feel reliable enough for financial decisions and simple enough to use while multitasking.

The visual style is high-utility minimalism with a corporate modern tone. Prioritize data clarity, fast scanning, obvious actions, and calm financial confidence over decorative layouts.

## Screen Flow

- Splash Screen
- Welcome Screen
- Onboarding 1 - WhatsApp Value
- Onboarding 2 - AI Inputs
- Onboarding 3 - App Value
- Sign Up Form
- Login Form
- WhatsApp Linking Intro
- WhatsApp Number Entry
- WhatsApp OTP Verification
- WhatsApp Chatbot Simulation
- Main Dashboard
- Inventory List
- Financial History
- RegistroBot Business Management Flow
- RegistroBot Screen Plan & PRD

## Color Tokens

Use light mode as the default.

```css
:root {
  --color-background: #f8f9fb;
  --color-surface: #f8f9fb;
  --color-surface-lowest: #ffffff;
  --color-surface-low: #f3f4f6;
  --color-surface-container: #edeef0;
  --color-surface-high: #e7e8ea;
  --color-surface-highest: #e1e2e4;
  --color-surface-variant: #e1e2e4;
  --color-surface-dim: #d9dadc;

  --color-primary: #003d9b;
  --color-primary-action: #0052cc;
  --color-primary-soft: #dae2ff;
  --color-primary-soft-dim: #b2c5ff;
  --color-on-primary: #ffffff;

  --color-secondary: #00687b;
  --color-secondary-action: #00b8d9;
  --color-secondary-container: #50dcff;

  --color-tertiary: #004e32;
  --color-success: #36b37e;
  --color-tertiary-container: #006844;

  --color-error: #ba1a1a;
  --color-error-container: #ffdad6;
  --color-on-error-container: #93000a;

  --color-text: #191c1e;
  --color-text-strong: #172b4d;
  --color-text-muted: #434654;
  --color-outline: #737685;
  --color-outline-soft: #c3c6d6;
  --color-border: #ebecef;
}
```

### Color Usage

- Use `--color-primary-action` for primary buttons, active navigation, progress indicators, and brand marks.
- Use `--color-secondary-action` for charts, informational chips, and secondary highlights.
- Use `--color-success` only for positive financial deltas, paid states, profit, and successful confirmations.
- Use `--color-error` for destructive, failed, overdue, or negative states.
- Keep the app mostly white and light gray. Blue should signal action or current position, not fill the whole UI.

## Typography

Font family: Inter.

```css
:root {
  --font-sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  --text-headline-lg-size: 32px;
  --text-headline-lg-line: 40px;
  --text-headline-lg-weight: 700;

  --text-headline-mobile-size: 24px;
  --text-headline-mobile-line: 32px;
  --text-headline-mobile-weight: 700;

  --text-headline-md-size: 20px;
  --text-headline-md-line: 28px;
  --text-headline-md-weight: 600;

  --text-body-lg-size: 16px;
  --text-body-lg-line: 24px;
  --text-body-lg-weight: 400;

  --text-body-sm-size: 14px;
  --text-body-sm-line: 20px;
  --text-body-sm-weight: 400;

  --text-label-size: 12px;
  --text-label-line: 16px;
  --text-label-weight: 600;
  --text-label-tracking: 0.05em;

  --text-currency-size: 28px;
  --text-currency-line: 34px;
  --text-currency-weight: 700;
}
```

### Typography Rules

- Use mobile headline sizing for page titles inside the prototype shell.
- Use the currency display token for Lempira totals and revenue metrics.
- Use `label-caps` for section labels, metadata, and chart headers.
- Keep letter spacing at `0` for normal UI text. Use the label tracking token only for caps labels.

## Spacing

Use an 8px base grid.

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;

  --container-margin: 16px;
  --stack-gap-sm: 8px;
  --stack-gap-md: 16px;
  --stack-gap-lg: 24px;
  --grid-gutter: 16px;
}
```

### Layout Rules

- Build mobile-first with a 390px reference width, but allow the prototype to scale inside a centered phone-width shell on desktop.
- Maintain 16px left and right safe areas.
- Use 8px gaps for tightly related elements.
- Use 16px gaps for cards and form controls.
- Use 24px gaps between distinct sections.
- Anchor primary mobile navigation and key actions near the bottom for one-handed use.
- Avoid nested cards. Use cards for repeated content, forms, and focused widgets only.

## Shape And Elevation

```css
:root {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  --shadow-card: 0 4px 12px rgba(0, 0, 0, 0.05);
  --shadow-modal: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

- Buttons and inputs use 8px radius.
- Cards use 12px or 16px radius.
- Status chips use full pill radius.
- Prefer tonal layering and soft shadows. Avoid heavy borders.
- Use subtle 1px borders in `#EBECF0` when white cards sit on white or near-white backgrounds.

## Component Guidelines

### Primary Buttons

- Background: `#0052CC`.
- Text: white, semi-bold.
- Minimum height: 48px.
- Radius: 8px.
- Include icons where they clarify the action.

### Secondary Buttons

- White or light gray background.
- Border: `#C3C6D6` or `#EBECEF`.
- Text: `#172B4D`.

### Input Fields

- Background: `#F4F5F7`.
- Border: transparent or `#EBECEF`.
- Focus border: `#0052CC`.
- Label outside field using 14px text with medium or semi-bold weight.
- Minimum height: 48px for touch.

### Financial Cards

- White surface.
- Soft shadow.
- Top-left primary financial value with `L` prefix.
- Top-right trend chip using success green for positive growth.
- Use secondary turquoise or primary blue for chart accents.

### Bottom Navigation

- Fixed to the bottom of the mobile shell.
- Four or five items.
- Active state uses primary blue for icon and label.
- Inactive state uses muted text.
- Use familiar icons from Lucide React.

### Status Chips

- Paid: green text on light green background.
- Pending: blue or turquoise text on pale blue background.
- Overdue: red text on pale red background.
- Use compact 12px labels and pill radius.

### Lists

- Use a leading icon to indicate category or object type.
- Put primary label and metadata on the left.
- Put numeric value or status on the right.
- Keep rows easy to scan with consistent vertical padding.

## Icon Guidance

Use Lucide React icons. Recommended mappings:

- WhatsApp connection: `MessageCircle`, `Send`, `Bot`
- Dashboard: `LayoutDashboard`
- Sales and revenue: `Banknote`, `TrendingUp`, `ReceiptText`
- Inventory: `Package`, `Boxes`, `Archive`
- Customers: `Users`
- History: `Clock`, `History`
- Settings: `Settings`
- Success: `CheckCircle2`
- Warnings and overdue states: `AlertCircle`
- Navigation: `Home`, `BarChart3`, `Package`, `WalletCards`, `User`

## Data Visualization

- Use Recharts for charts.
- Favor compact cards with readable labels.
- Use primary blue for main series and turquoise for secondary series.
- Use success green for positive growth.
- Keep axes and gridlines low contrast.

## Prototype Behavior

- Use localStorage for simulated business data, onboarding state, WhatsApp connection status, inventory, transactions, and user profile.
- Keep the prototype interactive: onboarding navigation, auth forms, OTP entry, WhatsApp linking, dashboard tabs, inventory edits, and transaction filtering should update state.
- No backend is required.
- Display all currency in Lempiras with `L` prefix.

