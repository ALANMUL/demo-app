---
name: SNCMT School & College Management
description: The school office's register, kept on screen. Calm, trustworthy and warm, in Register Navy and Merit Gold.
colors:
  register-navy: "oklch(0.285 0.11 263)"
  register-navy-ink: "oklch(0.305 0.1 258)"
  navy-wash: "oklch(0.955 0.018 258)"
  merit-gold: "oklch(0.82 0.14 82)"
  merit-gold-deep: "oklch(0.7 0.14 78)"
  signal-blue: "oklch(0.5 0.17 262)"
  signal-blue-wash: "oklch(0.952 0.022 262)"
  paper: "oklch(1 0 0)"
  canvas: "oklch(0.972 0.006 260)"
  ink: "oklch(0.145 0 0)"
  quiet-ink: "oklch(0.556 0 0)"
  hairline: "oklch(0.922 0 0)"
  muted-fill: "oklch(0.97 0 0)"
  danger: "oklch(0.577 0.245 27.325)"
typography:
  display:
    fontFamily: "\"Times New Roman\", Tinos, \"Anek Bangla\", Times, serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "\"Times New Roman\", Tinos, \"Anek Bangla\", Times, serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  title:
    fontFamily: "\"Times New Roman\", Tinos, \"Anek Bangla\", Times, serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "\"Times New Roman\", Tinos, \"Anek Bangla\", Times, serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.43
  label:
    fontFamily: "\"Times New Roman\", Tinos, \"Anek Bangla\", Times, serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.08em"
  mono:
    fontFamily: "\"Geist Mono\", ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
  hero-name:
    fontFamily: "\"Times New Roman\", Tinos, \"Anek Bangla\", Times, serif"
    fontSize: "clamp(2.5rem, 5.4vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  chapter-numeral:
    fontFamily: "\"Times New Roman\", Tinos, \"Anek Bangla\", Times, serif"
    fontSize: "4rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.03em"
rounded:
  xs: "2px"
  sm: "3px"
  md: "4px"
  lg: "5px"
  xl: "6px"
  2xl: "8px"
  3xl: "10px"
  4xl: "12px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.register-navy-ink}"
    textColor: "{colors.paper}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    height: "36px"
    padding: "0 16px"
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    height: "36px"
    padding: "0 16px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    height: "36px"
    padding: "4px 12px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
    padding: "20px"
  table-head:
    backgroundColor: "{colors.muted-fill}"
    textColor: "{colors.quiet-ink}"
    typography: "{typography.label}"
    height: "40px"
  badge-count:
    backgroundColor: "{colors.navy-wash}"
    textColor: "{colors.register-navy-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  sidebar:
    backgroundColor: "{colors.register-navy}"
    textColor: "{colors.paper}"
    width: "232px"
  sidebar-item-active:
    textColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    height: "40px"
  site-header:
    backgroundColor: "{colors.register-navy}"
    textColor: "{colors.paper}"
    height: "72px"
  hero-button-primary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.register-navy}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    height: "48px"
    padding: "0 24px"
  hero-button-outline:
    textColor: "{colors.paper}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    height: "48px"
    padding: "0 24px"
  fact-cell:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.register-navy-ink}"
    padding: "24px 20px"
---

# Design System: SNCMT School & College Management

## Overview

**Creative North Star: "The School Register"**

SNCMT looks like the register book that sits on every school office desk: ruled, orderly, kept in navy ink, with a gold mark on the page you are working on. Office staff spend whole days in it, so it stays calm and readable rather than exciting. Its authority comes from order: rows that line up, numbers that sit in columns, labels that never move. Its warmth comes from the serif type, the gold, and plain friendly words, not from decoration.

The system is flat. Surfaces are white paper on a cool grey desk, separated by hairlines and light grey bands rather than shadows. Colour is rare and always means something: Register Navy carries structure and the main action, Merit Gold marks where you are, Signal Blue points at the current section, and status colours say present, absent, paid or suspended. Everything else is ink on paper.

Density follows the work. Tables and forms are compact enough to show a full class on one screen, but every row has room to breathe and every control reads as clickable for staff who are not technical. Bangla and English share every screen, so layouts allow for longer Bangla words and Bangla digits.

Each school's public homepage is the same register turned outward: the school's prospectus. It opens on the school's own photographs, shown whole and fading one into the next beside its name, then reads as numbered chapters on ruled paper (about, admission, notices, gallery, contact). It is quieter than a marketing page: real photographs supply the warmth, and the rest is order, serif type and hairlines in the school's own colour.

**Key Characteristics:**
- Navy sidebar, white paper, cool grey desk; gold marks the current place.
- Flat at rest: hairlines and grey bands instead of shadows.
- Serif type everywhere, sized a step larger in Bangla than in English.
- Small, consistent corners (4px for controls, 8px for cards).
- Colour only where it carries meaning.
- The public homepage is a prospectus: the school's photographs whole, then numbered chapters on ruled paper.

## Colors

A disciplined palette of one structural navy, one gold marker, one signal blue, and neutral paper and ink; status colours are the only other hues.

### Primary
- **Register Navy** (oklch(0.285 0.11 263)): the sidebar, the school's own colour. Schools may replace it with another dark sidebar colour (indigo, teal, ocean, emerald, purple or charcoal), so nothing outside the sidebar may depend on it being navy. On the public homepage the same school colour carries the header bar, the field the hero's words and photographs sit on, and the footer.
- **Register Navy Ink** (oklch(0.305 0.1 258)): primary buttons, roll numbers, selected section buttons, count badges' text. The page's own navy, matching the sidebar.
- **Navy Wash** (oklch(0.955 0.018 258)): the tint behind count badges and soft navy highlights.

### Secondary
- **Merit Gold** (oklch(0.82 0.14 82)): the current-page bar in the sidebar, the menu's active marks, focus rings on navy. On the homepage: the underline under the menu's current chapter, and the short bars before the footer's headings. Gold appears only on or beside navy (the school colour).
- **Merit Gold Deep** (oklch(0.7 0.14 78)): the same gold where it must sit on white (the class index's current-class bar).

### Tertiary
- **Signal Blue** (oklch(0.5 0.17 262)): the short bar above each page title, the underline under the open tab, links. Schools may choose another accent colour; it stays a single accent.
- **Signal Blue Wash** (oklch(0.952 0.022 262)): soft blue fills, such as the upcoming-holiday date blocks.

### Neutral
- **Paper** (oklch(1 0 0)): cards, tables, inputs, the top bar.
- **Canvas** (oklch(0.972 0.006 260)): the desk behind the cards, with a faint glow of the accent in the top corner.
- **Ink** (oklch(0.145 0 0)): all body text and headings.
- **Quiet Ink** (oklch(0.556 0 0)): secondary text: admission numbers, hints, column headings, counts.
- **Hairline** (oklch(0.922 0 0)): every border and divider, usually at 60 to 70% strength.
- **Muted Fill** (oklch(0.97 0 0)): table heading bands, hover rows, chip tracks.
- **Danger** (oklch(0.577 0.245 27.325)): destructive actions, errors, the required-field star.

Status pills use their own soft pairs: emerald for active and present, red for suspended and absent, amber for late, grey for inactive, navy for graduated. The word always carries the meaning; the colour only helps.

### Named Rules
**The Gold Marks the Place Rule.** Merit Gold appears only to say "you are here" or to highlight on navy. Never use it for buttons, text on white, or decoration.

**The One Accent Rule.** One accent per screen: Signal Blue (or the school's chosen accent) for the title bar, the open tab and links. A second decorative colour is never added.

**The Meaning-Only Colour Rule.** Any colour beyond navy, gold, blue and neutrals must carry a status. If it doesn't mean something, it is grey.

## Typography

**Display Font:** Times New Roman (with Tinos, then Times, serif)
**Body Font:** Times New Roman for English; Anek Bangla for Bangla letters, drawn at 88% of its natural size so it sits evenly beside the English
**Label/Mono Font:** Geist Mono, only for codes such as the school's subdomain

**Character:** a classic serif that reads like a printed register or a certificate, paired with a clean modern Bangla face. Formal without being stiff.

### Hierarchy
- **Display** (700, 1.75rem / 2rem from 640px in Bangla; 1.625rem / 1.75rem in English; line-height 1.2; -0.025em): one per page, the page title, with a 28px Signal Blue bar above it.
- **Headline** (600, 1.125rem, 1.3): section and card headings, such as "Class 7, section A".
- **Title** (600, 0.9375rem, 1.4): button labels, panel titles, student names in tables.
- **Body** (400, 0.9375rem in English, 1rem in Bangla, 1.43): table cells, form text, descriptions. Keep prose under 75 characters a line.
- **Label** (600, 0.8125rem, 0.08em, uppercase in shared tables): column headings and small field labels. The Students list uses the same size in sentence case.
- **Hero Name** (700, fluid from 2.375rem to 3.75rem, 1.08, -0.02em; names longer than 28 characters step down to 2rem–3rem): the school's name beside the homepage photographs, white on the school colour, balanced. The only text this large anywhere.
- **Chapter Numeral** (400, 4rem from 1024px, 2.75rem below; 1; -0.03em; Register Navy Ink): a homepage chapter's number ("01", "০১"), regular weight so it reads as a printed folio, not a headline.

The whole scale is one step larger in Bangla than in English (the English scale runs 13, 15, 16, 18, 20, 24 and 30px).

### Named Rules
**The Bangla Is Not a Translation Rule.** Every text size, line length and label must work in Bangla first; English is set a step smaller to match its visual weight.

**The Numbers in Columns Rule.** Rolls, counts, amounts and dates use tabular figures so they line up down a column.

## Layout

A fixed navy sidebar (232px, folding to 68px of icons) on the left; a white top bar (72px) across the content; the content area on the grey canvas with 12px padding on phones, 16px on tablets and 20px from 1024px up. Pages open with the title row (title and count on the left, actions on the right, aligned to the bottom), then one main card holding the work.

Spacing follows a 4px grid; the common steps are 8px between related controls, 12px between toolbar items, 20px of padding inside cards and 24px between page sections. Tables keep their first and last columns aligned with the card's 20px padding.

On phones the sidebar becomes a drawer opened from the top bar, a bottom bar carries the main pages, and sideways lists (the class index, status tabs) scroll instead of wrapping.

The public homepage has no sidebar. A sticky school-colour header bar (64px on phones, 72px from 640px) sits above the hero: from 1024px the logo and name at its left, the chapter menu at its true middle (the two outer columns are equal), the language switch and the way in at its right; below 1024px a menu button opens a panel under the bar. Under the header is the hero, a full-width stage of the school's photographs. Its words sit in the centred 1152px column at the bottom left (at most 672px wide), with the slideshow controls on a hairline under them. The stage fills the whole screen under the header bar, at every size, so the latest-notice ribbon waits just below the fold; with no photo it is a shorter plain field in the school colour. Everything else sits in a centred 1152px column with a 16px gutter. Each chapter is a 12-column grid from 1024px: the number and title in a 3-column margin that stays in view while the chapter scrolls, the content in the other 9, 48px apart; on phones the number sits beside the title above the content. Chapters are 56px, 80px and 96px tall in padding (phone, tablet, desktop), divided by hairlines, and alternate paper and the grey desk so one chapter reads as distinct from the next.

### Named Rules
**The Counted Chapters Rule.** Homepage chapters are numbered in page order, counting only the chapters the school has filled in, so they always run 01, 02, 03 in the page's digits. The menu, the numbers and the footer follow the same list.

## Elevation & Depth

Flat. Nothing casts a shadow at rest: cards, tables, panels and the top bar are separated by 1px hairlines (at 60 to 70% strength) and by light grey bands (table headings, the class index). Depth comes from layering paper on the canvas, not from light. Only things that genuinely float above the page (menus, dropdowns, dialogs, toasts) carry a soft shadow.

### Named Rules
**The Hairline, Not Shadow Rule.** Separate with a 1px hairline or a grey band. If you reach for a drop shadow on something that does not float, use a border instead.

**The No Lift Rule.** Cards and buttons do not rise, glow or scale on hover. Hover changes a background or a border, nothing more.

**The Fill or Whole Rule.** A school's photograph fills the hero stage only while that loses at most 40% of it. A photo that would lose more (a tall poster on a desktop, a landscape photo on a phone) is shown whole, over a blurred, dimmed copy of itself filling the stage, never cut down to a fragment. The one gradient in the system is the hero's shade: the school colour darkened, rising from the bottom (and from the left from 1024px) so the white words read on any photo. Nowhere else.

## Shapes

Small, consistent corners: 4px on buttons, inputs and selects, 5 to 6px on menu rows, 8px on cards and panels, and full circles for avatars, status pills and count badges. Borders are 1px hairlines; the only thicker lines are the 2px Signal Blue tab underline and the 3px gold and blue marker bars.

## Components

Plain and dependable: clear labels, solid navy for the main action, thin outlines for the rest; nothing moves or glows.

### Buttons
- **Shape:** gently squared (4px radius), 36px tall.
- **Primary:** Register Navy Ink with white text, semibold, 16px side padding. One per view: "Add student", "Save changes".
- **Hover / Focus:** a slightly lighter navy on hover; a 3px soft ring on keyboard focus. No movement.
- **Outline / Ghost:** white with a hairline border for secondary actions (Export); ghost (no border) for row actions and "Clear filters".

### Chips
- **Filter selects:** white boxes with the filter's name inside in Quiet Ink ("Year 2026", "Gender All"); a set filter gets a darker border and a light grey fill.
- **Section buttons:** small outlined boxes (All, A, B); the picked one turns solid Register Navy Ink with white text.

### Cards / Containers
- **Corner Style:** 8px.
- **Background:** Paper on the Canvas.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** 1px hairline at 60 to 70%.
- **Internal Padding:** 20px; sections inside a card are divided by hairlines, not by nested cards.

### Inputs / Fields
- **Style:** white, hairline border, 4px radius, 36px tall; search boxes carry a magnifier on the left.
- **Focus:** the border darkens; no glow ring on text fields.
- **Error / Disabled:** Danger border with the message under the field; disabled fields fade to half strength. Required fields carry a Danger star after the label.

### Navigation
- **Sidebar:** Register Navy; white menu text at 14.5px in English; the current page sits on a 10% white tile with a 3px Merit Gold bar at the left edge; groups open one at a time.
- **Top bar:** white with a hairline below, holding messages, language, theme and the account menu.
- **Tabs:** a row of labels on a hairline; the open tab turns Ink and semibold with a 2px Signal Blue underline; counts sit beside labels in Quiet Ink.
- **Mobile:** the sidebar becomes a drawer; a bottom bar carries the main pages.

### Tables
- **Heading band:** Muted Fill behind 13px semibold Quiet Ink headings (uppercase with 0.08em tracking in shared tables).
- **Rows:** hairline separators, a light grey on hover, no striping; first and last cells align with the card padding.
- **Status:** a soft pill with a dot and the word.

### Page Title (signature)
Every page opens with its title in Display weight, a 28px by 3px Signal Blue bar above it, a count badge (Navy Wash) beside it when the page lists things, and its actions aligned to the bottom on the right.

### Class Index (signature)
The Students register's left rail: All classes, then School and College headings, the current class marked with a Merit Gold Deep bar and its sections as small buttons beneath. It becomes a sideways-scrolling row on phones.

### Homepage Hero (signature)
The school's photographs across the full width, behind its words. Each shows for 7s, then the next fades in while the one before fades out (1.2s, the standard ease); nothing zooms or drifts. A photo fills the stage unless that would cut away more than 40% of it; then it is shown whole over a blurred, dimmed copy of itself: near the top on a phone, where the words sit below it, and to the right on a desktop, beside them. A shade of the school colour (mixed 45% with black) rises from the bottom, and from 1024px also from the left. Slides keep their own shape when uploaded (at most 1920px on the longer side). Over the shade at the bottom left: the Hero Name (only in the language being read; the other only when this one is missing), the school's own line about itself (set in its settings; a default line until it writes one), then a white button in the school colour's ink (48px tall, 4px corners) and a white-outline button beside it, and the phone and first address line in one quiet row. Under them, on a 20% white hairline, sit the caption, a "01 / 03" counter in the page's digits, a slim marker per photo that fills while it shows (each a 44px tap target), and a round 44px pause/play button. Photos are fetched as they come up, and nothing moves while the hero is scrolled out of view. Pointing at or focusing the controls holds the photo. When the visitor asks for less motion, nothing moves and pause/play is hidden. With one photo there are no controls. With none, the hero is a shorter plain field in the school colour.

### Homepage Chapters
- **Margin:** the Chapter Numeral, a 48px hairline and the chapter title (bold, 1.5rem). No introduction line: the title says it.
- **Latest notice strip:** a paper band under the hero, with a hairline below. It holds "Latest notice" in Register Navy Ink, the date, the title (truncated) and a chevron, and opens the notice.
- **Facts:** a ruled row of figures, four across on desktop and two on phones, separated by 1px hairlines with no gaps. Each holds a large bold figure in Register Navy Ink over its label.
- **Admission sheet:** one paper card divided by hairlines into parts, each titled in its own margin. Requirements are numbered, dates are label/value rows, and fees follow a printed fee schedule: label, dotted leader, amount ("TK 2,000" in English, "৳২,০০০" in Bangla).
- **Notice rows:** a dated line per notice, divided by hairlines. The day is large in Register Navy Ink with the month and year beneath it, behind a hairline. Then come the title, the category, pinned and file marks, and a chevron. Pinned notices come first.
- **Contact sheet:** photographs in even 4:3 frames (1px hairline, 4px inset, 8px corners) with captions beneath them. The first six show, then "Show all".
- **Contact rows:** label in Quiet Ink, the value large, and the action on the right as a Register Navy Ink link: call, email, map or website. Links that leave the page carry an outward arrow.

## Do's and Don'ts

### Do:
- **Do** separate surfaces with 1px hairlines at 60 to 70% and light grey bands, never shadows at rest.
- **Do** keep one solid Register Navy Ink button per view for the main action; everything else is outlined or ghost.
- **Do** use Merit Gold only to mark the current place or to highlight on navy.
- **Do** use tabular figures for rolls, counts, amounts and dates.
- **Do** size type for Bangla first, with English one step smaller.
- **Do** keep corners small and consistent: 4px controls, 8px cards, full circles only for avatars, pills and badges.
- **Do** open every school's homepage on its own photographs, shown whole beside the words on the school colour, and give the slideshow a pause button.
- **Do** lay homepage content out as numbered chapters with their titles in the margin, ruled with hairlines rather than boxed in cards.

### Don't:
- **Don't** add drop shadows, hover lifts, glows or scaling to cards and buttons.
- **Don't** use gradients (the hero's shade is the one exception), gradient text or decorative colour washes, and don't cut a school's photograph down to a fragment: past 40% lost, show it whole.
- **Don't** decorate the homepage with glow blobs, dot patterns, tilted colour blocks or pinging badges, and don't put a small label (a kicker) above a heading.
- **Don't** use a second accent colour or any hue that does not carry a status.
- **Don't** depend on the sidebar being navy outside the sidebar; schools choose their own sidebar colour.
- **Don't** put Merit Gold text on white or use gold for buttons.
