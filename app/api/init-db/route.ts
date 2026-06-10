import { NextResponse } from 'next/server';

const initSQL = `
-- Create enums
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin');
CREATE TYPE appointment_status AS ENUM ('pending', 'approved', 'rejected', 'completed', 'cancelled');
CREATE TYPE specialty AS ENUM (
  'cardiology',
  'neurology',
  'orthopedics',
  'dermatology',
  'ophthalmology',
  'otolaryngology',
  'gastroenterology',
  'pulmonology',
  'nephrology',
  'rheumatology',
  'endocrinology',
  'psychiatry',
  'general_medicine',
  'surgery',
  'pediatrics',
  'obstetrics_gynecology'
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  email TEXT,
  password TEXT,
  role user_role NOT NULL,
  full_name TEXT,
  profile_picture TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create doctor profiles table
CREATE TABLE IF NOT EXISTS doctor_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  specialization specialty NOT NULL,
  license_number TEXT UNIQUE NOT NULL,
  years_of_experience INTEGER,
  qualifications TEXT,
  consultation_fee DECIMAL(10, 2),
  bio TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create patient profiles table
CREATE TABLE IF NOT EXISTS patient_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date_of_birth TIMESTAMP,
  gender TEXT,
  blood_group TEXT,
  allergies TEXT,
  medical_history TEXT,
  phone_number TEXT,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create specialties table
CREATE TABLE IF NOT EXISTS specialties (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  appointment_date TIMESTAMP NOT NULL,
  reason TEXT,
  symptoms TEXT,
  allergies TEXT,
  blood_group TEXT,
  description TEXT,
  status appointment_status DEFAULT 'pending',
  consultation_fee DECIMAL(10, 2),
  payment_tx_hash TEXT,
  payment_status BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create organ donation forms table
CREATE TABLE IF NOT EXISTS organ_donation_forms (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  organs TEXT NOT NULL,
  blood_type TEXT NOT NULL,
  medical_conditions TEXT,
  family_consent BOOLEAN DEFAULT false,
  date_of_submission TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payment transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id SERIAL PRIMARY KEY,
  appointment_id INTEGER NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  patient_wallet_address TEXT NOT NULL,
  doctor_wallet_address TEXT NOT NULL,
  amount DECIMAL(18, 8) NOT NULL,
  transaction_hash TEXT UNIQUE,
  status TEXT DEFAULT 'pending',
  network_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_doctor_profiles_user ON doctor_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_patient_profiles_user ON patient_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_organ_donations_patient ON organ_donation_forms(patient_id);

-- Insert default specialties
INSERT INTO specialties (name, description) VALUES
  ('Cardiology', 'Heart and cardiovascular system specialist'),
  ('Neurology', 'Brain and nervous system specialist'),
  ('Orthopedics', 'Bone and joint specialist'),
  ('Dermatology', 'Skin specialist'),
  ('Pediatrics', 'Children specialist'),
  ('Psychiatry', 'Mental health specialist'),
  ('Oncology', 'Cancer specialist'),
  ('Gastroenterology', 'Digestive system specialist'),
  ('Pulmonology', 'Lung and respiratory specialist'),
  ('Gynecology', 'Women health specialist'),
  ('Urology', 'Urinary system specialist'),
  ('Ophthalmology', 'Eye specialist'),
  ('ENT', 'Ear, Nose and Throat specialist'),
  ('General Medicine', 'General health and wellness'),
  ('Surgery', 'Surgical procedures specialist'),
  ('Dentistry', 'Dental care specialist')
ON CONFLICT (name) DO NOTHING;
`;

export async function POST(request: Request) {
  try {
    const { key } = await request.json();

    // Simple security check
    if (key !== process.env.INIT_DB_KEY && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Import postgres dynamically
    const postgres = await import('postgres');
    const sql = postgres.default;

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'DATABASE_URL not configured' },
        { status: 500 }
      );
    }

    const db = sql(process.env.DATABASE_URL);

    console.log('[v0] Running database initialization...');

    // Execute all SQL statements
    const statements = initSQL.split(';').filter((stmt) => stmt.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await db.unsafe(statement.trim());
        } catch (err) {
          const error = err as any;
          // Ignore "already exists" errors
          if (!error.message?.includes('already exists')) {
            console.error('[v0] SQL Error:', error.message);
          }
        }
      }
    }

    console.log('[v0] Database initialization completed successfully!');

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
    });
  } catch (error) {
    console.error('[v0] Init DB Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Initialization failed' },
      { status: 500 }
    );
  }
}
