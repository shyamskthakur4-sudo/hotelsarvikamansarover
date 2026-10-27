# Hotel Sarvika Mansarover — Official Luxury Website

A bespoke, high-performance, multi-page website built for **Hotel Sarvika Mansarover**, Jaipur. Handcrafted with an editorial luxury aesthetic (No Dark Theme, No AI look), modern 3D spatial scroll effects, interactive tariff calculator, 1-click WhatsApp booking engine, and complete 26-photo interactive gallery.

---

## 📍 Property Information & Verified Client Coordinates

| Field | Detail |
| :--- | :--- |
| **Property Name** | **Hotel Sarvika Mansarover** |
| **Address** | B-3 Mangyawas Road, Monika Vihar, Mansarover, Jaipur, Rajasthan 302020 |
| **Deluxe Room Tariff** | **₹1,500 / night** (+ 12% GST) |
| **Premium Room Tariff** | **₹2,000 / night** (+ 12% GST) |
| **Direct Phone (WhatsApp)** | **+91 8769311980** |
| **Alternative Number** | **+91 8104848257** |
| **Official Email** | **hotelsarvikamansrovar@gmail.com** |
| **GST Registration** | **08AVIPY2486M1ZL** |
| **Attached Dining** | Parmpara Restaurant & Cafe (Pure Veg & Take Away) |
| **House Policies** | Check-in: 12:00 PM \| Check-out: 11:00 AM \| 2 Adults Max per room \| Original Govt ID Mandatory |

---

## 🎨 Design Philosophy & UX Architecture

- **Human-Crafted Editorial Luxury (Strictly No Dark Theme & No AI Look)**:
  - Curated palette: Travertine Sand (`#FAF7F2`), Warm Alabaster (`#F5EFE6`), Royal Rajasthani Gold (`#9A783E`), and Onyx Charcoal (`#1A1816`).
  - High-contrast editorial typography using *Playfair Display*, *Cormorant Garamond*, and *Plus Jakarta Sans*.
- **3D Spatial Scroll Engine (`assets/js/3d-scroll.js`)**:
  - Mouse-driven perspective depth on the 3D Hero stage.
  - Interactive 3D room card tilt with dynamic specular glare reflections tracking the cursor.
  - Lerped scroll progress indicator and scroll-driven layer reveal.
- **Direct Reservation Engine (`assets/js/main.js`)**:
  - Live tariff calculator with 12% hotel GST tier breakdown.
  - 1-Click WhatsApp booking engine prefilling check-in, check-out, room category, and guest counts.
  - Lightbox modal supporting all 26 high-resolution photos.

---

## 📂 Multi-Page Project Structure

```
hotelsarvikamansarover/
├── index.html            # Main Landing: 3D Hero, Booking Bar, Rooms, Amenities, City Guide
├── rooms.html            # Accommodations: Deluxe (₹1500) vs Premium (₹2000), Romance Setup, Comparison Table
├── gallery.html          # Visual Gallery: 26 original DSLR photos with filter tabs & lightbox modal
├── amenities.html        # Services: Parmpara Pure Veg Restaurant, Smart TV, Wi-Fi, Ensuite Bathrooms
├── location.html         # Jaipur Guide: Transit distances (Metro 1.8km, Airport 11km), Google Maps embed
├── contact.html          # Contact & Inquiries: Direct booking form, GST billing fields, telephone links
├── Start-Server.bat      # One-click Windows launcher (starts local server & opens browser)
├── serve.ps1             # Native high-performance local TCP web server script
├── assets/
│   ├── css/
│   │   └── style.css     # Bespoke luxury design system & responsive layout stylesheet
│   ├── js/
│   │   ├── main.js       # Core application logic, tariff calculator, WhatsApp formatter, modal
│   │   └── 3d-scroll.js  # 3D spatial depth physics, card tilt, and scroll parallax
│   └── images/
│       ├── logo.svg      # Minimalist vector architectural Jharokha arch + 'S' monogram
│       ├── favicon.svg   # Scalable browser favicon
│       └── web/          # 26 web-optimized high-resolution hotel photographs (~200KB-300KB each)
```

---

## 🚀 Running Locally

### Option 1: One-Click Launcher (Windows)
Double-click `Start-Server.bat` in the project folder. It will start the server and automatically open your default browser to `http://localhost:3000/`.

### Option 2: PowerShell Terminal
In PowerShell inside the project directory, run:
```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```
Open **[http://localhost:3000/](http://localhost:3000/)** in your browser.

---

## 🌐 Production Deployment
Since this website is built with pure, modern, semantic web standards (HTML5, Vanilla CSS3, modern ES6+ JS), it has zero server-side build steps or runtime dependencies. It can be hosted immediately on:
- **Cloudflare Pages** (drag & drop the project folder)
- **Netlify / Vercel** (connect GitHub repo or CLI deploy)
- **GitHub Pages** (enable in repository settings)
- **Any Apache / Nginx / cPanel web host** (upload files directly to `public_html`)
