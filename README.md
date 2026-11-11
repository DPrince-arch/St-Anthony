# St. Anthony Catholic Church - Parish PWA & Liturgical Portal

A comprehensive, mobile-first Progressive Web Application (PWA) designed for **St. Anthony Catholic Church**. It serves parishioners with daily liturgical readings, traditional prayers, Mass intentions and priest appointment bookings with bank receipt verification, parish announcements, and a full administrative management portal for the parish secretariat and priests.

---

## 🌟 Key Features

### 1. 📖 Daily Liturgical Readings
- **Liturgical Calendar Engine**: Dynamically calculates season (*Advent, Christmas, Lent, Easter, Ordinary Time*), liturgical color (*Green, Violet, White, Red, Rose*), rank (*Solemnity, Feast, Memorial, Weekday*), and saint/commemoration of the day.
- **Complete Lectionary Text**: First Reading, Responsorial Psalm with alternating strophes, Second Reading, Gospel Acclamation, and Holy Gospel.
- **Audio Read-Aloud**: Built-in speech synthesizer allowing parishioners to listen to the scripture readings.
- **Pastoral Reflection**: Daily homily meditation snippet from the Parish Priest.
- **Offline Reliability**: 100% offline capable with local liturgical calendar cache.

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
