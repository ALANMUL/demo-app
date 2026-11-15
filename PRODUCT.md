# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary: school and college office staff.** Clerks, accountants and the head teacher or principal, doing the daily administration: admitting students, collecting fees and printing receipts, taking and checking attendance, entering marks and publishing results, sending notices and SMS. Many are not very technical and learn the system by using it, usually on an office PC.
- **Teachers.** Mark attendance, enter marks and homework for their own classes and subjects; some do this on a phone.
- **Guardians and students.** Use the separate Android app (and the website's family login) to see attendance, homework, results, notices and fees, and to pay fees online.
- **The platform team (SNCMT).** Run the platform admin: create schools, set packages and record subscription payments.
- **Prospective schools and colleges.** Visit the marketing site (sncmt.com) to see what the product does and ask for a demo.

## Product Purpose

SNCMT (School & College Management) runs a Bangladeshi school or college from one place: students and admissions, teachers, classes and routines, attendance, exams and results, fees and accounts, notices, SMS to guardians, and the school's own public website. It exists so the office can stop juggling registers, spreadsheets and phone calls. Success is office staff finishing their daily work quickly and correctly, in the language they prefer, and guardians knowing what is happening with their child without calling the school.

## Positioning

- **Bangla-first.** Built for schools and colleges in Bangladesh: Bangla by default, Bangla digits on screen, the local school calendar, GPA grading, and English alongside it.
- **Everything in one place.** The office dashboard, teachers, the guardians' Android app and each school's own website on its own address (`<school>.sncmt.com`) are one system sharing one set of data.
- **Simple, fair packages.** Every package includes every feature; packages differ only by how many active students they allow. Prices are set by the platform admin and must be read from there, never hard-coded in copy.
- **Real-world hookups.** Fingerprint and card attendance machines, online fee payment through SSLCommerz, and SMS to guardians through the school's own SMS account.

## Operating Context

- Multi-tenant by web address: `sncmt.com` is the marketing site, `admin.sncmt.com` the platform admin, and each school lives at `<code>.sncmt.com` with its public homepage at `/` and the dashboard behind login.
- Office work happens on shared office PCs, often older machines on slow or unreliable internet; teachers and guardians mostly use inexpensive Android phones.
- Staff think about students the way the school is organised: academic year, then class, then section, then roll number. Admission numbers identify students across years.
- Paper is part of the job: result cards, fee receipts, admit cards, ID cards, seat plans, tabulation sheets and lists are printed and handed out.
- The school year follows the Bangladesh calendar; dates are Bangladesh calendar days.
- Roles and permissions decide what each staff member sees; the school super admin sees everything. Some modules are switched on per school.

## Capabilities and Constraints

- Three apps in one repository: the Next.js website (marketing site, platform admin, every school's site and dashboard), the Express + PostgreSQL API, and a Flutter Android app for guardians, students and teachers only (school admins use the website).
- Every screen exists in Bangla and English; both must read naturally, and Bangla text is often longer.
- Must stay light and usable on slow devices and connections.
- Must stay understandable for less-technical users: plain words, clear labels, visible primary actions, few hidden features.
- Printed output must look right on paper.
- Optional paid modules (Library, Transport) are defined in the data but not built; do not advertise them.

## Brand Commitments

- Name: "School & College Management" (Bangla: স্কুল ও কলেজ ম্যানেজমেন্ট), sold as SNCMT at sncmt.com.
- The existing look is binding: the navy sidebar colour with gold accents (schools may choose their own sidebar and accent colours), Times New Roman for English and Anek Bangla for Bangla.
- Prices are shown with "TK" in English and "৳" in Bangla.

## Evidence on Hand

- A working demo school (`demoschool`) with real-looking data, used for checking screens.
- Package names, student limits and prices live in the platform admin and are served by the API.
- There are no customer testimonials, case studies, school logos, user counts or press yet. Future work must not invent any of these.

## Product Principles

1. **The office's day comes first.** Design for the clerk finishing admissions, fees and attendance quickly and correctly; everything else is secondary.
2. **Bangla is not a translation.** Every screen must work fully in Bangla, with Bangla digits and local conventions, as well as in English.
3. **Find it the way the school thinks.** Year, class, section, roll and admission number are the natural ways in; screens should follow them.
4. **Light, plain and printable.** Fast on old PCs and slow internet, worded plainly for non-technical staff, and correct on paper.
5. **One system, told truthfully.** Show what the product really does and what schools really pay; never claim features, customers or results that do not exist.

## Accessibility & Inclusion

- Readable for less-technical and older office staff: clear text sizes, plain language, obvious actions.
- Works on inexpensive Android phones and older desktop browsers.
- Full Bangla and English support, including Bangla digits.
