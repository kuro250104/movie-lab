CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS coaches (
  id            serial PRIMARY KEY,
  first_name    varchar(255) NOT NULL,
  last_name     varchar(255) NOT NULL,
  email         varchar(255) UNIQUE NOT NULL,
  phone         varchar(20),
  timezone      text          DEFAULT 'Europe/Paris',
  is_active     boolean       DEFAULT true,
  created_at    timestamptz   DEFAULT now(),
  updated_at    timestamptz   DEFAULT now()
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

-- Création d'un admin par défaut (mot de passe: admin123)
INSERT INTO admins (email, password_hash, name) VALUES
('admin@movi-lab.fr', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Administrateur');

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_client ON analysis_reports(client_id);

ALTER TABLE services
    ADD COLUMN IF NOT EXISTS slug text GENERATED ALWAYS AS (
    lower(regexp_replace(unaccent(name), '[^a-z0-9]+', '-', 'g'))
    ) STORED;

CREATE UNIQUE INDEX IF NOT EXISTS services_slug_key ON services(slug);

-- 2) Table des items/sections d’un service
CREATE TABLE IF NOT EXISTS service_items (
                                             id              serial PRIMARY KEY,
                                             service_id      integer NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    icon            varchar(64),              -- ex: "sneaker", "target", "zap"
    title           varchar(255) NOT NULL,
    description     text NOT NULL,
    sort_order      integer NOT NULL DEFAULT 0,
    is_active       boolean NOT NULL DEFAULT true,
    created_at      timestamp NOT NULL DEFAULT now()
    );

CREATE INDEX IF NOT EXISTS service_items_service_id_idx ON service_items(service_id);
CREATE INDEX IF NOT EXISTS service_items_active_idx ON service_items(is_active);


-- Table des éléments d'une offre
CREATE TABLE IF NOT EXISTS public.service_items (
                                                    id           serial PRIMARY KEY,
                                                    service_id   integer NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    icon         varchar(64),          -- ex: 'sneaker', 'target', 'zap'
    title        varchar(255) NOT NULL,
    description  text NOT NULL,
    sort_order   integer NOT NULL DEFAULT 0,
    is_active    boolean NOT NULL DEFAULT true,
    created_at   timestamp NOT NULL DEFAULT now()
    );

CREATE INDEX IF NOT EXISTS service_items_service_id_idx ON public.service_items(service_id);
CREATE INDEX IF NOT EXISTS service_items_active_idx     ON public.service_items(is_active);

-- Droits si tu utilises un rôle applicatif (adapter le nom d’utilisateur si besoin)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_items TO movilab_user;
GRANT USAGE, SELECT ON SEQUENCE public.service_items_id_seq TO movilab_user;

INSERT INTO public.service_items (service_id, icon, title, description, sort_order)
VALUES
    (9, 'sneaker', 'Choix de chaussures', 'Évaluation et recommandations basées sur ton analyse.', 10),
    (9, 'target',  'Stratégies de course', 'Conseils adaptés à ton style de course.', 20);



-- 0) Prérequis
CREATE EXTENSION IF NOT EXISTS pgcrypto; -- pour générer des tokens d’URL
CREATE EXTENSION IF NOT EXISTS btree_gin;

-- 1) Lien Coach <-> Service (si pas déjà normalisé)
CREATE TABLE IF NOT EXISTS coach_services (
                                              coach_id    int NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
    service_id  int NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    PRIMARY KEY (coach_id, service_id)
    );

-- 2) Fuseau horaire + statut du coach
ALTER TABLE coaches
    ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'Europe/Paris',
    ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- 3) Règles de dispo récurrentes (hebdo)
-- Ex: chaque lundi et mercredi, 09:00-12:00 et 14:00-18:00
CREATE TABLE IF NOT EXISTS coach_availability_rules (
                                                        id           serial PRIMARY KEY,
                                                        coach_id     int NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
    weekday      int NOT NULL CHECK (weekday BETWEEN 0 AND 6), -- 0=dimanche ... 6=samedi
    start_minute int NOT NULL CHECK (start_minute BETWEEN 0 AND 1439), -- minutes depuis minuit
    end_minute   int NOT NULL CHECK (end_minute BETWEEN 1 AND 1440 AND end_minute > start_minute),
    is_active    boolean NOT NULL DEFAULT true,
    created_at   timestamptz NOT NULL DEFAULT now()
    );
CREATE INDEX IF NOT EXISTS idx_av_rules_coach_weekday ON coach_availability_rules(coach_id, weekday) WHERE is_active;

-- 4) Exceptions ponctuelles (override d’un jour)
-- Ex: le 2025-09-20 je suis dispo 10:00-12:00 uniquement / ou je suis indispo toute la journée
CREATE TABLE IF NOT EXISTS coach_availability_exceptions (
                                                             id           serial PRIMARY KEY,
                                                             coach_id     int NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
    date         date NOT NULL,
    -- null = journée complètement indisponible, sinon fenêtre unique
    start_minute int CHECK (start_minute BETWEEN 0 AND 1439),
    end_minute   int CHECK (end_minute BETWEEN 1 AND 1440 AND end_minute > start_minute),
    note         text,
    is_available boolean NOT NULL DEFAULT false, -- false = bloqué; true = dispo (fenêtre)
    created_at   timestamptz NOT NULL DEFAULT now()
    );
CREATE UNIQUE INDEX IF NOT EXISTS ux_av_exceptions_unique ON coach_availability_exceptions(coach_id, date);

-- 5) RDV (réservation fermée) OU Demande (à affecter)
-- a) demandes d’abord (le client propose un créneau et un service)
CREATE TABLE IF NOT EXISTS appointment_requests (
                                                    id             serial PRIMARY KEY,
                                                    service_id     int NOT NULL REFERENCES services(id),
    customer_name  text NOT NULL,
    customer_email text NOT NULL,
    timezone       text NOT NULL DEFAULT 'Europe/Paris',
    starts_at      timestamptz NOT NULL,  -- en UTC
    ends_at        timestamptz NOT NULL,
    status         text NOT NULL DEFAULT 'pending' -- pending|matched|cancelled|expired
    CHECK (status IN ('pending','matched','cancelled','expired')),
    created_at     timestamptz NOT NULL DEFAULT now()
    );
CREATE INDEX IF NOT EXISTS idx_appt_req_service_time ON appointment_requests(service_id, starts_at);

-- b) candidats coachs notifiés pour une demande
CREATE TABLE IF NOT EXISTS appointment_candidates (
                                                      id                     serial PRIMARY KEY,
                                                      request_id             int NOT NULL REFERENCES appointment_requests(id) ON DELETE CASCADE,
    coach_id               int NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
    email_sent_at          timestamptz,
    decision               text DEFAULT 'pending' -- pending|accepted|declined|expired
    CHECK (decision IN ('pending','accepted','declined','expired')),
    decision_token         uuid NOT NULL DEFAULT gen_random_uuid(), -- pour lien accept/decline
    decided_at             timestamptz,
    UNIQUE(request_id, coach_id)
    );
CREATE INDEX IF NOT EXISTS idx_appt_candidates_req ON appointment_candidates(request_id);

-- c) RDV confirmés (avec coach affecté)
CREATE TABLE IF NOT EXISTS appointments (
                                            id             serial PRIMARY KEY,
                                            service_id     int NOT NULL REFERENCES services(id),
    coach_id       int NOT NULL REFERENCES coaches(id),
    customer_name  text NOT NULL,
    customer_email text NOT NULL,
    starts_at      timestamptz NOT NULL,
    ends_at        timestamptz NOT NULL,
    status         text NOT NULL DEFAULT 'confirmed' -- confirmed|completed|cancelled|no_show
    CHECK (status IN ('confirmed','completed','cancelled','no_show')),
    created_at     timestamptz NOT NULL DEFAULT now()
    );
CREATE INDEX IF NOT EXISTS idx_appointments_coach_time ON appointments(coach_id, starts_at, ends_at);

-- 6) Outbox email (file d’envoi / job worker)
CREATE TABLE IF NOT EXISTS email_outbox (
                                            id           serial PRIMARY KEY,
                                            to_email     text NOT NULL,
                                            subject      text NOT NULL,
                                            html         text NOT NULL,
                                            created_at   timestamptz NOT NULL DEFAULT now(),
    sent_at      timestamptz
    );
