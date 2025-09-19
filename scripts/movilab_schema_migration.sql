BEGIN;

-- ---------- 0) Extensions ----------
CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS unaccent;   -- slug generation
CREATE EXTENSION IF NOT EXISTS btree_gist; -- exclusion constraints on ranges
CREATE EXTENSION IF NOT EXISTS pg_trgm;    -- optional, for fuzzy search
-- CREATE EXTENSION IF NOT EXISTS citext;  -- optional, for case-insensitive emails

-- ---------- 1) Core Tables ----------

-- Admins
CREATE TABLE IF NOT EXISTS admins (
                                      id            SERIAL PRIMARY KEY,
                                      email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name          VARCHAR(255) NOT NULL,
    role          VARCHAR(50) DEFAULT 'admin',
    created_at    TIMESTAMPTZ DEFAULT now(),
    updated_at    TIMESTAMPTZ DEFAULT now()
    );

-- Clients
CREATE TABLE IF NOT EXISTS clients (
                                       id                 SERIAL PRIMARY KEY,
                                       first_name         VARCHAR(255) NOT NULL,
    last_name          VARCHAR(255) NOT NULL,
    email              VARCHAR(255) UNIQUE NOT NULL,
    phone              VARCHAR(20),
    date_of_birth      DATE,
    address            TEXT,
    city               VARCHAR(255),
    postal_code        VARCHAR(10),
    emergency_contact  VARCHAR(255),
    emergency_phone    VARCHAR(20),
    medical_notes      TEXT,
    running_experience VARCHAR(50),
    goals              TEXT,
    created_at         TIMESTAMPTZ DEFAULT now(),
    updated_at         TIMESTAMPTZ DEFAULT now()
    );

-- Coaches
CREATE TABLE IF NOT EXISTS coaches (
                                       id         SERIAL PRIMARY KEY,
                                       first_name VARCHAR(255) NOT NULL,
    last_name  VARCHAR(255) NOT NULL,
    email      VARCHAR(255) UNIQUE NOT NULL,
    phone      VARCHAR(20),
    timezone   TEXT DEFAULT 'Europe/Paris',
    is_active  BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
    );

ALTER TABLE public.coaches
    ADD COLUMN IF NOT EXISTS city         varchar(255),
    ADD COLUMN IF NOT EXISTS address      text,
    ADD COLUMN IF NOT EXISTS status       text,
    ADD COLUMN IF NOT EXISTS postal_code  varchar(10),
    ADD COLUMN IF NOT EXISTS running_experience  varchar(50),
    ADD COLUMN IF NOT EXISTS date_of_birth      date,
    ADD COLUMN IF NOT EXISTS goals               text;

-- Services
CREATE TABLE IF NOT EXISTS services (
                                        id               SERIAL PRIMARY KEY,
                                        name             VARCHAR(255) NOT NULL,
    description      TEXT,
    price            DECIMAL(10,2) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    is_active        BOOLEAN DEFAULT true,
    created_at       TIMESTAMPTZ DEFAULT now(),
    updated_at       TIMESTAMPTZ DEFAULT now()
    );
ALTER TABLE public.services
    ADD COLUMN IF NOT EXISTS color varchar(9)
    CHECK (color IS NULL OR color ~ '^#?[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$');

-- ---- Slug (trigger-based, not generated) ----
ALTER TABLE services
    ADD COLUMN IF NOT EXISTS slug text;

CREATE OR REPLACE FUNCTION slugify_service_name(p_name text)
RETURNS text
LANGUAGE sql
STABLE
AS $$
SELECT lower(
               regexp_replace(
                       unaccent(coalesce(p_name, '')),
                       '[^a-z0-9]+', '-', 'g'
               )
       )
           $$;

CREATE OR REPLACE FUNCTION set_services_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT'
     OR (TG_OP = 'UPDATE' AND (NEW.name IS DISTINCT FROM OLD.name OR NEW.slug IS NULL OR NEW.slug = '')) THEN
    NEW.slug := slugify_service_name(NEW.name);
END IF;
RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_services_set_slug') THEN
CREATE TRIGGER trg_services_set_slug
    BEFORE INSERT OR UPDATE OF name, slug ON services
    FOR EACH ROW
    EXECUTE FUNCTION set_services_slug();
END IF;
END$$;

UPDATE services SET slug = slugify_service_name(name) WHERE slug IS NULL OR slug = '';

CREATE UNIQUE INDEX IF NOT EXISTS services_slug_key ON services(slug);

-- Validation
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'services_price_nonneg') THEN
ALTER TABLE services ADD CONSTRAINT services_price_nonneg CHECK (price >= 0);
END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'services_duration_pos') THEN
ALTER TABLE services ADD CONSTRAINT services_duration_pos CHECK (duration_minutes > 0);
END IF;
END$$;

-- ---------- 2) Service Items ----------
CREATE TABLE IF NOT EXISTS public.service_items (
                                                    id           SERIAL PRIMARY KEY,
                                                    service_id   INTEGER NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    icon         VARCHAR(64),
    title        VARCHAR(255) NOT NULL,
    description  TEXT NOT NULL,
    sort_order   INTEGER NOT NULL DEFAULT 0,
    is_active    BOOLEAN NOT NULL DEFAULT true,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
    );

CREATE INDEX IF NOT EXISTS service_items_service_id_idx ON public.service_items(service_id);
CREATE INDEX IF NOT EXISTS service_items_active_idx     ON public.service_items(is_active);

-- ---------- 3) Coach <-> Service Link & Availability ----------
CREATE TABLE IF NOT EXISTS coach_services (
                                              coach_id   INT NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
    service_id INT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    PRIMARY KEY (coach_id, service_id)
    );

CREATE TABLE IF NOT EXISTS coach_availability_rules (
                                                        id           SERIAL PRIMARY KEY,
                                                        coach_id     INT NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
    weekday      INT NOT NULL CHECK (weekday BETWEEN 0 AND 6),
    start_minute INT NOT NULL CHECK (start_minute BETWEEN 0 AND 1439),
    end_minute   INT NOT NULL CHECK (end_minute BETWEEN 1 AND 1440 AND end_minute > start_minute),
    is_active    BOOLEAN NOT NULL DEFAULT true,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
    );
CREATE INDEX IF NOT EXISTS idx_av_rules_coach_weekday
    ON coach_availability_rules(coach_id, weekday) WHERE is_active;

CREATE TABLE IF NOT EXISTS coach_availability_exceptions (
                                                             id           SERIAL PRIMARY KEY,
                                                             coach_id     INT NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
    date         DATE NOT NULL,
    start_minute INT CHECK (start_minute BETWEEN 0 AND 1439),
    end_minute   INT CHECK (end_minute BETWEEN 1 AND 1440 AND end_minute > start_minute),
    note         TEXT,
    is_available BOOLEAN NOT NULL DEFAULT false,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
    );
CREATE UNIQUE INDEX IF NOT EXISTS ux_av_exceptions_unique
    ON coach_availability_exceptions(coach_id, date);

-- ---------- 4) Requests / Candidates / Appointments ----------
CREATE TABLE IF NOT EXISTS appointment_requests (
                                                    id             SERIAL PRIMARY KEY,
                                                    service_id     INT NOT NULL REFERENCES services(id),
    customer_name  TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    timezone       TEXT NOT NULL DEFAULT 'Europe/Paris',
    starts_at      TIMESTAMPTZ NOT NULL,
    ends_at        TIMESTAMPTZ NOT NULL,
    status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','matched','cancelled','expired')),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
    );
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_appt_req_time_order') THEN
ALTER TABLE appointment_requests ADD CONSTRAINT chk_appt_req_time_order CHECK (ends_at > starts_at);
END IF;
END$$;

CREATE INDEX IF NOT EXISTS idx_appt_req_service_time ON appointment_requests(service_id, starts_at);
CREATE INDEX IF NOT EXISTS idx_appt_req_status_time  ON appointment_requests(status, starts_at);

CREATE TABLE IF NOT EXISTS appointment_candidates (
                                                      id              SERIAL PRIMARY KEY,
                                                      request_id      INT NOT NULL REFERENCES appointment_requests(id) ON DELETE CASCADE,
    coach_id        INT NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
    email_sent_at   TIMESTAMPTZ,
    decision        TEXT DEFAULT 'pending' CHECK (decision IN ('pending','accepted','declined','expired')),
    decision_token  UUID NOT NULL DEFAULT gen_random_uuid(),
    decided_at      TIMESTAMPTZ,
    UNIQUE(request_id, coach_id)
    );
CREATE INDEX IF NOT EXISTS idx_appt_candidates_req      ON appointment_candidates(request_id);
CREATE INDEX IF NOT EXISTS idx_appt_candidates_decision ON appointment_candidates(decision);
CREATE INDEX IF NOT EXISTS idx_appt_candidates_token    ON appointment_candidates(decision_token);

CREATE TABLE IF NOT EXISTS appointments (
                                            id             SERIAL PRIMARY KEY,
                                            client_id      INT REFERENCES clients(id)   ON DELETE CASCADE,
    service_id     INT REFERENCES services(id)  ON DELETE RESTRICT,
    coach_id       INT REFERENCES coaches(id)   ON DELETE RESTRICT,
    starts_at      TIMESTAMPTZ,
    ends_at        TIMESTAMPTZ,
    notes          TEXT,
    price          NUMERIC(10,2),
    payment_status TEXT DEFAULT 'pending',
    status         TEXT DEFAULT 'scheduled',
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
    );

ALTER TABLE appointments
    ADD COLUMN IF NOT EXISTS slot tstzrange GENERATED ALWAYS AS (tstzrange(starts_at, ends_at, '[)')) STORED;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_appointments_time_order') THEN
ALTER TABLE appointments
    ADD CONSTRAINT chk_appointments_time_order
        CHECK (ends_at IS NULL OR starts_at IS NULL OR ends_at > starts_at);
END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_appointments_status') THEN
ALTER TABLE appointments
    ADD CONSTRAINT chk_appointments_status
        CHECK (status IN ('scheduled','completed','cancelled','no_show'));
END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_payment_status') THEN
ALTER TABLE appointments
    ADD CONSTRAINT chk_payment_status
        CHECK (payment_status IN ('pending','paid','refunded'));
END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'excl_appointments_coach_overlap') THEN
ALTER TABLE appointments
    ADD CONSTRAINT excl_appointments_coach_overlap
    EXCLUDE USING gist (coach_id WITH =, slot WITH &&)
      WHERE (coach_id IS NOT NULL AND starts_at IS NOT NULL AND ends_at IS NOT NULL);
END IF;
END$$;

CREATE INDEX IF NOT EXISTS idx_appointments_coach_time  ON appointments(coach_id, starts_at);
CREATE INDEX IF NOT EXISTS idx_appointments_client_time ON appointments(client_id, starts_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status_time ON appointments(status, starts_at);

-- ---------- 5) Analysis Reports ----------
CREATE TABLE IF NOT EXISTS analysis_reports (
                                                id             SERIAL PRIMARY KEY,
                                                appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
    client_id      INTEGER REFERENCES clients(id)      ON DELETE CASCADE,
    report_data    JSONB,
    recommendations TEXT,
    file_path      VARCHAR(500),
    created_at     TIMESTAMPTZ DEFAULT now()
    );
CREATE INDEX IF NOT EXISTS idx_analysis_reports_client ON analysis_reports(client_id);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_data   ON analysis_reports USING gin (report_data);

-- ---------- 6) Email Outbox ----------
CREATE TABLE IF NOT EXISTS email_outbox (
                                            id         SERIAL PRIMARY KEY,
                                            to_email   TEXT NOT NULL,
                                            subject    TEXT NOT NULL,
                                            html       TEXT NOT NULL,
                                            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    sent_at    TIMESTAMPTZ
    );

-- ---------- 7) Case-insensitive Email Uniqueness ----------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'ux_clients_email_lower') THEN
CREATE UNIQUE INDEX ux_clients_email_lower ON clients (lower(email));
END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'ux_coaches_email_lower') THEN
CREATE UNIQUE INDEX ux_coaches_email_lower ON coaches (lower(email));
END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'ux_admins_email_lower') THEN
CREATE UNIQUE INDEX ux_admins_email_lower ON admins (lower(email));
END IF;
END$$;

-- ---------- 8) updated_at Trigger Helper ----------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_admins_updated_at') THEN
CREATE TRIGGER trg_admins_updated_at BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_clients_updated_at') THEN
CREATE TRIGGER trg_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_coaches_updated_at') THEN
CREATE TRIGGER trg_coaches_updated_at BEFORE UPDATE ON coaches
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_services_updated_at') THEN
CREATE TRIGGER trg_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_appointments_updated_at') THEN
CREATE TRIGGER trg_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
END IF;
END$$;

-- ---------- 9) Seeds ----------
INSERT INTO services (name, description, price, duration_minutes)
VALUES ('M-Starter', 'Analyse 3D de la foulée, diagnostic personnalisé', 119.00, 60)
    ON CONFLICT (slug) DO NOTHING;

INSERT INTO admins (email, password_hash, name)
VALUES ('admin@movi-lab.fr', '$2b$10$7Y8FqBWlGsmiFpOVAWDsuelhLvmn9O/R4LjzFvtrCqlvJjOKkgYNS', 'Administrateur')
    ON CONFLICT (email) DO NOTHING;

INSERT INTO public.service_items (service_id, icon, title, description, sort_order)
SELECT s.id, 'sneaker', 'Choix de chaussures', 'Évaluation et recommandations basées sur ton analyse.', 10
FROM services s WHERE s.slug = 'm-starter'
    ON CONFLICT DO NOTHING;

INSERT INTO public.service_items (service_id, icon, title, description, sort_order)
SELECT s.id, 'target', 'Stratégies de course', 'Conseils adaptés à ton style de course.', 20
FROM services s WHERE s.slug = 'm-starter'
    ON CONFLICT DO NOTHING;

-- ---------- 10) Optional Grants ----------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'movilab_user') THEN
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_items TO movilab_user;
GRANT USAGE, SELECT ON SEQUENCE public.service_items_id_seq TO movilab_user;
END IF;
END$$;

COMMIT;


-- Accès au schéma public
GRANT USAGE ON SCHEMA public TO movilab_user;

-- ✅ Droits sur toutes les tables déjà créées
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO movilab_user;

-- ✅ Droits sur toutes les séquences déjà créées (pour les SERIAL/IDENTITY)
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO movilab_user;

-- ✅ Définir les droits par défaut pour les futures tables/séquences
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO movilab_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO movilab_user;