---
version: 1
slug: "client-app-school-page-tsx"
primary_target: "client/app/school/page.tsx"
related_targets: ["client/components/school/site"]
---

# School homepage (public site of each school)

Scope: the public homepage at `<code>.sncmt.com/`. Visitor mode: Persuade/Read.
Audience: guardians (current and prospective), mostly on cheap Android phones; they come for notices, admission details and how to reach the school.
Decisions: hero buttons Admission (else Notices) + Contact; name/tagline fixed over crossfading photos, captions small; same content, no server changes; structure "school prospectus".

## Direction contract
THESIS: The school's own prospectus, online: photographs of the school, then numbered chapters on ruled paper. Refuses the startup-landing look (blobs, tilted cards, hover lifts).
OWN-WORLD: Paper and canvas grounds; the school's own colour for structure and the main action, its single accent; Merit Gold only on the school colour or the photo scrim; 1px hairlines; Times New Roman / Anek Bangla with large serif chapter numbers; 4px controls, 8px frames, no shadows at rest, no gradients; a school's photograph is shown as it is (no shade, blur or tint), filling its space or, past 40% lost, shown whole on the school colour.
STORY: who the school is (hero), what's new (latest notice), then about, admission, notices, gallery, contact; each one tap from the menu.
FIRST VIEWPORT: school-colour header bar (logo left, chapter menu at the true middle, language and log-in right) over a full-width stage of the school's photos, crossfading, under a light shade of the school colour (from the bottom, and from the left behind the words from 1024px). On the left (midway down from 1024px, at the bottom on a phone): the name in the page's language only, the school's own line, white main button and white-outline Contact, phone and address on one quiet line; along the foot on a hairline the caption, "02 / 05" counter, markers and pause/play. A photo that would lose more than 40% to fill is shown whole over a blurred copy of itself. A paper ribbon under the hero with the latest notice. (Revised at the user's request: full-width photos, a lighter shade, no gold rule, one name.)
FORM: school prospectus, first of three structures shown; seed: none (structure chosen by the user in the shape round).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
