---
name: SNCMT School & College Management
description: The school office's register, kept on screen. Calm, trustworthy and warm: white paper, the school's own accent, and Merit Gold marking the place.
colors:
  register-navy: "oklch(0.285 0.11 263)"
  register-navy-ink: "oklch(0.305 0.1 258)"
  navy-wash: "oklch(0.955 0.018 258)"
  merit-gold: "oklch(0.82 0.14 82)"
  merit-gold-deep: "oklch(0.7 0.14 78)"
  signal-blue: "oklch(0.5 0.17 262)"
  signal-blue-wash: "oklch(0.952 0.022 262)"
  accent-band: "oklch(0.5 0.17 262)"
  accent-band-text: "oklch(0.985 0 0)"
  accent-ink: "oklch(0.305 0.1 258)"
  menu-ink: "oklch(0.32 0.04 262)"
  menu-hairline: "oklch(0.91 0.01 255)"
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
  site-name:
    fontFamily: "\"Times New Roman\", Tinos, \"Anek Bangla\", Times, serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
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
    backgroundColor: "{colors.paper}"
    textColor: "{colors.menu-ink}"
    width: "256px"
  sidebar-item-active:
    backgroundColor: "{colors.accent-band}"
    textColor: "{colors.accent-band-text}"
    rounded: "5px 10px 10px 5px"
    height: "40px"
  site-topbar:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.accent-ink}"
    height: "40px"
  site-header:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.accent-ink}"
    height: "88px"
  site-nav-active:
    backgroundColor: "{colors.accent-band}"
    textColor: "{colors.accent-band-text}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
  site-footer:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.accent-ink}"
  principal-card:
    backgroundColor: "{colors.signal-blue-wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
    padding: "28px"
  fact-cell:
    backgroundColor: "{colors.signal-blue-wash}"
    textColor: "{colors.accent-ink}"
    padding: "24px"
---

# Design System: SNCMT School & College Management

## Overview

**Creative North Star: "The School Register"**

SNCMT looks like the register book that sits on every school office desk: ruled, orderly, kept in ink, with a coloured index tab on the page you are working on and a gold mark beside it. Office staff spend whole days in it, so it stays calm and readable rather than exciting. Its authority comes from order: rows that line up, numbers that sit in columns, labels that never move. Its warmth comes from the serif type, the gold, and plain friendly words, not from decoration.

The system is flat. Surfaces are white paper on a cool grey desk, separated by hairlines and light grey bands rather than shadows. Colour is rare and always means something: the school's own **accent** carries its identity (the current page, the main action, headings on its homepage), Merit Gold marks where you are, and status colours say present, absent, paid or suspended. Everything else is ink on paper.

Density follows the work. Tables and forms are compact enough to show a full class on one screen, but every row has room to breathe and every control reads as clickable for staff who are not technical. Bangla and English share every screen, so layouts allow for longer Bangla words and Bangla digits.

Each school's public homepage is the same register turned outward: the school's prospectus. It opens on the school's own photographs at the full size of the screen, then its about section with the principal's message, its teachers, and its newest notices as cards, then numbered chapters on ruled paper (admission, gallery, contact). Real photographs supply the warmth; the rest is order, serif type and hairlines, in the school's own accent.

**Key Characteristics:**
- White menu, white paper, cool grey desk; the current page is an index tab in the school's accent.
- Every school colour on the homepage comes from the school's accent; gold only marks the place.
- Flat at rest: hairlines and grey bands instead of shadows.
- Serif type everywhere, sized a step larger in Bangla than in English.
- Small, consistent corners (4px for controls, 8px for cards); pills for the homepage menu and buttons.
- Colour only where it carries meaning.

## Colors

A disciplined palette: the school's one accent, one gold marker, neutral paper and ink, and the status colours. A school sets two colours in Settings → Appearance: its **accent** and its **sidebar**.

### The school's accent
A school picks one of nine accents: Navy (the default), Royal blue, Indigo, Violet, Maroon, Teal, Slate, Golden or Cream (`lib/theme/accents.ts`, `DEFAULT_ACCENT`; the server keeps the same list). No choice is saved as empty and means Navy; every other accent, Royal blue included, is saved by name. Royal blue stays the platform's own accent (the platform admin and globals.css). Each accent gives a set of shades, and everything that should look like "the school's colour" uses them:
- **Accent** (`--brand`; Signal Blue by default): the short bar above each page title, the open tab's underline, links, small highlights.
- **Accent Wash** (`--brand-soft`; Signal Blue Wash by default): soft tinted fills: the principal's card, the facts row, the hero while photos load.
- **Accent Ink** (`--navy`, `--primary`; Register Navy Ink by default): the accent's deep shade, for primary buttons, headings and figures in the accent, and white text on it. In dark mode it turns into a light tint.
- **Accent Band** (`--brand-band` and its text colour): the accent as a fill, the same in both modes: the dashboard menu's current page, the homepage menu's current item. Golden and Cream bands carry dark navy text; the rest white.
- **Accent Ink, fixed** (`--brand-ink`): the accent's deep shade, the same in both modes, for parts that stay white or dark whatever the theme: the dashboard's welcome banner and the phone's bottom bar, the homepage header's text and the footer's round marks.

Every accent is checked for WCAG AA: its text on white, white on its ink, and its band's text on the band.

### The sidebar colour
- **White** (the default) or one of the dark colours: Navy, Indigo, Deep teal, Ocean teal, Emerald, Deep purple or Charcoal.
- It colours only the dashboard's menu. The welcome banner, the phone's bottom bar and the public homepage use the accent (Accent Ink, fixed) instead.
- **Register Navy** (oklch(0.285 0.11 263)) stays the platform admin's menu colour.

### Merit Gold
- **Merit Gold** (oklch(0.82 0.14 82)): marks on the platform admin's navy menu, and the homepage's gold lines (the menu pill, the About and Notices headings).
- **Merit Gold Deep** (oklch(0.7 0.14 78)): the same gold on white: the line under the homepage menu's current item, the short line above the About heading, the phone menu's current-item bar, the top bar of the picked status card on the Students page.
- Gold never follows the accent: it is the one fixed colour that says "you are here".

### Neutral
- **Paper** (oklch(1 0 0)): cards, tables, inputs, the top bar, the white menu.
- **Canvas** (oklch(0.972 0.006 260)): the desk behind the cards, with a faint glow of the accent in the top corner.
- **Ink** (oklch(0.145 0 0)): all body text.
- **Menu Ink** (oklch(0.32 0.04 262)): text and icons in the white menu.
- **Quiet Ink** (oklch(0.556 0 0)): secondary text: admission numbers, hints, column headings, counts.
- **Hairline** (oklch(0.922 0 0)): every border and divider, usually at 60 to 70% strength; **Menu Hairline** (oklch(0.91 0.01 255)) in the white menu.
- **Muted Fill** (oklch(0.97 0 0)): table heading bands, hover rows, chip tracks.
- **Danger** (oklch(0.577 0.245 27.325)): destructive actions, errors, the required-field star.

Status pills use their own soft pairs: emerald for active and present, red for suspended and absent, amber for late, grey for inactive, navy for graduated. The word always carries the meaning; the colour only helps. These never change with the accent.

### Named Rules
**The School's Own Colour Rule.** On a school's homepage and in its dashboard, anything that is "the school's colour" uses the accent's shades, never a fixed blue or navy, so changing the accent in Settings changes all of it. The homepage uses nothing from the sidebar colour.

**The Gold Marks the Place Rule.** Merit Gold appears only to say "you are here". It stays gold whatever the accent. Never use it for buttons or body text.

**The One Accent Rule.** One accent per screen. A second decorative colour is never added.

**The Meaning-Only Colour Rule.** Any colour beyond the accent, gold and neutrals must carry a status. If it doesn't mean something, it is grey.

## Typography

**Display Font:** Times New Roman (with Tinos, then Times, serif)
**Body Font:** Times New Roman for English; Anek Bangla for Bangla letters, drawn at 88% of its natural size so it sits evenly beside the English
**Label/Mono Font:** Geist Mono, only for codes such as the school's subdomain

**Character:** a classic serif that reads like a printed register or a certificate, paired with a clean modern Bangla face. Formal without being stiff.

### Hierarchy
- **Display** (700, 1.75rem / 2rem from 640px in Bangla; 1.625rem / 1.75rem in English; line-height 1.2; -0.025em): one per page, the page title, with a 28px accent bar above it.
- **Headline** (600, 1.125rem, 1.3): section and card headings, such as "Class 7, section A".
- **Title** (600, 0.9375rem, 1.4): button labels, panel titles, student names in tables.
- **Body** (400, 0.9375rem in English, 1rem in Bangla, 1.43): table cells, form text, descriptions. Keep prose under 75 characters a line.
- **Label** (600, 0.8125rem, 0.08em, uppercase in shared tables): column headings and small field labels. The Students list uses the same size in sentence case.
- **Site Name** (700, 17px on phones, 22px from 640px, 24px from 1024px; 1.15): the school's name in the homepage header, over at most two lines, in Accent Ink.
- **Chapter Numeral** (400, 4rem from 1024px, 2.75rem below; 1; -0.03em; Accent Ink): a homepage chapter's number ("01", "০১"), regular weight so it reads as a printed folio, not a headline.

The whole scale is one step larger in Bangla than in English (the English scale runs 13, 15, 16, 18, 20, 24 and 30px).

### Named Rules
**The Bangla Is Not a Translation Rule.** Every text size, line length and label must work in Bangla first; English is set a step smaller to match its visual weight.

**The Numbers in Columns Rule.** Rolls, counts, amounts and dates use tabular figures so they line up down a column.

**The Whole Name Rule.** A school's name is never cut short with "…" where it is the subject (the dashboard's welcome, the homepage header): it wraps, balanced.

## Layout

A fixed white menu (256px, folding to 80px of icons) on the left; a white top bar (72px) across the content; the content area on the grey canvas with 6px padding on phones and 8px from 768px up, so pages use the full width. A small monospace trail (11px, "Home / People / Students") sits above each page; a page with a header panel (Page Hero) carries it there instead. Pages open with the title row (title and count on the left, actions on the right, aligned to the bottom), then one main card holding the work.

Spacing follows a 4px grid; the common steps are 8px between related controls, 12px between toolbar items, 20px of padding inside cards and 24px between page sections. Tables keep their first and last columns aligned with the card's 20px padding.

On phones the menu becomes a drawer opened from the top bar, a bottom bar carries the main pages, and sideways lists (the Students page's status cards, status tabs) scroll instead of wrapping.

### The public homepage
- **Header** (two parts):
  - a thin white contact bar, 36px on phones and 40px from 640px, that scrolls away with the page. Phone, email and address sit on the left with hairline dividers; the email and address drop off on narrow screens, and only the address shortens with "…". The login link ("Open the app" once logged in) and a language dropdown sit on the right.
  - a sticky white bar under it, 64px on phones and 88px from 640px. The school's round logo and its Site Name sit on the left; the menu (Home, then the chapters) sits on the right from 1024px; below 1024px a menu button opens a panel holding the links and a Log in button.
- **Hero:** the school's photographs at the full size of the screen under the header (`100svh` minus the header's 100px or 128px). Its height and the chapters' scroll margins follow the header's height.
- **Order:** the latest-notice strip, then About, Teachers and Notices (unnumbered, each its own layout), then the numbered chapters (admission, gallery, contact), then the footer.
- **Column:** everything sits in a centred 1152px column with a 16px gutter.
- **Chapters:** each is a 12-column grid from 1024px: the number and title in a 3-column margin that stays in view while the chapter scrolls, the content in the other 9, 48px apart. On phones the number sits beside the title above the content. Chapters are 56px, 80px and 96px tall in padding (phone, tablet, desktop), divided by hairlines, and alternate paper and the grey desk.

### Named Rules
**The Counted Chapters Rule.** Homepage chapters are numbered in page order, counting only the chapters the school has filled in (About is never numbered), so they always run 01, 02, 03 in the page's digits. The menu and the footer follow the same list.

## Elevation & Depth

Flat. Nothing casts a shadow at rest: cards, tables, panels and the top bar are separated by 1px hairlines (at 60 to 70% strength) and by light grey bands. Depth comes from layering paper on the canvas, not from light. Things that genuinely float above the page (menus, dropdowns, dialogs, toasts) carry a soft shadow, and so do a few things that physically sit on top of the page:
- the menu's index tab, where it lies over the page;
- the homepage's round logo, and its About photograph.

### Named Rules
**The Hairline, Not Shadow Rule.** Separate with a 1px hairline or a grey band. If you reach for a drop shadow on something that does not float or lie on top, use a border instead.

**The No Lift Rule.** Cards and buttons do not rise, glow or scale on hover. Hover changes a background or a border, nothing more.

**The Fill or Whole Rule.** A school's photograph fills the hero stage unless that would lose more than half of it. Then it is shown whole over a blurred copy of itself, never cut down to a fragment.

## Shapes

Small, consistent corners: 4px on buttons, inputs and selects, 5px on menu rows (the index tab rounds its outer end to 10px), 8px on cards, panels, the homepage's About photograph and the principal's card, and full circles for avatars, the homepage logo, status pills, count badges and the homepage's menu pill and buttons. Borders are 1px hairlines; the only thicker lines are the 2px tab underline and the 3px gold and accent marker bars.

## Components

Plain and dependable: clear labels, a solid accent button for the main action, thin outlines for the rest; nothing moves or glows.

### Buttons
- **Shape:** gently squared (4px radius), 36px tall. On the homepage, pills (44px tall).
- **Primary:** Accent Ink with white text, semibold, 16px side padding. One per view: "Add student", "Save changes".
- **Hover / Focus:** a slightly lighter shade on hover; a 3px soft ring on keyboard focus. No movement.
- **Outline / Ghost:** white with a hairline border for secondary actions (Export); ghost (no border) for row actions and "Clear filters".

### Chips
- **Filter selects:** white boxes with the filter's name inside in Quiet Ink ("Year 2026", "Gender All"); a set filter gets a darker border and a light grey fill.
- **Section buttons:** small outlined boxes (All, A, B); the picked one turns solid Accent Ink with white text.

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
- **Top bar:** white with a hairline below, holding messages, language, theme and the account menu.
- **Tabs:** a row of labels on a hairline; the open tab turns Ink and semibold with a 2px accent underline; counts sit beside labels in Quiet Ink.
- **Mobile:** the menu becomes a drawer; a bottom bar in Accent Ink, fixed, carries the main pages, the current one in Merit Gold.
- **Platform admin menu:** navy, white text, the current page on a 10% white tile with a 3px Merit Gold bar.

### The School Menu (signature: the index tab)
The school dashboard's menu reads like the index of the school's register binder.
- **Paper and edge:** white by default (a quiet dark grey in dark mode), or the school's dark sidebar colour with white text. Its paper stops 14px short of its edge, behind one hairline. The strip beyond shows the page's own colours: the top bar's white, then the canvas.
- **The tab:** the current page (or the current page inside a group) is filled with the Accent Band in its own text colour. It reaches out of the paper into that strip like an index tab, with a soft shadow where it lies on the page and a faint crease where it leaves the paper.
- **Header:** the logo with "Dashboard" and "Session 2026" beside it, as tall as the top bar, over a short light hairline.
- **Clusters:** thin hairline rules separate the clusters of pages, as an index does, instead of an all-caps label.
- **Groups:** a group (Academics, Administration) opens into its pages on a thin line, one group at a time.
- **Foot:** a help line, "Need help? WhatsApp us: 01626-567819", which opens a WhatsApp chat.
- **Scrolling and folding:** there is no visible scrollbar (it would cross the tab). The rows scroll with the wheel and keyboard, and the last rows fade out to show there is more. There is no rail; the menu folds with its button. In the phone drawer, which has no page beside it, the tab is a plain filled box.

### Tables
- **Heading band:** Muted Fill behind 13px semibold Quiet Ink headings (uppercase with 0.08em tracking in shared tables).
- **Rows:** hairline separators, a light grey on hover, no striping; first and last cells align with the card padding.
- **Status:** a soft pill with a dot and the word.

### Page Title (signature)
Every page opens with its title in Display weight, a 28px by 3px accent bar above it, a count badge beside it when the page lists things, and its actions aligned to the bottom on the right.

### Page Hero
A page's header as its own panel in Accent Ink, fixed, with an 8px corner, 8px above the page's sheet and never overlapping it: the trail in white (the current step bold), the title (1.75rem, bold) and a line under it in 75% white. A page's main actions sit at its right end, aligned to the bottom: secondary ones outlined in 35% white, the primary solid white with Accent Ink words; on phones they share a full-width row under the title. Used by the Students list and the student admit and edit pages; other pages are moving to it. Below it, a list page's sheet (toolbar, table, pages) reaches the bottom of the window, with the pagination at its foot.

### Form Pages (signature: register bands)
A long form is one white sheet as wide as the page and at least as tall as the window, divided by hairlines into bands. Each band has its name (bold, Accent Ink) and a one-line hint in Quiet Ink in a 220px column on the left, with room under them for a photo picker; its fields sit on the right, four across from 1280px, three from 1024px, two from 640px, one on phones, 20px apart and aligned to the top of their row. Bands have 28px of padding (16px on phones). The actions (Cancel, then the primary in Accent Ink with its icon) stay pinned at the bottom of the window on a frosted strip, with "Fields marked with a star are required" on the left; on phones they sit just above the bottom bar, full width. Admitting a student returns to the student list; saving an edit returns to the student.

### Dashboard Welcome
A banner in the school's accent, in its fixed deep shade (Accent Ink, fixed): the date and year chip, the greeting with the school's full name (wrapping, never cut), and the quick actions (Collect fee, Take attendance, Add student, New notice) as an even two-column grid of pills, 12px apart, beside it. On phones the actions sit under the greeting, and a long label wraps inside its pill.

### Status Cards (Students)
The Students register opens with a card per status: All, Active, Suspended, Inactive, Graduated. Each is paper with a hairline edge and 8px corners: a 32px icon box and the status name, the count in large tabular figures, and a 4px bar of its share of all the students with the percent. Icon and bar take the status pill's colours (emerald, red, grey, Accent Ink; All in the accent). The picked card carries a 3px Merit Gold Deep bar along its top and a darker edge; hover only darkens the edge. Five across from 1024px, a sideways-scrolling row below. Under them one card holds the toolbar on a Muted Fill band (search; Class, grouped School and College, and its Section; Year, Group, New or old, Gender, Religion; Clear filters; the order, "Sort", at the right end: the usual order, Newest, Oldest) and the table.

### Homepage Header
- **Contact bar:** Accent Ink text, small icons and hairline dividers (see Layout). The address shows only its last two parts (e.g. "Jatrabari, Bangladesh"), the whole of it on hover. The login link carries a small sign-in icon; once logged in it reads "Dashboard" with a dashboard icon. The language dropdown is a globe, the language's name and a small arrow.
- **Main bar:** the logo is a round badge with a soft shadow. The Site Name sits beside it over two lines.
- **Menu:** links in Accent Ink. The current one is a pill filled with the Accent Band, with a short Merit Gold Deep line under it; hover tints the pill area with the Accent Ink at 8%.
- **Phone menu:** the current link carries a gold bar on its left.

### Homepage Hero (signature)
The school's photographs at the full size of the screen, one fading into the next (each shows for 7s, then a 1.2s fade with the standard ease); nothing zooms or drifts, and no words or shade sit over them. The school's name is still the page's heading for screen readers and search engines.
- **A photo that doesn't fit:** it fills the stage unless that would lose more than half of it. A tall poster, or a landscape photo on a phone, is shown whole over a blurred copy of itself.
- **Controls:** each sits on a small dark backing so it reads on any photo. The caption is at the bottom left. At the bottom right are "02 / 05" in the page's digits, a slim marker per photo that fills while it shows (each a 44px tap target), and pause/play.
- **Holding and moving on:** pointing at or focusing the controls holds the photo; arrows and swipes move on. Nothing moves while the hero is scrolled out of view, or when the visitor asks for less motion.
- **One photo or none:** with one photo there are no controls. With none, the stage stays a soft Accent Wash.
- **Without slides:** the About photo or the first gallery photos stand in.

### Homepage About (signature)
The school's introduction and its principal's message as one compact row of up to three parts of the same height, from 1024px (two columns on tablets, stacked on phones). Every part comes from Settings → About section.
- **Photograph:** filling its column's height (at least 224px), 8px corners, a soft shadow.
- **Words:** a short Merit Gold Deep line, the heading "About the school" in Accent Ink, the first paragraph cut to four lines, then a "Learn more →" pill in Accent Ink. It opens a window with the whole story and the principal's whole message, so the row never grows.
- **Principal's card:** on the Accent Wash, with a gold quote mark and the heading "Message from the {title}" in Accent Ink. The message, cut to five lines, sits beside a round photo with a white ring, then "— Name" in Accent Ink with the title beside it in Quiet Ink. The title defaults to "Principal" / "অধ্যক্ষ"; the card shows only when the message isn't empty.
- **Facts:** a ruled row on the Accent Wash, four across on desktop and two on phones, separated by accent hairlines. Each holds a large bold figure in Accent Ink over its label.
- **Missing parts:** any part the school hasn't filled in drops out, and the columns close up.

### Homepage Teachers
Right after About, unnumbered, on paper with a hairline above. The teachers the school picked in Settings ("Teachers on the homepage"), in its order; with none picked there is no section and no menu item.
- **Heading row:** a short Merit Gold Deep line and "Our teachers" in Accent Ink; across from it two 36px round outline arrows in Accent Ink, faded at the ends, shown only when the cards don't all fit.
- **Cards:** five across from 1024px, four from 768px, three from 640px, two on phones, 16px apart, sliding a page at a time (swipe on phones, snap to each card). Each is the Accent Wash with an 8px corner: a round photo (96px, 112px from 640px) with a white ring and soft shadow (a drawn silhouette on an accent tint without one), the name bold in Accent Ink, the designation in Quiet Ink, both two lines at most.
- **Dots:** one per page under the row; the current one a 24px Merit Gold pill, the rest 8px grey dots.

### Homepage Chapters
- **Margin:** the Chapter Numeral, a 48px hairline and the chapter title (bold, 1.5rem). No introduction line: the title says it.
- **Latest notice strip:** a paper band under the hero, with a hairline below. It holds "Latest notice" in Accent Ink, the date, the title (truncated) and a chevron, and opens the notice.
- **Admission sheet:** one paper card divided by hairlines into parts, each titled in its own margin. Requirements are numbered, dates are label/value rows, and fees follow a printed fee schedule: label, dotted leader, amount ("TK 2,000" in English, "৳২,০০০" in Bangla).
- **Notices:** unnumbered, on the grey desk. A short Merit Gold Deep line and the heading in Accent Ink, with "View all notices →" across from it when there are more than three. Below, the newest three as white cards with an 8px corner and a hairline border, three across on desktop, two from 768px, stacked on phones. Each card holds the date in a box of the Accent Wash (the day large and bold in Accent Ink, the month and year under it) with a short hairline beside it (56px, centred on the box), then the title in Accent Ink (two lines at most), the start of the text in Quiet Ink (two lines), then "View" with an eye icon in Accent Ink with pinned and file marks, and the category's icon in the top corner. The whole card opens the notice in a window. "View all notices" opens a window listing every notice as dated rows, with "Show more" as an outline button in the accent; a notice opens on top of the list. Pinned notices come first.
- **Gallery:** photographs in even 4:3 frames (1px hairline, 4px inset, 8px corners) with captions beneath them. The first six show, then "Show all".
- **Contact rows:** label in Quiet Ink, the value large, and the action on the right as an Accent Ink link: call, email, map or website. Links that leave the page carry an outward arrow.

### Homepage Footer
On paper, with a hairline above, in up to four columns parted by vertical hairlines from 1024px (two columns from 640px, stacked on phones). Every colour follows the accent:
- **School:** the round logo (56px, white, soft shadow) beside the name in bold Accent Ink, then its footer line (or the default one) in italic in the accent.
- **Quick links:** the heading in bold Accent Ink, then the chapters and the login (or "Open app" once logged in), each after a small chevron in Accent Ink; hover turns the text Accent Ink.
- **Contact:** phone, email and full address, each beside a 28px round mark in Accent Ink, fixed, with a white icon.
- **Follow us:** the school's Facebook, YouTube and Instagram pages (set in Settings → About) as 36px round marks in Accent Ink, fixed, with white glyphs. Only the links a school filled in show; with none, the column drops out.
- **Bottom:** the copyright line in Quiet Ink, over a soft two-layer wave in the accent's tint along the bottom right.

## The main site (sncmt.com)

The platform's own marketing page shares the type and the gold but has its own look, "the school exercise book":
- **Margin line:** a margin line runs down the page with small italic notes in the margin.
  - the hero on pale sky-blue ruled paper, beside a drawing of a school dashboard whose attendance bars rise once. From 1024px wide the drawing sits beside the words and the hero fills the browser window under the header, its content centred. On a short window (up to 840px tall, then 700px) the headline drops to 3.5rem, then 3rem, and the gaps tighten. The drawing zooms itself (down to 50%) to fit both its column and the window, and rises up to 72px into the empty paper beside the headline (24px clear of its words) to gain room, so the whole hero shows at once on any laptop browser;
  - the hero on pale sky-blue ruled paper, beside a drawing of a school dashboard whose attendance bars rise once;
  - the features on a deep green chalkboard, grouped by area with chalk-yellow headings;
  - the packages on white, the popular one in solid navy;
  - contact on navy, with the WhatsApp number highlighted;
  - the footer on sky blue.
- **No gradients:** no gradients anywhere on this page.
- **Fixed buttons:** a WhatsApp button and a back-to-top button sit at the bottom right.
- **Logo:** the SNCMT logo (a graduate rising from an open book in a navy ring) marks the header, the footer and the browser tab.

## Do's and Don'ts

### Do:
- **Do** take every school colour from the accent's shades, so one change in Settings recolours the dashboard tab and welcome banner, the homepage header, menu, About section and footer together.
- **Do** keep Merit Gold for the marks that say "you are here", gold whatever the accent.
- **Do** separate surfaces with 1px hairlines at 60 to 70% and light grey bands, never shadows at rest.
- **Do** keep one solid accent button per view for the main action; everything else is outlined or ghost.
- **Do** use tabular figures for rolls, counts, amounts and dates.
- **Do** size type for Bangla first, with English one step smaller.
- **Do** show a school's name whole, wrapping where it must.
- **Do** keep corners small and consistent: 4px controls, 8px cards, full circles only for avatars, pills, badges and the homepage's menu and buttons.
- **Do** open every school's homepage on its own photographs at full size, and give the slideshow a pause button.
- **Do** lay homepage content out as numbered chapters with their titles in the margin, ruled with hairlines rather than boxed in cards (About excepted).

### Don't:
- **Don't** use a fixed blue, navy or gold where the school's colour belongs, and don't use the sidebar colour on the homepage.
- **Don't** add drop shadows, hover lifts, glows or scaling to cards and buttons.
- **Don't** use gradients, gradient text or decorative colour washes, and don't cut a school's photograph down to a fragment.
- **Don't** put words or a shade over the hero photographs.
- **Don't** decorate the homepage with glow blobs, dot patterns, tilted colour blocks or pinging badges, and don't put a small label (a kicker) above a heading.
- **Don't** use a second accent colour or any hue that does not carry a status.
- **Don't** show a visible scrollbar or a rail across the school menu's tab.
