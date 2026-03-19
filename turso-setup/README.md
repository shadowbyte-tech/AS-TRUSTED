# AS Trusted Consultancy — Turso Database Setup

## Step 1: Create Your Turso Database (5 minutes)

1. Go to https://turso.tech and sign up (free)
2. Install Turso CLI:
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```
3. Login and create your database:
   ```bash
   turso auth login
   turso db create as-trusted-db
   turso db show as-trusted-db       # copy the URL
   turso db tokens create as-trusted-db  # copy the token
   ```

## Step 2: Add Environment Variables

Add to your `.env.local`:
```env
TURSO_DATABASE_URL=libsql://as-trusted-db-<your-name>.turso.io
TURSO_AUTH_TOKEN=your-token-here
ADMIN_SECRET=choose-a-strong-password-here
```

## Step 3: Install Dependencies

```bash
npm install @libsql/client
```

## Step 4: Run the Schema

```bash
turso db shell as-trusted-db < schema.sql
```

Or paste schema.sql contents into:
```bash
turso db shell as-trusted-db
```

## Step 5: Copy Files

```
src/
├── lib/
│   └── db.ts                        ← Database client + all queries
├── app/
│   ├── api/
│   │   ├── plots/
│   │   │   ├── route.ts             ← GET all plots, POST new plot
│   │   │   └── [id]/route.ts        ← GET, PUT, DELETE single plot
│   │   ├── users/
│   │   │   ├── route.ts             ← GET all users, POST new user
│   │   │   └── [id]/route.ts        ← GET, PUT single user
│   │   └── site-visits/
│   │       └── route.ts             ← POST site visit booking
│   └── admin/
│       └── page.tsx                 ← Full admin dashboard UI
```

## What's In The Database

| Table        | Stores                                      |
|--------------|---------------------------------------------|
| `users`      | All registered users, premium status, prefs |
| `plots`      | All land listings, price, location, status  |
| `inquiries`  | User inquiries on specific plots            |
| `site_visits`| Booked site visit requests                  |
| `saves`      | User saved/wishlisted plots                 |
