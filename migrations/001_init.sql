-- Drop tables if they exist to reset schema
DROP TABLE IF EXISTS payment_transactions CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS patient_profiles CASCADE;
DROP TABLE IF EXISTS doctor_profiles CASCADE;
DROP TABLE IF EXISTS organ_donation_forms CASCADE;
DROP TABLE IF EXISTS organ_donations CASCADE;
DROP TABLE IF EXISTS specialties CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop enums if they exist
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
CREATE TABLE users (
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
CREATE TABLE doctor_profiles (
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
CREATE TABLE patient_profiles (
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

-- Specialties table
CREATE TABLE specialties (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT
);

-- Appointments table
CREATE TABLE appointments (
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

-- Organ Donation Forms table
CREATE TABLE organ_donation_forms (
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

-- Payment Transactions table
CREATE TABLE payment_transactions (
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

-- Create indexes
CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_doctor_profiles_user_id ON doctor_profiles(user_id);
CREATE INDEX idx_patient_profiles_user_id ON patient_profiles(user_id);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_organ_donations_patient ON organ_donation_forms(patient_id);

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
