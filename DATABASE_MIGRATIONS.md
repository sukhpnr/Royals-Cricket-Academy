# Database Migrations & Setup Guide

## 🗄️ Database Schema Setup

Run these SQL queries in Supabase SQL Editor to create all necessary tables for Royals Cricket Academy.

### Step 1: Create Players Table

```sql
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  jersey_number INT UNIQUE,
  role VARCHAR(50), -- batsman, bowler, all-rounder, wicket-keeper
  age INT,
  batting_style VARCHAR(50), -- right-handed, left-handed
  bowling_style VARCHAR(50), -- right-arm, left-arm
  height_cm INT,
  weight_kg INT,
  hometown VARCHAR(255),
  country VARCHAR(255) DEFAULT 'India',
  status VARCHAR(50) DEFAULT 'active', -- active, inactive, retired
  joining_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_players_email ON players(email);
CREATE INDEX idx_players_status ON players(status);
```

### Step 2: Create Training Sessions Table

```sql
CREATE TABLE training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  session_type VARCHAR(50), -- batting, bowling, fielding, fitness
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location VARCHAR(255),
  coach_name VARCHAR(255),
  coach_email VARCHAR(255),
  max_players INT,
  created_by UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_training_sessions_date ON training_sessions(date);
CREATE INDEX idx_training_sessions_type ON training_sessions(session_type);
```

### Step 3: Create Performance Stats Table

```sql
CREATE TABLE performance_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  runs_scored INT DEFAULT 0,
  wickets_taken INT DEFAULT 0,
  catches INT DEFAULT 0,
  matches_played INT DEFAULT 0,
  centuries INT DEFAULT 0,
  half_centuries INT DEFAULT 50,
  ducks INT DEFAULT 0,
  batting_average DECIMAL(5,2) DEFAULT 0,
  bowling_average DECIMAL(5,2) DEFAULT 0,
  highest_score INT DEFAULT 0,
  session_id UUID REFERENCES training_sessions(id) ON DELETE SET NULL,
  notes TEXT,
  recorded_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_performance_stats_player ON performance_stats(player_id);
CREATE INDEX idx_performance_stats_session ON performance_stats(session_id);
```

### Step 4: Create Users/Admin Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'viewer', -- admin, coach, player, viewer
  name VARCHAR(255),
  phone VARCHAR(20),
  profile_picture_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### Step 5: Create Attendance Table

```sql
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  training_session_id UUID NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
  status VARCHAR(50), -- present, absent, late
  arrival_time TIME,
  performance_rating INT, -- 1-5 scale
  notes TEXT,
  marked_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_attendance_player ON attendance(player_id);
CREATE INDEX idx_attendance_session ON attendance(training_session_id);
```

### Step 6: Create Registration Receipts Table

```sql
CREATE TABLE registration_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  receipt_number VARCHAR(50) UNIQUE,
  registration_date DATE NOT NULL,
  academy_name VARCHAR(255),
  category VARCHAR(50), -- junior, senior, professional
  registration_fee DECIMAL(10,2),
  payment_method VARCHAR(50),
  transaction_id VARCHAR(100),
  status VARCHAR(50) DEFAULT 'confirmed', -- confirmed, pending, cancelled
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_receipts_player ON registration_receipts(player_id);
CREATE INDEX idx_receipts_status ON registration_receipts(status);
```

---

## 📝 How to Use These Queries

1. Go to **Supabase Dashboard**
2. Click on **"SQL Editor"** (left sidebar)
3. Click **"New Query"**
4. Copy and paste each SQL block above
5. Click **"Run"** button
6. Repeat for all 6 tables

---

## 🔐 Enable Row Level Security (RLS)

After creating tables, enable RLS for security:

```sql
-- Enable RLS on all tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_receipts ENABLE ROW LEVEL SECURITY;

-- Create basic policies (adjust based on your needs)
CREATE POLICY "Players are viewable by authenticated users"
  ON players FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can update players"
  ON players FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
```

---

## ✅ Verification

After creating tables, verify in Supabase:

1. Go to **"Database"** → **"Tables"**
2. You should see 6 new tables:
   - `players`
   - `training_sessions`
   - `performance_stats`
   - `users`
   - `attendance`
   - `registration_receipts`

---

## 🚀 Next Steps

1. Set up your `.env.local` file with DATABASE_URL
2. Configure Vercel environment variables
3. Deploy to Vercel
4. Start using the API!

