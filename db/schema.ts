import { pgTable, text, serial, timestamp, boolean, integer, pgEnum, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['patient', 'doctor', 'admin']);
export const appointmentStatusEnum = pgEnum('appointment_status', ['pending', 'approved', 'rejected', 'completed', 'cancelled']);
export const specialtyEnum = pgEnum('specialty', [
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
]);

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  walletAddress: text('wallet_address').unique().notNull(),
  email: text('email'),
  password: text('password'),
  role: userRoleEnum('role').notNull(),
  fullName: text('full_name'),
  profilePicture: text('profile_picture'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Doctor Profile table
export const doctorProfiles = pgTable('doctor_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  specialization: specialtyEnum('specialization').notNull(),
  licenseNumber: text('license_number').unique().notNull(),
  yearsOfExperience: integer('years_of_experience'),
  qualifications: text('qualifications'),
  consultationFee: decimal('consultation_fee', { precision: 10, scale: 2 }),
  bio: text('bio'),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Patient Profile table
export const patientProfiles = pgTable('patient_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  dateOfBirth: timestamp('date_of_birth'),
  gender: text('gender'),
  bloodGroup: text('blood_group'),
  allergies: text('allergies'),
  medicalHistory: text('medical_history'),
  phoneNumber: text('phone_number'),
  address: text('address'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Appointments table
export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  patientId: integer('patient_id').references(() => users.id, { onDelete: 'cascade' }),
  doctorId: integer('doctor_id').references(() => users.id, { onDelete: 'cascade' }),
  appointmentDate: timestamp('appointment_date'),
  reason: text('reason'),
  symptoms: text('symptoms'),
  allergies: text('allergies'),
  bloodGroup: text('blood_group'),
  description: text('description'),
  status: appointmentStatusEnum('status').default('pending'),
  consultationFee: decimal('consultation_fee', { precision: 10, scale: 2 }),
  paymentTxHash: text('payment_tx_hash'),
  paymentStatus: boolean('payment_status').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Organ Donation Form table
export const organDonationForms = pgTable('organ_donation_forms', {
  id: serial('id').primaryKey(),
  patientId: integer('patient_id').references(() => users.id, { onDelete: 'cascade' }),
  doctorId: integer('doctor_id').references(() => users.id, { onDelete: 'cascade' }),
  organs: text('organs'), // JSON array of organs
  bloodType: text('blood_type'),
  medicalConditions: text('medical_conditions'),
  familyConsent: boolean('family_consent').default(false),
  dateOfSubmission: timestamp('date_of_submission').defaultNow(),
  status: text('status').default('active'), // active, inactive, withdrawn
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Payment Transactions table
export const paymentTransactions = pgTable('payment_transactions', {
  id: serial('id').primaryKey(),
  appointmentId: integer('appointment_id').references(() => appointments.id, { onDelete: 'cascade' }),
  patientWalletAddress: text('patient_wallet_address').notNull(),
  doctorWalletAddress: text('doctor_wallet_address').notNull(),
  amount: decimal('amount', { precision: 18, scale: 8 }).notNull(), // ETH amount with decimals
  transactionHash: text('transaction_hash').unique(),
  status: text('status').default('pending'), // pending, confirmed, failed
  networkId: integer('network_id'), // 1 for Ethereum Mainnet
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  doctorProfile: one(doctorProfiles, {
    fields: [users.id],
    references: [doctorProfiles.userId],
  }),
  patientProfile: one(patientProfiles, {
    fields: [users.id],
    references: [patientProfiles.userId],
  }),
  appointmentsAsPatient: many(appointments, {
    relationName: 'patientAppointments',
  }),
  appointmentsAsDoctor: many(appointments, {
    relationName: 'doctorAppointments',
  }),
  organDonationForms: many(organDonationForms),
}));

export const doctorProfilesRelations = relations(doctorProfiles, ({ one }) => ({
  user: one(users, {
    fields: [doctorProfiles.userId],
    references: [users.id],
  }),
}));

export const patientProfilesRelations = relations(patientProfiles, ({ one }) => ({
  user: one(users, {
    fields: [patientProfiles.userId],
    references: [users.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  patient: one(users, {
    fields: [appointments.patientId],
    references: [users.id],
    relationName: 'patientAppointments',
  }),
  doctor: one(users, {
    fields: [appointments.doctorId],
    references: [users.id],
    relationName: 'doctorAppointments',
  }),
  paymentTransaction: one(paymentTransactions, {
    fields: [appointments.id],
    references: [paymentTransactions.appointmentId],
  }),
}));

export const organDonationFormsRelations = relations(organDonationForms, ({ one }) => ({
  patient: one(users, {
    fields: [organDonationForms.patientId],
    references: [users.id],
  }),
  doctor: one(users, {
    fields: [organDonationForms.doctorId],
    references: [users.id],
  }),
}));

export const paymentTransactionsRelations = relations(paymentTransactions, ({ one }) => ({
  appointment: one(appointments, {
    fields: [paymentTransactions.appointmentId],
    references: [appointments.id],
  }),
}));
