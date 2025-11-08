# AGR Finance - Design Guidelines

## Design Approach

**Selected System**: Material Design with Financial Application Patterns
**Justification**: This is a utility-focused, mobile-first financial management tool requiring clarity, efficiency, and professional credibility. Material Design provides excellent mobile patterns, clear visual hierarchy, and strong data presentation components suitable for financial applications.

**Design Principles**:
- Mobile-first architecture with bottom navigation
- Information clarity and data hierarchy prioritization
- Professional, trustworthy aesthetic for financial context
- Efficient data scanning and quick action access
- Consistent patterns for rapid user learning

## Typography

**Font Family**: 
- Primary: Inter or Roboto (via Google Fonts CDN)
- Monospace: JetBrains Mono for financial figures and account numbers

**Hierarchy**:
- Page Titles: 24px, semibold
- Category Headers: 20px, semibold
- Section Headers: 18px, medium
- List Item Primary: 16px, medium
- List Item Secondary: 14px, regular
- Financial Figures: 16px, medium, monospace
- Body Text: 15px, regular
- Labels/Captions: 13px, regular
- Tab Labels: 14px, medium

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 3, 4, 6, 8** (e.g., p-4, mt-6, space-y-3)

**Key Measurements**:
- Screen padding: px-4 (mobile), px-6 (tablet+)
- Section spacing: space-y-6
- Card padding: p-4
- List item padding: p-3 or p-4
- Bottom navigation height: h-16
- Button height: h-11 or h-12
- Input field height: h-11

**Container Strategy**:
- Full-width layout with consistent horizontal padding
- Maximum width for readability on tablets: max-w-2xl mx-auto
- Bottom navigation fixed at viewport bottom
- Content area with padding-bottom to account for fixed navigation (pb-20)

## Component Library

### Navigation

**Bottom Navigation Bar**:
- Fixed position at bottom, full width
- Three equal-width items (Home, Add, Profile)
- Icons above labels (using Heroicons via CDN)
- Active state with stronger visual emphasis
- Height: h-16 with safe-area-inset-bottom for mobile devices

### Home Page - Category Buttons

**6 Large Category Cards**:
- Grid layout: 2 columns on mobile (grid-cols-2), 3 columns on tablet (md:grid-cols-3)
- Each card: Aspect ratio ~1:1.2, rounded corners (rounded-xl)
- Icon at top (size-12), category name below (text-lg font-semibold)
- Subtle elevation/shadow
- Gap between cards: gap-4
- Order: Crédit, Épargne, Soldé (top row) / Contencieux, Performance, Corbeille (bottom row)

### Client Lists (Crédit, Contencieux, Corbeille)

**List Item Cards**:
- Full-width cards with dividers or subtle spacing (space-y-2)
- Each card: p-4, rounded-lg, subtle elevation
- Layout per item:
  - Client name: text-base font-medium
  - Account/ID number: text-sm monospace
  - Status indicator: Small badge with rounded-full
  - Amount/Balance: text-base font-medium monospace, right-aligned
  - Last activity date: text-xs
- Chevron right icon for navigation (size-5)

**Search & Filter**:
- Search bar at top: h-11, rounded-lg, with search icon
- Filter chips below search (if needed): horizontal scroll, gap-2

### Tabbed Sections (Épargne, Soldé)

**Tab Navigation**:
- Horizontal tabs below page header
- Two equal-width tabs
- Active tab with bottom border accent
- Tab height: h-12
- Labels: text-sm font-medium

**Tab Content**:
- Renders appropriate list view based on selection
- Smooth transition between tabs

### Forms (Add Page)

**Type Selector**:
- Three segmented buttons at top
- Radio button behavior (Crédit / Compte courant / Carte de pointage)
- Height: h-11 each
- Gap: gap-2
- Active state clearly distinguished

**Form Fields**:
- Label above input: text-sm font-medium, mb-2
- Input fields: h-11, rounded-lg, full width
- Field spacing: space-y-4
- Input types: text, number, date, textarea
- Financial inputs with currency prefix indicator

**Form Actions**:
- Primary action button (Submit): w-full, h-12, rounded-lg, font-medium
- Secondary action if needed (Cancel/Clear): outlined style
- Fixed at bottom or after form fields with mt-8

### Performance Dashboard

**Statistics Cards**:
- Grid layout: grid-cols-2, gap-4
- Each stat card:
  - Large number: text-2xl font-bold monospace
  - Label below: text-sm
  - Icon or trend indicator
  - Padding: p-4, rounded-lg

**Charts/Graphs**:
- Use Chart.js or similar library
- Responsive sizing
- Clear axis labels and legends
- Height: h-64 or h-80

### Profile Page

**Profile Header**:
- Agent photo placeholder (circular, size-20 or size-24)
- Name: text-xl font-semibold
- Role/ID: text-sm
- Padding: p-6

**Settings List**:
- List items with icon, label, and chevron
- Height per item: h-14
- Dividers between items
- Grouped sections with section headers

### General UI Elements

**Buttons**:
- Primary: h-11 or h-12, px-6, rounded-lg, font-medium
- Secondary: outlined variant
- Icon buttons: size-10, rounded-full

**Badges/Status Indicators**:
- Small rounded pills: px-2 py-1, rounded-full, text-xs
- Use for status (active, settled, litigation, etc.)

**Icons**: 
- Use Heroicons via CDN
- Standard size: size-5 for inline icons
- Large size: size-6 or size-8 for emphasis
- Navigation icons: size-6

**Empty States**:
- Centered content with icon (size-16), message, and action button
- Use in Corbeille when empty, or lists with no data

## Interactions

**Minimal Animations**:
- Smooth page transitions (150-200ms)
- Tab switching: instant or very quick fade
- List item press: subtle scale feedback (active:scale-98)
- Bottom navigation: no animation

**Touch Targets**:
- Minimum 44px height for all interactive elements
- Adequate spacing between tappable items

## Mobile Optimization

- Safe area insets for notched devices
- Landscape mode consideration (reduce vertical spacing)
- Horizontal scrolling for tabs/chips with overflow-x-auto
- Pull-to-refresh pattern for lists (implementation consideration)

## Data Presentation

**Financial Figures**:
- Always use monospace font
- Right-align in lists
- Consistent decimal places
- Clear positive/negative indicators

**Date Formatting**:
- Consistent format throughout (DD/MM/YYYY or locale-appropriate)
- Relative time for recent activity ("Il y a 2h", "Aujourd'hui")

**Client Information Hierarchy**:
1. Client name (most prominent)
2. Account number/ID
3. Current amount/balance
4. Status
5. Last activity date (least prominent)

This design system creates a professional, efficient mobile-first financial management tool with clear information hierarchy and familiar interaction patterns for rapid agent productivity.