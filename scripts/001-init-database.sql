-- Création des tables principales pour movi-lab

-- Table des utilisateurs admin
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des clients
CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  address TEXT,
  city VARCHAR(255),
  postal_code VARCHAR(10),
  emergency_contact VARCHAR(255),
  emergency_phone VARCHAR(20),
  medical_notes TEXT,
  running_experience VARCHAR(50),
  goals TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des types de services
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des rendez-vous
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  service_id INTEGER REFERENCES services(id),
  appointment_date TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, completed, cancelled, no_show
  notes TEXT,
  price DECIMAL(10,2),
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, refunded
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des rapports d'analyse
CREATE TABLE IF NOT EXISTS analysis_reports (
  id SERIAL PRIMARY KEY,
  appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  report_data JSONB, -- Stockage flexible des données d'analyse
  recommendations TEXT,
  file_path VARCHAR(500), -- Chemin vers le fichier PDF du rapport
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion des services par défaut
INSERT INTO services (name, description, price, duration_minutes) VALUES
('M-Starter', 'Analyse 3D de la foulée, diagnostic personnalisé', 119.00, 60),
('M-Pacer', 'M-Starter + analyse musculaire + évaluation chaussures', 139.00, 90),
('M-Finisher', 'M-Pacer + plan d''entraînement + suivi 12 semaines', 159.00, 120);

-- Création d'un admin par défaut (mot de passe: admin123)
INSERT INTO admins (email, password_hash, name) VALUES
('admin@movi-lab.fr', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Administrateur');

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_client ON analysis_reports(client_id);
