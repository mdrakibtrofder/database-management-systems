# Build Prompt — CSE 2205 Database Management Systems Study Website

> **How to use this file:** Give this entire file to an AI coding assistant (Claude, Claude Code, Cursor, etc.) and open the `CSE_2205` folder as its working folder. Everything the assistant needs is in this file: the course facts, the exact file names, the page structure, the visual design and the interactive visualizations. It should not need to guess.

---

## 1. Your Role and Goal

You are a senior front-end engineer and a learning-experience designer. Build a **beautiful, student-friendly, interactive study-materials website** for the course **CSE 2205 – Database Management Systems** at BAUST.

The website must:

1. Present the course **week by week**. Each week has its lecture slides **viewable in the browser** and **downloadable**.
2. Attach **every document in the `Notes/` folder**. Each note can be viewed in the browser, downloaded, and is linked from the weeks it supports.
3. Include **smart, interactive visualizations** for the hard DBMS concepts (B+ trees, joins, normalization, precedence graphs, deadlocks, RAID, recovery, and more), so students can *see* the ideas, not just read them.
4. Open in **light mode by default**, with a **dark mode toggle** that remembers the student's choice.
5. Work well on **mobile phones**. Most students will open it on a phone.
6. Be a **static site** with no server and no database, deployable for free on **GitHub Pages**, **Netlify** or **Vercel**.

---

## 2. Course Facts (use exactly as written)

| Field | Value |
|---|---|
| Course code | CSE 2205 |
| Course title | Database Management Systems |
| Credit | 3.00 (3 hours/week) |
| Level / Term | Level-2, Term-II |
| Semester | Summer 2026 |
| Department | Department of Computer Science and Engineering |
| University | Bangladesh Army University of Science and Technology (BAUST), Saidpur |
| Instructor | Md. Rakib Trofder, Lecturer, Dept. of CSE |
| Email | trofder@baust.edu.bd |
| Main textbook | Silberschatz, Korth, Sudarshan — *Database System Concepts*, 7th Ed., McGraw-Hill, 2020 |
| Other references | Elmasri & Navathe — *Fundamentals of Database Systems*, 7th Ed. · Ramakrishnan & Gehrke — *Database Management Systems*, 3rd Ed. · PostgreSQL / MySQL / Oracle official documentation |



### Course Outcomes (COs)

| CO | Statement | PO | Bloom's level |
|---|---|---|---|
| CO1 | Explain database system architecture, data models, integrity constraints, and the database design process. | PO1 | C2 |
| CO2 | Analyze functional dependencies, apply ER modeling and normalization techniques to design efficient relational schemas. | PO2 | C4, C5 |
| CO3 | Apply relational algebra, SQL queries, indexing, and transaction management to perform efficient and consistent database operations. | PO5 | C3, C6 |
| CO4 | Explain concurrency control, recovery mechanisms, database security, and emerging database technologies to ensure reliable and adaptable database systems. | PO11 | C2, C3, C4 |

---

## 3. Source Files — The Exact Inventory

The website is built from the `CSE_2205` folder. **The week-wise slides are in the root of the folder.** The notes are in `Notes/`.

### 3.1 Week-wise slides (root folder) — ALL must be attached

The file names are the source of truth for the week numbers. Some weeks have two decks, and Weeks 10 and 11 share one deck. Handle both cases.

| Week | Slide file (root folder) | Slides | Sections in the deck |
|---|---|---|---|
| 1 | `Week_1_Introduction_to_DBMS.pptx` | 9 | Overview · How data is structured · Keeping data valid · From idea to schema · Tier structures · ANSI-SPARC model · Who works with the database · Key takeaways |
| 2 | `Week_2_ER_Modeling_and_Schema_Design.pptx` | 9 | Modeling the real world · Properties of an entity · How entities connect · Building the diagram · ER diagram → relational tables · Mapping an M:N relationship · Modeling richer structures · Key takeaways |
| 3 (Deck A) | `Week_3_Relational_Algebra.pptx` | 8 | A procedural query language · Fundamental unary operators · Setting the stage for joins · Combining two relations · Combining related relations · Keeping the unmatched rows · Key takeaways |
| 3 (Deck B) | `Week_3_ER_Keys_Set_Operations_Joins.pptx` | 11 | Identifying a row uniquely · Keys that span or reference · One schema, every key · Union-compatible relations · Same two relations, three results · Joins: inner, outer, the rest of the family · From algebra to SQL |
| 4 | `Week_4_Database_Normalization.pptx` | 14 | The problem with one big table · Functional dependencies · 1NF · 2NF · 3NF · BCNF · Beyond BCNF (multivalued dependencies) · Testing a decomposition · Putting it together |
| 5 | `Week_5_SQL_Basics.pptx` | 11 | Introduction · DDL · DML · Querying · Relating data · Key takeaways |
| 6 | `Week_6_SQL_Advanced.pptx` | 11 | Aggregates (GROUP BY) · HAVING · Subqueries · UNION / combining outputs · Stored procedures · Functions · Triggers · Views · Materialized views · Key takeaways |
| 7 | `Week_7_Indexing_and_BTrees.pptx` | 18 | Why we index · Dense vs sparse · Ordered indices · Spatial & temporal indexing · B+ tree parts · Search · Insertion (worked problems) · Deletion (worked problems) · Try it yourself · Hashing · Wrap-up |
| 8 | `Week_8_Transactions_in_DBMS.pptx` | 33 | Transactions · ACID · Transaction states · Control commands · Savepoints · Serial vs concurrent schedules · Anomalies · Lost update · Conflict serializability · Precedence graph · View serializability · Recoverable schedules · Locks & 2PL · MVCC · Isolation levels · SELECT … FOR UPDATE · Write-ahead logging · Practice problems |
| 9 | `Week_9_Physical_Storage_Systems_and_RAID.pptx` | 9 | Physical storage systems · How files hold records · RAID · RAID 0 · RAID 1 · RAID 5 · Choosing the right level · Key takeaways |
| 10–11 | `Week_10_11_Concurrency_Deadlock_and_Recovery.pptx` | 24 | What is a deadlock · Three ways to handle deadlock · Wait-for graph · Deadlock recovery · Wait-Die vs Wound-Wait · Why a log · Log records · Deferred vs immediate modification · Redo/Undo rule · Checkpoints · Two-pass recovery · ARIES · Secure user authentication |
| 12 | `Week_12_Types of Databases.pptx` *(note: the file name contains a space)* | 13 | Why not one database · PostgreSQL (RDBMS) · NoSQL · MongoDB · Data warehouse · Google BigQuery · InfluxDB · Comparing the four · Four types of data analytics · Data analytics process · Key takeaways |
| 13 | `Week_13_Emerging_Topics.pptx` | 12 | Cryptography (secrets that stay secret) · Distributed databases · Database-as-a-Service · Read scaling (replication) · Snapshots · Data warehousing (a home for history) · Data to decisions · Data governance · The law meets the database · Key takeaways |
| 14 | *(no slide deck)* | — | **Revision & Wrap-up** page: an auto-generated summary of all weeks, a CO-wise checklist, and links to the previous-year questions |

### 3.2 Notes folder — ALL must be attached

| Note file (`Notes/`) | Pages | What it is | Link it to these weeks |
|---|---|---|---|
| `CSE_2205_Database_Basics_and_Normalization_Note.pdf` | 27 | Lecture note: DBMS vs file system, database design process, 3-tier architecture, through to normalization. **Scanned/handwritten, about 29 MB.** | Weeks 1, 4 |
| `CSE_2205_ER_Diagrams_Note.pdf` | 14 | ER teaching guide: core components, Chen notation legend, 10 worked scenarios (Library, Hospital, University, Company/Dependents, Bank, E-commerce, Airline, School, Food Delivery, Hotel) and a practice exercise | Week 2, Week 3 |
| `CSE_2205_SQL_Practice_Note.pdf` | 5 | SQL practice sheet with a `Department` / `Student` scenario | Weeks 5, 6 |
| `CSE_2205_Transactions_Note.pdf` | 6 | Transactions & conflict serializability: lecture note with solved problems and previous-year questions | Week 8 |
| `CSE_2205_Transactions_Practice_Note.pdf` | 6 | Scenario-based practice handout. Part A has the problems, Part B has the worked solutions. | Weeks 8, 10–11 |
| `CSE_2205_Previous_Years_Final_Questions.pdf` | 18 | Previous years' final exam questions (scanned) | **Exam Prep** page, and linked from every week |

### 3.3 Do NOT publish these

These are private or copyrighted. They must **not** be copied into the website:

- `Questions/` (CT-1 and mid-term papers, **answer rubric**)
- `Result/` (student marks: **private data**)
- `Documents/Level_2_Term_II_Seating_Arrangement.pdf`
- `Documents/database-system-concepts-7th-edition.pdf`. The textbook is copyrighted. Show it only as a citation with a link to the publisher's page.
- `Archive/` (old versions of the slides)
- `.DS_Store` files

`Documents/CSE_2205_Course Outline_Summer_2026.docx` is the source of Section 2. Read it, but do not link it unless the instructor asks.

---

## 4. Preparing the Files (do this first)

Browsers **cannot display `.pptx` files**. Do this:

1. **Convert every slide deck to PDF** with LibreOffice (free):
   ```bash
   soffice --headless --convert-to pdf --outdir site/assets/slides/pdf *.pptx
   ```
   Keep the original `.pptx` too, so students can download it.
2. **Rename to safe web names**: lowercase, hyphens, no spaces. For example:
   `Week_12_Types of Databases.pptx` → `week-12-types-of-databases.pptx` / `.pdf`.
3. **Generate a thumbnail** (the first slide as a `.webp`, about 640 px wide) for each deck and each note. The week cards use these:
   ```bash
   pdftoppm -f 1 -l 1 -r 60 -png input.pdf thumb && cwebp thumb-1.png -o thumb.webp
   ```
4. **Compress the large scanned PDF** (`Database_Basics_and_Normalization_Note.pdf`, about 29 MB). GitHub Pages and mobile data both suffer at that size:
   ```bash
   gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook -dNOPAUSE -dBATCH -sOutputFile=out.pdf in.pdf
   ```
   Target **under 8 MB**. Keep the original as the "full-quality download".
5. **Record each file's size and page count** in the data file (Section 6). The UI shows them ("PDF · 14 pages · 1.0 MB").
6. Write a small `scripts/prepare-assets.sh` that repeats steps 1 to 5. The instructor can rerun it when a deck changes.

### Target folder structure

```
site/
├── index.html
├── assets/
│   ├── slides/
│   │   ├── pptx/   week-01-introduction-to-dbms.pptx …
│   │   ├── pdf/    week-01-introduction-to-dbms.pdf …
│   │   └── thumbs/ week-01.webp …
│   ├── notes/
│   │   ├── pdf/    er-diagrams-note.pdf …
│   │   └── thumbs/
│   └── img/        logo, favicon, og-image
├── data/
│   └── course.js   ← single source of truth (Section 6)
├── css/  styles.css
├── js/   app.js, viewer.js, viz/*.js
└── scripts/prepare-assets.sh
```

---

## 5. Tech Stack

The instructor is not a full-time developer, so keep it **simple and dependency-light**:

- **Plain HTML + CSS + vanilla JavaScript (ES modules)**. No framework and no build step is required. If you prefer, **Vite** is acceptable, but the output must be a static folder.
- **Hash-based routing** (`#/week/7`, `#/notes`, `#/lab/btree`), so it works on GitHub Pages without server config.
- **PDF.js** (from cdnjs, pinned version) for the in-page slide and note viewer.
- **D3.js v7** (pinned) for graphs and trees in the visualizations.
- **sql.js** (SQLite compiled to WebAssembly, pinned) for the in-browser SQL Playground.
- **Fonts**: *Inter* or *Plus Jakarta Sans* for UI text, *JetBrains Mono* for code and SQL (Google Fonts).
- **Icons**: Lucide (inline SVG).
- **No tracking, no login, no backend.** Student progress is stored in `localStorage` only. Wrap every read and write in `try/catch`.

---

## 6. Single Source of Truth — `data/course.js`

All content comes from one data file, so the instructor can add a week or a note by editing one place. Use this shape:

```js
export const course = {
  code: "CSE 2205",
  title: "Database Management Systems",
  semester: "Summer 2026",
  instructor: { name: "Md. Rakib Trofder", email: "trofder@baust.edu.bd", room: "303 (C)",
                hours: ["Sun 10:50 AM – 1:20 PM", "Thu 10:50 AM – 1:20 PM"] },
  assessment: [ /* from Section 2 */ ],
  outcomes:   [ /* CO1–CO4 */ ],
  weeks: [
    {
      id: 7,
      label: "Week 7",
      title: "Indexing and B+ Trees",
      co: ["CO1", "CO3"],
      color: "teal",
      summary: "Why indexes exist, ordered vs hash indexes, and how a B+ tree stays balanced on insert and delete.",
      topics: ["Dense & sparse index", "Multi-level index", "B+ tree search", "Insertion & split", "Deletion & merge", "Static & dynamic hashing"],
      decks: [
        { title: "Indexing and B+ Trees", pdf: "assets/slides/pdf/week-07-indexing-and-btrees.pdf",
          pptx: "assets/slides/pptx/week-07-indexing-and-btrees.pptx",
          thumb: "assets/slides/thumbs/week-07.webp", slides: 18, size: "0.8 MB" }
      ],
      notes: [],                       // ids from the notes list
      labs: ["btree", "hashing"],      // ids of interactive visualizations
      keyTakeaways: [ /* 3–5 bullets taken from the deck's "Key takeaways" slide */ ],
      quiz: [ /* 5 MCQs: { q, options[], answer, explain } */ ],
      flashcards: [ /* { front, back } */ ]
    },
    // … one object per week (Weeks 3 and 10–11 have special handling, see below)
  ],
  notes: [
    { id: "er", title: "ER Diagrams: Teaching Guide with 10 Worked Scenarios",
      file: "assets/notes/pdf/er-diagrams-note.pdf", pages: 14, size: "1.0 MB",
      weeks: [2, 3], tags: ["ER", "Chen notation", "weak entity", "aggregation"] },
    // … all 6 notes
  ]
};
```

**Special cases:**
- **Week 3** has **two decks**. Show them as two tabs in the viewer: *"Relational Algebra"* and *"Keys, Set Operations & Joins"*.
- **Weeks 10 and 11** share **one deck**. Show one combined card labelled **"Week 10–11"** in the roadmap. Routes `#/week/10` and `#/week/11` both open it.
- **Week 14** has no deck. Show the Revision page.
- **Read each deck's text** (titles, bullets, and the "Key takeaways" slide) with `python-pptx` to fill `summary`, `topics` and `keyTakeaways`. **Write the quiz and flashcards from the slide content only.** Do not invent facts beyond the slides and the textbook's standard definitions.

---

## 7. Site Map and Pages

### 7.1 Home (`#/`)
- **Hero**: course code badge, title, semester, instructor, and a friendly line such as *"Everything you need for DBMS, week by week."*
- **Animated hero visual**: a small looping SVG of a table → index → B+ tree. Make it subtle and light, and pause it under `prefers-reduced-motion`.
- **"Continue where you left off"** card, from localStorage.
- **Quick stats**: 14 weeks · 13 slide decks · 6 notes · 20 interactive labs. Count up on first view.
- **Course progress ring**: the share of weeks the student has marked done.
- **Weekly roadmap preview**: the first 4 week cards and a "See full roadmap" link.
- **Quick links**: Notes library · Exam Prep · SQL Playground · Glossary.

### 7.2 Weekly Roadmap (`#/weeks`)
- A **vertical timeline** on mobile and a **winding path / metro-map** on desktop. Each stop is a week, colored by **topic cluster**:
  - **Foundations** (W1–W2): indigo
  - **Relational theory** (W3–W4): violet
  - **SQL** (W5–W6): blue
  - **Storage & indexing** (W7, W9): teal
  - **Transactions, concurrency & recovery** (W8, W10–11): amber
  - **Modern databases** (W12–W13): rose
  - **Revision** (W14): slate
- Each card shows: thumbnail, week number, title, CO chips, number of slides, linked notes count, a ✓ "Done" toggle, and a mini progress dot.
- **Filters**: by CO (CO1–CO4), by cluster, "Not done yet".

### 7.3 Week Detail (`#/week/:id`)
Layout: a **sticky left sidebar** (week list, collapses into a drawer on mobile) and a main column with:
1. **Header**: "Week 7 · Indexing and B+ Trees", CO chips, cluster color strip, prev/next week arrows.
2. **Slide Viewer** (PDF.js):
   - Large page view, page thumbnails strip, page x / y, zoom, **full-screen / presentation mode**, keyboard ←/→.
   - Buttons: **Download PPTX** · **Download PDF** · **Open in new tab**.
   - Lazy-load: render only when scrolled into view, and show a skeleton loader.
   - On phones, start in fit-to-width and allow swipe between pages.
3. **What you'll learn**: topic chips.
4. **Key takeaways**: 3–5 cards.
5. **Interactive Lab(s)** for this week, embedded inline (see Section 8).
6. **Related notes**: note cards with thumbnail, pages, size, View / Download.
7. **Check yourself**: a 5-question MCQ quiz with instant feedback and an explanation. The score is saved locally.
8. **Flashcards**: flip cards for key terms.
9. **Previous-year questions on this topic**: a link into the Exam Prep page, filtered to this week.
10. **Mark week as done** button.

### 7.4 Notes Library (`#/notes`)
- A grid of all **6 notes** with thumbnail, title, page count, file size, week chips and tags.
- Search and filter by week or tag.
- Clicking a note opens the same PDF.js viewer in a modal / full page, with Download.
- The large scanned note shows a badge: *"Scanned note · light version shown · download full quality"*.

### 7.5 Interactive Labs (`#/labs`)
A gallery of all visualizations from Section 8. Each card has a short animated preview and a "Week X" chip. Each lab also has its own route (`#/lab/btree`).

### 7.6 Exam Prep (`#/exam`)
- Embeds `CSE_2205_Previous_Years_Final_Questions.pdf` in the viewer.
- A **topic → week mapping table** that the instructor fills in later (leave a clear `TODO` structure in `course.js`: `{ year, questionNo, topic, week }`).
- An **exam-weight reminder**: Final = 60%. A "Most-asked topics" bar chart, driven by the mapping table once it is filled.
- Links to the two transaction practice notes, which include worked solutions.
- A **study-plan generator**: the student picks the exam date, and the site spreads the unfinished weeks across the remaining days.

### 7.7 Glossary (`#/glossary`)
An A–Z list of 60+ DBMS terms (entity, weak entity, superkey, candidate key, FD, closure, BCNF, MVD, σ, π, ⋈, ACID, schedule, conflict serializable, 2PL, MVCC, WAL, ARIES, checkpoint, B+ tree, RAID 5, NoSQL, data warehouse, …). Each term has a one-line definition and a "Learn in Week X" link. Include live search.

### 7.8 Course Info (`#/about`)
Course facts, instructor card with email and counselling hours, the assessment donut chart, the CO table, the references, and the weekly plan table.

---

## 8. Smart Visualizations (the heart of the site)

Every lab must: work with **mouse, touch and keyboard**; have **Play / Step / Back / Reset** controls; show a **plain-language caption** for every step ("Node is full → split and push 17 up"); use the **theme color tokens**, so it looks right in both light and dark mode; and respect `prefers-reduced-motion`.

| # | Lab | Week | What the student does and sees |
|---|---|---|---|
| 1 | **3-Tier & ANSI-SPARC Explorer** | 1 | Click a layer (External / Conceptual / Internal, or Client / App / DB). It highlights and explains data independence with an animated request flow. |
| 2 | **ER → Tables Mapper** | 2 | Pick one of the scenarios from the ER note (Library, Hospital, University, Bank…). See the Chen-notation ER diagram, press "Map", and watch entities turn into tables and an M:N relationship become a junction table with FKs. |
| 3 | **Relational Algebra Animator** | 3 | Two small relations. Choose σ, π, ∪, ∩, −, ×, ⋈, ⟕, ⟖, ⟗. Rows animate into the result and the equivalent SQL is shown beside it. |
| 4 | **Join Visualizer** | 3 | A Venn diagram and the actual result table side by side for INNER / LEFT / RIGHT / FULL joins. NULL-padded cells glow. |
| 5 | **Keys Finder** | 3 | Enter a relation and FDs. It lists superkeys, candidate keys and the primary key, with attribute closure computed step by step. |
| 6 | **Normalization Stepper** | 4 | Start from "one big table". Step through 0NF → 1NF → 2NF → 3NF → BCNF. Each step highlights the violating dependency, then splits the table. A lossless-join check is shown at the end. |
| 7 | **SQL Playground** | 5, 6 | In-browser SQLite (sql.js), preloaded with the **`Department` / `Student` tables from `CSE_2205_SQL_Practice_Note.pdf`**. Includes an editor with syntax highlighting, a Run button (Ctrl+Enter), a results table, an "Example queries" dropdown (SELECT/WHERE/LIKE/JOIN/GROUP BY/HAVING/subquery/UNION/VIEW), and a "Reset database" button. |
| 8 | **GROUP BY / HAVING Animator** | 6 | Rows slide into colored groups, aggregates compute, and HAVING fades out the groups that fail. |
| 9 | **B+ Tree Lab** | 7 | Choose the order (n = 3, 4, 5). Insert and delete keys, or load the **worked problems from the Week 7 slides**. Animate split, push-up, borrow and merge. Search shows the path taken. Includes a "Random 10 keys" button. |
| 10 | **Hashing Lab** | 7 | Static hashing with overflow chains, and extendable hashing with global/local depth and bucket splits. |
| 11 | **RAID Simulator** | 9 | Pick RAID 0 / 1 / 5. Blocks are striped or mirrored across disks, and parity is shown for RAID 5. "Fail a disk" shows the data lost (RAID 0) or rebuilt via XOR (RAID 5). Includes a capacity / speed / fault-tolerance comparison bar. |
| 12 | **ACID & Transaction States** | 8 | An interactive state diagram (Active → Partially committed → Committed / Failed → Aborted) driven by a bank-transfer example. |
| 13 | **Schedule → Precedence Graph** | 8 | Type or pick a schedule (e.g. `R1(A) W1(A) R2(A) W2(A) R1(B) W1(B)`). The site lists conflicting pairs, draws the precedence graph with D3, detects a cycle (cycle edges in red), and gives the verdict *Conflict serializable? Yes/No*, plus an equivalent serial order. Preload the problems from the **Transactions Note** and **Practice Note**. |
| 14 | **Lost-Update / Anomaly Replayer** | 8 | Step through an interleaved schedule and watch the values of A and B change. Compare it with the serial result (use Problem 1 of the Practice Note: A = 1000, B = 2000, transfer + 10% interest). |
| 15 | **2PL & Isolation Levels** | 8 | A timeline of lock acquire/release showing the growing and shrinking phases. An isolation-level toggle shows which anomalies (dirty read, non-repeatable read, phantom) are possible. |
| 16 | **Wait-For Graph & Deadlock** | 10–11 | Step through lock requests. The wait-for graph builds live, the cycle is highlighted, and a victim is chosen. A Wait-Die vs Wound-Wait toggle shows who waits and who is rolled back. |
| 17 | **Log-Based Recovery Stepper** | 10–11 | Show a log with a checkpoint and a crash point. **Redo pass** scans forward, then **Undo pass** scans backward, with a final values table and the new log records. Includes an ARIES mode with Analysis / Redo / Undo. |
| 18 | **Database Types Compass** | 12 | Compare PostgreSQL, MongoDB, BigQuery and InfluxDB on a radar chart (schema flexibility, scale, analytics, time-series, consistency), plus a "Which DB for this use case?" quiz. |
| 19 | **Data Analytics Ladder** | 12–13 | Descriptive → Diagnostic → Predictive → Prescriptive as a clickable staircase with examples. |
| 20 | **Encryption & Replication Demo** | 13 | A toy symmetric-key encryption of a table cell, and a primary → replicas diagram for read scaling. |

> **Priority if time is short:** build **#7 SQL Playground, #9 B+ Tree, #13 Precedence Graph, #6 Normalization, #4 Join, #17 Recovery** first. These are the most exam-relevant.

---

## 9. Visual Design System

### 9.1 Overall feel
Clean, modern and calm, like a premium study app (think Notion, Linear and Brilliant.org). Use generous white space, soft rounded cards (radius 16 px), subtle shadows, and color used **meaningfully** for topic clusters, not decoration.

### 9.2 Theme tokens (CSS custom properties)

**Light mode (default)**
```css
:root {
  --bg: #F8FAFC;          --surface: #FFFFFF;     --surface-2: #F1F5F9;
  --text: #0F172A;        --text-muted: #475569;  --border: #E2E8F0;
  --primary: #4F46E5;     --primary-soft: #EEF2FF;
  --accent: #0EA5E9;      --success: #16A34A;     --warning: #D97706;  --danger: #DC2626;
  --c-foundations: #6366F1; --c-relational: #8B5CF6; --c-sql: #3B82F6;
  --c-storage: #14B8A6;     --c-txn: #F59E0B;        --c-modern: #F43F5E; --c-revision: #64748B;
  --shadow: 0 1px 2px rgba(15,23,42,.06), 0 8px 24px rgba(15,23,42,.06);
  --radius: 16px;
}
```

**Dark mode**
```css
:root[data-theme="dark"] {
  --bg: #0B1120;          --surface: #111827;     --surface-2: #1F2937;
  --text: #E5E7EB;        --text-muted: #9CA3AF;  --border: #273244;
  --primary: #818CF8;     --primary-soft: #1E1B4B;
  --shadow: 0 1px 2px rgba(0,0,0,.4), 0 8px 24px rgba(0,0,0,.35);
}
```

### 9.3 Theme toggle rules
- **Light mode is the default** on first visit, even if the operating system is dark.
- A sun/moon toggle sits in the top bar. The choice is saved in `localStorage` (`cse2205-theme`).
- Apply the theme **before first paint** (a tiny inline script in `<head>`), so there is no flash.
- The theme crossfades smoothly (200 ms). All visualizations, charts and code blocks follow the theme.
- The PDF viewer page stays white (slides are designed on light backgrounds). Only the frame around it changes.

### 9.4 Typography
- Headings: *Plus Jakarta Sans* 700, tight letter-spacing.
- Body: *Inter* 400/500, 16–17 px, line-height 1.65.
- Code/SQL: *JetBrains Mono*.
- Math and relational-algebra symbols (σ π ⋈ ∪ ∩ −) render clearly. Use KaTeX if needed.

### 9.5 Components
Top navigation bar (logo "CSE 2205 · DBMS", links, search, theme toggle) · sticky week sidebar · week cards · CO chips · cluster color strip · note cards · PDF viewer · tabs · accordion · quiz card · flip card · toast · progress ring · breadcrumb · footer (course, instructor email, "Built for BAUST CSE students").

### 9.6 Motion
Small and purposeful: card hover lift (2 px), page fade/slide (150–250 ms), visualization steps (400–600 ms, adjustable speed slider). Disable non-essential motion under `prefers-reduced-motion`.

---

## 10. Student-Friendly Features

- **Global search (Ctrl/⌘ + K)**: a command palette that searches week titles, topics, glossary terms, note titles and lab names.
- **Progress tracking**: mark weeks done, quiz best scores and last-opened page per deck. Everything is stored locally, and a **"Reset my progress"** button is in the footer.
- **Bookmarks**: star any slide page ("Week 7, page 11"). The bookmarks are listed in a drawer.
- **Resume reading**: reopening a deck jumps to the last page viewed.
- **Exam countdown** widget on Home (the date is set in `course.js`).
- **Print-friendly** week pages (hide navigation, expand all sections).
- **Shareable deep links** to a week, a lab, or a specific slide page (`#/week/8?page=14`).
- **Offline-friendly (optional, nice-to-have)**: a service worker that caches the HTML/CSS/JS and the PDFs a student has opened.

---

## 11. Accessibility, Performance and Quality

- WCAG 2.1 AA contrast in **both** themes. Visible focus rings. Full keyboard navigation. ARIA labels on icon buttons. Every visualization has a text caption describing the current step.
- Responsive breakpoints: 360 px, 768 px, 1024 px and 1440 px. **No horizontal scroll on phones.**
- Lazy-load PDFs, thumbnails and lab scripts. Do not download a deck until the student opens that week.
- Lighthouse targets: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95 (mobile).
- Pin every CDN library to an exact version.
- Add a favicon, a page `<title>` per route, and Open Graph tags (title + preview image) so links look good when shared in Messenger or WhatsApp groups.

---

## 12. Build Order

1. Run `scripts/prepare-assets.sh`: convert, rename, thumbnail and compress (Section 4).
2. Write `data/course.js` from the slides and notes (Section 6). Extract the text with `python-pptx`.
3. Build the layout shell, the theme system and the router.
4. Build Home, Weekly Roadmap and Week Detail with the PDF viewer.
5. Build the Notes Library and Exam Prep.
6. Build the priority labs (#7, #9, #13, #6, #4, #17), then the rest.
7. Add quizzes, flashcards, glossary, search and progress.
8. Test on a phone-sized screen in both themes, then deploy to GitHub Pages.
9. Write a short `README.md`: how to add a new week or note, how to rerun asset preparation, and how to deploy.

---

## 13. Acceptance Checklist

- [ ] All **13 slide decks** from the root folder are attached, viewable in the browser, and downloadable as PPTX and PDF.
- [ ] Week 3 shows **two** decks as tabs. Weeks 10 and 11 share **one** deck. Week 14 is a Revision page.
- [ ] All **6 notes** from `Notes/` are attached, viewable, downloadable, and linked from the correct weeks.
- [ ] No file from `Questions/`, `Result/`, `Archive/`, the seating arrangement or the textbook PDF is published.
- [ ] Light mode is the default. Dark mode toggles, persists, and has no flash on load.
- [ ] Every lab works with touch, has step controls and captions, and looks correct in both themes.
- [ ] The SQL Playground runs queries on the Department/Student practice tables.
- [ ] The B+ tree, precedence graph and recovery labs reproduce the worked examples from the slides and notes.
- [ ] The site works at 360 px wide with no horizontal scrolling.
- [ ] All content comes from `data/course.js`. Adding a week takes one entry plus one file.
- [ ] Deployed and reachable by a public URL.

---

## 14. Open Items for the Instructor (fill in if you want; sensible defaults are used otherwise)

| Item | Default if left blank |
|---|---|
| Site name / logo | "CSE 2205 · DBMS Study Hub" with a simple database-cylinder logo |
| BAUST branding (logo, maroon/blue colors) | Neutral indigo theme above. Swap `--primary` if you want BAUST colors. |
| Final exam date (for the countdown and study plan) | Hidden until set in `course.js` |
| Previous-year question → week mapping | An empty table structure, ready to fill |
| Language of UI | English, with Bangla-friendly font fallback (*Hind Siliguri*) |
| Hosting | GitHub Pages |
| Show instructor phone number | No (email and room only) |
