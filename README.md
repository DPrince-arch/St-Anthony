# St. Anthony Catholic Church - Parish PWA & Liturgical Portal

A comprehensive, mobile-first Progressive Web Application (PWA) designed for **St. Anthony Catholic Church**. It serves parishioners with daily liturgical readings, traditional prayers, Mass intentions and priest appointment bookings with bank receipt verification, parish announcements, and a full administrative management portal for the parish secretariat and priests.

---

## 🌟 Key Features

### 1. 📖 Daily Liturgical Readings
- **Liturgical Calendar**: Loads the General Roman Calendar's season, liturgical color, rank, and celebration from a community-maintained calendar API.
- **Daily Scripture Text**: Loads the day's reading citations and full text in the public-domain World English Bible translation.
- **Regional limitation**: These sources are not integrated with the Nigerian Catholic calendar. Local Nigerian diocesan observances may differ; verify celebrations with the diocesan Ordo.
- **Audio Read-Aloud**: Built-in speech synthesizer reads the scripture texts.

### 2. 🙏 Catholic Prayers & Devotions
- **The Most Holy Rosary**:
  - Auto-selects mystery based on today's day of the week (*Joyful, Sorrowful, Glorious, Luminous*).
  - Interactive virtual decade bead counter (10 Hail Marys per decade with visual tracking).
  - Scripture citations and spiritual fruit for each decade.
- **Litanies**:
  - *The Litany of the Saints*
  - *Litany of Saint Anthony of Padua* (Parish Patron)
  - *Litany of Loreto* (Blessed Virgin Mary)
- **Traditional Devotions**:
  - *The Chaplet of Divine Mercy*
  - *The Angelus*
  - *Prayer to St. Michael the Archangel*, *Anima Christi*, *The Memorare*, *Act of Contrition*.

### 3. ✍️ Mass Bookings & Priest Appointments
- **Official Parish Bank Account Display**: Prominently displays the church bank name, account name, and account number with a 1-click **Copy Account Number** button.
- **Receipt Upload**: Parishioners easily upload their bank transfer screenshot/receipt (PNG, JPG, WebP) directly within the booking form.
- **Types of Bookings**:
  - *Mass Intentions* (Thanksgiving, Repose of the Soul RIP, Birthday, Healing, Anniversary, Special Intention)
  - *Thanksgiving Offerings*
  - *Appointments with Priests* (Confession, Spiritual Direction, Marriage/Family Counseling, Sick Call)
- **Instant Reference Slip**: Automatically generates a unique booking code (e.g. `STA-MASS-8921`).

### 4. 📢 Parish Announcements & Bulletin
- Categorized notices: **Urgent**, **Liturgy & Feasts**, **Societies & Youth**, and **General**.
- Pinned high-priority parish alerts.
- Keyword search and 1-click notice sharing.

### 5. 🔐 Parish Staff Admin Portal
- **Secure Access**: Passcode-protected (default: `anthony2025`).
- **Bookings & Stipend Verification**:
  - Summary metrics of pending, approved, and completed bookings.
  - **Full-Resolution Receipt Lightbox**: Inspect parishioner transfer receipts on screen to verify payments before approving.
  - One-click *Approve & Verify Stipend*, *Reject*, or *Mark Completed*.
- **Print Altar Sheet**:
  - Select any date and Mass time to generate a print-ready list of confirmed Mass intentions for Father to place on the altar.
- **Announcements Editor**:
  - Type out, schedule, pin, and publish announcements directly to the parish feed.
- **Parish Bank Configuration**:
  - Update bank details, account number, and instructions anytime without editing code.

---

## 🚀 Running the App Locally

### Persistent Bookings & Receipt Storage

Bookings and receipt images use Supabase. Create a Supabase project, run
[`supabase/migrations/20261115000000_create_bookings.sql`](./supabase/migrations/20261115000000_create_bookings.sql)
in its SQL editor, and set the server-only credentials in `.env.local`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Keep the service-role key private and never expose it with a `NEXT_PUBLIC_` prefix.

```bash
# Navigate to project directory
cd st_anthony_app

# Start the application server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your mobile or desktop browser.

### Development Mode
```bash
npm run dev
```

---

## 🔑 Default Admin Credentials
- **Admin Portal Passcode**: `anthony2025`
