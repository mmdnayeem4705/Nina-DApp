import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db/schema';

async function migrate() {
  console.log('[v0] Starting database migration...');

  try {
    const queryClient = postgres(process.env.DATABASE_URL!);
    const db = drizzle(queryClient, { schema });

    // Create tables using raw SQL
    const migrationSQL = `
      -- Drop existing types if they exist (for clean slate)
      DROP TYPE IF EXISTS user_role CASCADE;
      DROP TYPE IF EXISTS appointment_status CASCADE;
      DROP TYPE IF EXISTS specialty CASCADE;

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

      -- Users table
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

      -- Doctor Profiles table
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

      -- Patient Profiles table
      CREATE TABLE IF NOT EXISTS patient_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        date_of_birth TIMESTAMP,
        gender TEXT,
        blood_group TEXT,
        allergies TEXT,
        medical_history TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Appointments table
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        doctor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        appointment_date TIMESTAMP NOT NULL,
        symptoms TEXT,
        description TEXT,
        status appointment_status DEFAULT 'pending',
        payment_status TEXT DEFAULT 'pending',
        payment_hash TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Payment Transactions table
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        appointment_id INTEGER NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
        patient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        doctor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount DECIMAL(18, 8) NOT NULL,
        transaction_hash TEXT UNIQUE,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Organ Donation Forms table
      CREATE TABLE IF NOT EXISTS organ_donations (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        doctor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        organs TEXT NOT NULL,
        donor_name TEXT NOT NULL,
        donor_email TEXT,
        donor_phone TEXT,
        date_of_birth TIMESTAMP,
        blood_group TEXT,
        medical_conditions TEXT,
        notes TEXT,
        consent BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Specialties table
      CREATE TABLE IF NOT EXISTS specialties (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        icon TEXT
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
      CREATE INDEX IF NOT EXISTS idx_doctor_profiles_user_id ON doctor_profiles(user_id);
      CREATE INDEX IF NOT EXISTS idx_patient_profiles_user_id ON patient_profiles(user_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
      CREATE INDEX IF NOT EXISTS idx_payments_appointment ON payments(appointment_id);
      CREATE INDEX IF NOT EXISTS idx_organ_donations_patient ON organ_donations(patient_id);
    `;

    // Execute migration
    await queryClient.unsafe(migrationSQL);

    console.log('[v0] Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[v0] Migration failed:', error);
    process.exit(1);
  }
}

migrate();
