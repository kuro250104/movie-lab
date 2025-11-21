-- =========================================================
-- 0. Extensions
-- =========================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================
-- 1. DROP (dans le bon ordre)
-- =========================================================
DROP TABLE IF EXISTS public.appointment_candidates      CASCADE;
DROP TABLE IF EXISTS public.appointments                CASCADE;
DROP TABLE IF EXISTS public.appointment_requests        CASCADE;
DROP TABLE IF EXISTS public.coach_availability_exceptions CASCADE;
DROP TABLE IF EXISTS public.coach_availability_rules    CASCADE;
DROP TABLE IF EXISTS public.coach_services              CASCADE;
DROP TABLE IF EXISTS public.service_supplements         CASCADE;
DROP TABLE IF EXISTS public.service_items               CASCADE;
DROP TABLE IF EXISTS public.email_outbox                CASCADE;
DROP TABLE IF EXISTS public.supplements                 CASCADE;
DROP TABLE IF EXISTS public.services                    CASCADE;
DROP TABLE IF EXISTS public.coaches                     CASCADE;
DROP TABLE IF EXISTS public.clients                     CASCADE;
DROP TABLE IF EXISTS public.admins                      CASCADE;

-- =========================================================
-- 2. TABLES DE BASE
-- =========================================================

-- 2.1 Admins (compte pour se connecter au back-office)
CREATE TABLE public.admins (
                               id BIGSERIAL PRIMARY KEY,
                               email character varying(255) NOT NULL,
                               password_hash character varying(255) NOT NULL,
                               name character varying(255) NOT NULL,
                               role character varying(50) DEFAULT 'admin'::character varying NOT NULL,
                               created_at timestamp with time zone DEFAULT now() NOT NULL,
                               updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Admin par défaut
INSERT INTO public.admins (id, email, password_hash, name, role)
VALUES (1, 'gaetan.bougoula@orange.fr', '$2b$12$7OgOkG.NfIUJGI6GfPtSeuYP/UjGRrXQdSmPH9kys9d.Vazl7KsC.', 'Super', 'Admin');

-- 2.2 Clients (les personnes qui réservent)
CREATE TABLE public.clients (
                                id          BIGSERIAL PRIMARY KEY,
                                first_name  TEXT,
                                last_name   TEXT,
                                email       TEXT,
                                phone       TEXT,
                                created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.3 Services (/api/services)
CREATE TABLE public.services (
                                 id               BIGSERIAL PRIMARY KEY,
                                 name             TEXT NOT NULL,
                                 slug             TEXT NOT NULL UNIQUE,
                                 description      TEXT,
                                 duration_minutes INT  NOT NULL DEFAULT 60,
                                 price            NUMERIC(10,2) NOT NULL DEFAULT 0,
                                 is_active        BOOLEAN NOT NULL DEFAULT TRUE,
                                 color            TEXT,
                                 icon             TEXT,
                                 created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
                                 updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.4 Supplements
CREATE TABLE public.supplements (
                                    id          BIGSERIAL PRIMARY KEY,
                                    name        TEXT NOT NULL,
                                    description TEXT,
                                    price       NUMERIC(10,2) NOT NULL DEFAULT 0,
                                    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
                                    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================
-- 3. TABLES LIEES AUX SERVICES
-- =========================================================

-- 3.1 Eléments d’un service
CREATE TABLE public.service_items (
                                      id          BIGSERIAL PRIMARY KEY,
                                      service_id  BIGINT NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
                                      icon        TEXT,
                                      title       TEXT NOT NULL,
                                      description TEXT,
                                      sort_order  INT NOT NULL DEFAULT 0,
                                      is_active   BOOLEAN NOT NULL DEFAULT TRUE,
                                      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.2 Lien service <-> supplements (ce que l’API demandait mais qui manquait)
CREATE TABLE public.service_supplements (
                                            id             BIGSERIAL PRIMARY KEY,
                                            service_id     BIGINT NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
                                            supplement_id  BIGINT NOT NULL REFERENCES public.supplements(id) ON DELETE CASCADE,
                                            is_required    BOOLEAN NOT NULL DEFAULT FALSE,
                                            sort_order     INT NOT NULL DEFAULT 0,
                                            created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
                                            UNIQUE (service_id, supplement_id)
);

-- =========================================================
-- 4. COACHS & DISPONIBILITE
-- =========================================================

-- 4.1 Coachs
CREATE TABLE public.coaches (
                                id BIGSERIAL PRIMARY KEY,                       -- ⚠️ PK + auto-incrément
                                first_name character varying(255) NOT NULL,
                                last_name character varying(255) NOT NULL,
                                email character varying(255) NOT NULL,
                                phone character varying(20),
                                timezone text DEFAULT 'Europe/Paris'::text NOT NULL,
                                is_active boolean DEFAULT true NOT NULL,
                                created_at timestamp with time zone DEFAULT now() NOT NULL,
                                updated_at timestamp with time zone DEFAULT now() NOT NULL,
                                city character varying(255),
                                address text,
                                status text,
                                postal_code character varying(10),
                                date_of_birth date,
                                goals text,
                                coach_type text DEFAULT 'general'::text NOT NULL
);

-- 4.2 Quel coach fait quel service
CREATE TABLE public.coach_services (
                                       id          BIGSERIAL PRIMARY KEY,
                                       coach_id    BIGINT NOT NULL REFERENCES public.coaches(id) ON DELETE CASCADE,
                                       service_id  BIGINT NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
                                       UNIQUE (coach_id, service_id)
);

-- 4.3 Règles hebdo
CREATE TABLE public.coach_availability_rules (
                                                 id          BIGSERIAL PRIMARY KEY,
                                                 coach_id    BIGINT NOT NULL REFERENCES public.coaches(id) ON DELETE CASCADE,
                                                 weekday     INT NOT NULL,            -- 1 = lundi ... 7 = dimanche
                                                 start_minute  TIME NOT NULL,
                                                 end_minute    TIME NOT NULL,
                                                 is_active   BOOLEAN NOT NULL DEFAULT TRUE,
                                                 created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.4 Exceptions (fermetures / créneaux spéciaux)
CREATE TABLE public.coach_availability_exceptions (
                                                      id            BIGSERIAL PRIMARY KEY,
                                                      coach_id      BIGINT NOT NULL REFERENCES public.coaches(id) ON DELETE CASCADE,
                                                      date          DATE NOT NULL,
                                                      start_minute    TIME,
                                                      end_minute      TIME,
                                                      is_available  BOOLEAN NOT NULL DEFAULT FALSE,
                                                      note        TEXT,
                                                      created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================
-- 5. RDV PUBLICS (ce que ton /api/public/booking utilise)
-- =========================================================

-- 5.1 Demande de rendez-vous
CREATE TABLE public.appointment_requests (
                                             id              BIGSERIAL PRIMARY KEY,
                                             service_id      BIGINT NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
                                             customer_name   TEXT NOT NULL,
                                             customer_email  TEXT NOT NULL,
                                             customer_phone  TEXT,
                                             starts_at TIMESTAMPTZ NOT NULL,
                                             notes           TEXT,
                                             status          TEXT NOT NULL DEFAULT 'pending',
                                             created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5.2 Coachs notifiés pour une demande
CREATE TABLE public.appointment_candidates (
                                               id                    BIGSERIAL PRIMARY KEY,
                                               request_id            BIGINT NOT NULL REFERENCES public.appointment_requests(id) ON DELETE CASCADE,
                                               coach_id              BIGINT NOT NULL REFERENCES public.coaches(id) ON DELETE CASCADE,
                                               notify_token          UUID   NOT NULL DEFAULT uuid_generate_v4(),
                                               notify_token_expires_at TIMESTAMPTZ,
                                               notified_at           TIMESTAMPTZ,
                                               accepted_at           TIMESTAMPTZ,
                                               declined_at           TIMESTAMPTZ,
                                               is_active             BOOLEAN NOT NULL DEFAULT TRUE,
                                               UNIQUE (request_id, coach_id)
);

-- 5.3 RDV confirmé (ou posé par l’admin)
CREATE TABLE public.appointments (
                                     id              BIGSERIAL PRIMARY KEY,
                                     request_id      BIGINT REFERENCES public.appointment_requests(id) ON DELETE SET NULL,
                                     client_id       BIGINT NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
                                     coach_id        BIGINT REFERENCES public.coaches(id) ON DELETE SET NULL,
                                     service_id      BIGINT NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
                                     starts_at       TIMESTAMPTZ NOT NULL,
                                     ends_at         TIMESTAMPTZ NOT NULL,
                                     status          TEXT NOT NULL DEFAULT 'scheduled',    -- scheduled / completed / canceled ...
                                     payment_status  TEXT,
                                     notes           TEXT,
                                     created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- pour accélérer les recherches par date
CREATE INDEX idx_appointments_starts_at ON public.appointments (starts_at);
CREATE INDEX idx_appointments_coach ON public.appointments (coach_id, starts_at);

-- =========================================================
-- 6. Email outbox (ton code l’utilise pour envoyer / logguer)
-- =========================================================
CREATE TABLE public.email_outbox (
                                     id          BIGSERIAL PRIMARY KEY,
                                     to_email    TEXT NOT NULL,
                                     subject     TEXT NOT NULL,
                                     html  TEXT,
                                     created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
                                     sent_at     TIMESTAMPTZ,
                                     status      TEXT
);

-- =========================================================
-- 7. DONNÉES DE DÉMO / COHERENTES AVEC TES LOGS
-- =========================================================

-- 7.1 service "Pack initial"
INSERT INTO public.services (id, name, description, price, duration_minutes, is_active, slug, color) VALUES (1, 'Pack initial', 'Ce pack te permet d''améliorer ta foulée et d’identifier les gestes à risque, les déséquilibres et les points à renforcer, pour courir mieux et réduire le risque de blessure. T’aider à protéger ton corps, corriger ta technique et renforcer tes muscles pour que tu puisses courir en toute sécurité et durablement.', 99.00, 45, 't', 'pack-initial', 'bg-indigo-500') ON CONFLICT DO NOTHING;
INSERT INTO public.services (id, name, description, price, duration_minutes, is_active, slug, color) VALUES (2, 'Pack prévention et douleurs', 'Ce pack t''aide à comprendre les causes de tes douleurs en course à pied ainsi que d''identifier les gestes non adaptés, les déséquilibres et les points à renforcer, pour réduire le risque de blessure avant qu’il n’apparaisse.', 180.00, 60, 't', 'pack-prevention-et-douleurs', 'bg-emerald-500') ON CONFLICT DO NOTHING;
INSERT INTO public.services (id, name, description, price, duration_minutes, is_active, slug, color) VALUES (3, 'Pack performance', 'Ce pack te propose une vision de ta foulé, de ta posture, de tes muscles ainsi que de tes chaussures pour comprendre ton corps dans son ensemble et cibler ton entrainement.', 230.00, 90, 't', 'pack-performance', 'bg-orange-500') ON CONFLICT DO NOTHING;
INSERT INTO public.services (id, name, description, price, duration_minutes, is_active, slug, color) VALUES (4, 'Pack performance gold', 'Ce pack te propose une vision complète de ta foulée, de ta posture, de tes muscles, de ta nutrition, de tes chaussures ainsi que de ta préparation mentale pour comprendre ton corps dans son ensemble et cibler ton entrainement.', 280.00, 90, 't', 'pack-performance-gold', 'bg-orange-500') ON CONFLICT DO NOTHING;


-- 7.2 contenu du service
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (1, 1, 'runningMan', 'Analyse posturale membres inférieurs', 'Tu comprends ta posture de course pour repérer d’éventuels déséquilibres au niveau de tes articulations : pieds, chevilles, genoux et hanches. Tu apprends quels muscles il faut renforcer et quels exercices (drills) mettre en place pour optimiser tes gestes et prévenir les douleurs en course à pied.', 0, 't' ) ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (2, 1, 'chart', 'Analyse et proposition de chaussures', 'On analyse tes chaussures et ta foulée. Tu reçois des recommandations pour choisir la paire adaptée, optimiser ta course et diminuer tes douleurs. Nous utilisons une base de données de plus de 5000 paires de chaussures.', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (3, 1, 'note', 'Restitution des résultats', 'Tu repars avec tes résultats et tes programmes. Nous axons nos conseils sur l''optimisation de ta foulée et sur la prévention des blessures. ', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (4, 1, 'userfriend', 'Accompagnement', 'Grace à nos coachs partenaires tu peux te faire accompagner à la suite de ta restitution avec un prix préférentiel. Avances à ton rythme avec un suivi sur mesure.', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (5, 1, 'barbell', 'Bilan musculaire appareil locomoteur (+50 euros)', 'Tu identifies des déficits de recrutement musculaire lors des mouvements fonctionnels (préparation physique general) et tu reçois des exercices ciblés pour renforcer tes points faibles, optimiser ta foulée et protéger ton corps.', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (6, 1, 'userfriend', 'Explication et programmation personnalisées (+ 50 euros)', 'Tu bénéficieras d’une programmation personnalisée conçue par un coach running expert, qui tiendra compte de ton profil, ton rythme, tes forces et tes ambitions. Des programmes clairs et adaptés avec des exercices faciles à mettre en pratique lors de ton quotidien.', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (7, 2, 'runningMan', 'Analyse technique de course', 'Tu découvres ta technique de course et identifies les stratégies susceptibles d’engendrer des surcharges. Tu reçois des recommandations pour optimiser ta technique de course.', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (8, 2, 'simpleMan', 'Analyse posturale', 'Tu comprends ta posture de course pour repérer d’éventuels déséquilibres au niveau de tes articulations. Tu apprends quels muscles il faut renforcer et quels exercices (drills) mettre en place pour optimiser ton geste et prévenir les douleurs en course à pied, afin de courir plus sereinement.', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (9, 2, 'backpain', 'Évaluation des gestes mal adaptés à la douleur', 'Tu comprends quels mouvements éviter ou corriger pour limiter les risques de blessures.', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (10, 2, 'barbell', 'Bilan musculaire appareil locomoteur', 'Tu identifies des déficits de recrutement musculaire lors des mouvements fonctionnels (préparation physique general) et tu reçois des exercices ciblés pour renforcer tes points faibles et protéger ton corps.', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (11, 2, 'shoes', 'Proposition de chaussures et conseil technique', 'Tu reçois des recommandations pour choisir la paire adaptée et diminuer tes douleurs. Nous utilisons ton analyse de course à pied et une base de données de plus de 5 000 paires de chaussures pour sélectionner avec toi la paire la mieux adaptée.', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (12, 2, 'note', 'Restitution personnalisée', 'Tu reçois une restitution personnalisée sous 7 jours par l’un de nos coachs running spécialisés, et tu repars avec un compte‐rendu clair, adapté et facile à mettre en pratique dans tes entraînements.', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (13, 2, 'userfriend', 'Accompagnement', 'Grace à nos coachs partenaires tu peux te faire accompagner à la suite de ta restitution avec un prix préférentiel. Avances à ton rythme avec un suivi sur mesure.', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (14, 3, 'runningMan', 'Analyse technique de course', 'Tu découvres ta technique de course et identifies les stratégies pour diminuer ton travail mécanique et améliorer ta VO2Max. Tu reçois des recommandations pour optimiser ta technique de course.', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (15, 3, 'simpleMan', 'Analyse posturale', 'Tu comprends ta posture de course pour repérer d’éventuels déséquilibres au niveau de tes articulations. Tu apprends quels muscles il faut renforcer et quels exercices (drills) mettre en place pour optimiser ton geste et prévenir les douleurs en course à pied, afin de optimiser ta performance.', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (16, 3, 'zap', 'Analyse vitesse', 'Tu comprends comment ta technique est modifiée selon les variations de vitesse, et nous te donnons des conseils pour mieux gérer ta course.', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (17, 3, 'chart', 'Bilan musculaire appareil locomoteur', 'Tu identifies des déficits de recrutement musculaire lors des mouvements fonctionnels (préparation physique général) et tu reçois des exercices ciblés pour renforcer tes points faibles et progresser.', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (18, 3, 'sneaker', 'Analyse et proposition de chaussures avec conseil technique', 'Tu compares tes paires des chaussures et tu reçois des recommandations pour choisir la paire mieux adaptée pour ta performance. Nous utilisons ton analyse de course à pied et une base de données de plus de 5000 paires de chaussures pour te faire des nouvelles propositions.', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (19, 3, 'note', 'Restitution personnalisée', 'Tu reçois une restitution personnalisée par l’un de nos coachs running spécialisés, et tu repars avec un compte‐rendu clair, adapté et facile à mettre en pratique dans tes entraînements.', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (20, 3, 'userfriend', 'Accompagnement', 'Grace à nos coachs partenaires tu peux te faire accompagner à la suite de ta restitution avec un prix préférentiel. Avances à ton rythme avec un suivi sur mesure.', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (21, 4, 'runningMan', 'Analyse technique de course', 'Tu découvres ta technique de course et identifies les stratégies pour diminuer ton travail mécanique et améliorer ta VO2Max. Tu reçois des recommandations pour optimiser ta technique de course.', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (22, 4, 'simpleMan', 'Analyse posturale', 'Tu comprends ta posture de course pour repérer d’éventuels déséquilibres au niveau de tes articulations. Tu apprends quels muscles il faut renforcer et quels exercices (drills) mettre en place pour optimiser ton geste et prévenir les douleurs en course à pied, afin de optimiser ta performance.', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (23, 4, 'zap', 'Analyse vitesse', 'Tu comprends comment ta technique est modifiée selon les variations de vitesse, et nous te donnons des conseils pour mieux gérer ta course.', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (24, 4, 'barbell', 'Bilan musculaire appareil locomoteur', 'Tu identifies des déficits de recrutement musculaire lors des mouvements fonctionnels (préparation physique général) et tu reçois des exercices ciblés pour renforcer tes points faibles et progresser.', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (25, 4, 'shoes', 'Analyse et proposition de chaussures avec conseil technique', 'Tu compares tes paires des chaussures et tu reçois des recommandations pour choisir la paire mieux adaptée pour ta performance. Nous utilisons ton analyse de course à pied et une base de données de plus de 5000 paires de chaussures pour te faire des nouvelles propositions.', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (26, 4, 'note', 'Restitution personnalisée', 'Tu reçois une restitution personnalisée par l’un de nos coachs running spécialisés, et tu repars avec un compte‐rendu clair, adapté et facile à mettre en pratique dans tes entraînements. ', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (27, 4, 'userfriend', 'Accompagnement', 'Grace à nos coachs partenaires tu peux te faire accompagner à la suite de ta restitution avec un prix préférentiel. Avances à ton rythme avec un suivi sur mesure. ', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (28, 4, 'userfriend', 'Bilan nutrition et hydratation', 'Lors de l''entretien de 45 minutes (en présentiel ou vidéo), notre coach spécialisé en nutrition et en course à pied identifie tes habitudes, besoins et freins pour définir ou améliorer ta stratégie nutrition-hydratation. Il analyse ta situation et, si besoin, il défini une feuille de route d’accompagnement.', 0, 't') ON CONFLICT DO NOTHING;
INSERT INTO public.service_items (id, service_id, icon, title, description, sort_order, is_active) VALUES (29, 4, 'userfriend', 'Bilan préparation mentale', 'Lors de l''entretien de 45 minutes (en présentiel ou vidéo), notre préparateur mental explore tes freins et tes ressources cognitives, évalue ta motivation et ta capacité de concentration, afin d’analyser ta situation et, si besoin, définir une feuille de route d’accompagnement.', 0, 't') ON CONFLICT DO NOTHING;

-- 7.3 supplements
INSERT INTO public.supplements (name, description, price)
VALUES
    ('Bilan musculaire appareil locomoteur', 'Tu identifies des déficits de recrutement musculaire lors des mouvements fonctionnels (préparation physique general) et tu reçois des exercices ciblés pour renforcer tes points faibles, optimiser ta foulée et protéger ton corps.', 50),
    ('Explication et programmation personnalisées', 'Tu bénéficieras d’une programmation personnalisée conçue par un coach running expert, qui tiendra compte de ton profil, ton rythme, tes forces et tes ambitions. Des programmes clairs et adaptés avec des exercices faciles à mettre en pratique lors de ton quotidien.', 50);
INSERT INTO public.service_supplements (service_id, supplement_id, is_required, sort_order) VALUES (1, 1, TRUE, 0);
INSERT INTO public.service_supplements (service_id, supplement_id, is_required, sort_order) VALUES (1, 2, TRUE, 0);

-- 7.4 coachs
INSERT INTO public.coaches (first_name, last_name, email, phone, is_active)
VALUES
    ('Gaetan', 'Bougoula', 'gaetan.bougoula@humet.fr', '0772306348', TRUE);

DO $$
BEGIN
  -- Crée le rôle si inexistant
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'movilab_user') THEN
CREATE ROLE movilab_user LOGIN PASSWORD 'humet';
END IF;
END $$;

-- Donner accès à la base et au schéma public
GRANT CONNECT ON DATABASE movilab_sandbox TO movilab_user;
GRANT USAGE ON SCHEMA public TO movilab_user;

-- Donner toutes les permissions sur toutes les tables existantes
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO movilab_user;

-- Donner toutes les permissions sur les séquences (pour les IDs auto-incrément)
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO movilab_user;

-- Donner toutes les permissions sur les fonctions existantes
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO movilab_user;

-- Et s’assurer que les futures tables auront aussi ces droits
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL PRIVILEGES ON TABLES TO movilab_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL PRIVILEGES ON SEQUENCES TO movilab_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT EXECUTE ON FUNCTIONS TO movilab_user;



      -- 0) Prérequis utilitaire pour enlever les accents
CREATE EXTENSION IF NOT EXISTS unaccent;

-- 1) Colonne slug (si absente)
ALTER TABLE public.services
    ADD COLUMN IF NOT EXISTS slug text;

-- 2) Fonction utilitaire: slugify("Nom du service") -> "nom-du-service"
CREATE OR REPLACE FUNCTION public.slugify(txt text)
RETURNS text
LANGUAGE sql
AS $$
SELECT regexp_replace(
               regexp_replace(
                       lower(unaccent(coalesce($1, ''))),
                       '[^a-z0-9]+', '-', 'g'
               ),
               '(^-|-$)', '', 'g'
       );
$$;

-- 3) Génération d'un slug unique basé sur un slug "de base"
--    Si "pack-performance" existe déjà, on fera "pack-performance-2", "pack-performance-3", etc.
CREATE OR REPLACE FUNCTION public.services_make_unique_slug(base text)
RETURNS text
LANGUAGE plpgsql AS $$
DECLARE
candidate text := NULL;
  n int := 0;
BEGIN
  IF base IS NULL OR base = '' THEN
    base := 'service';
END IF;

  LOOP
n := n + 1;
    candidate := CASE WHEN n = 1 THEN base ELSE base || '-' || n END;

    -- s'il n'existe pas, on l'utilise
    IF NOT EXISTS (SELECT 1 FROM public.services s WHERE s.slug = candidate) THEN
      RETURN candidate;
END IF;
END LOOP;
END $$;

-- 4) Trigger: remplit (ou régénère) le slug avant INSERT/UPDATE si manquant
CREATE OR REPLACE FUNCTION public.services_set_slug()
RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
base text;
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
      base := public.slugify(NEW.name);
      NEW.slug := public.services_make_unique_slug(base);
END IF;

  ELSIF TG_OP = 'UPDATE' THEN
    -- on régénère si le nom a changé, ou si le slug fourni est vide
    IF NEW.name IS DISTINCT FROM OLD.name OR NEW.slug IS NULL OR NEW.slug = '' THEN
      base := public.slugify(NEW.name);
      NEW.slug := public.services_make_unique_slug(base);
END IF;
END IF;

RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_services_set_slug ON public.services;

CREATE TRIGGER trg_services_set_slug
    BEFORE INSERT OR UPDATE ON public.services
                         FOR EACH ROW
                         EXECUTE FUNCTION public.services_set_slug();

-- 5) Backfill: remplir les slugs manquants pour les lignes déjà présentes
WITH bases AS (
    SELECT id, public.slugify(name) AS base
    FROM public.services
),
     ranked AS (
         SELECT s.id,
                b.base,
                ROW_NUMBER() OVER (PARTITION BY b.base ORDER BY s.id) AS rn
         FROM public.services s
                  JOIN bases b ON b.id = s.id
     )
UPDATE public.services s
SET slug = CASE
               WHEN r.rn = 1 THEN r.base
               ELSE r.base || '-' || r.rn
    END
    FROM ranked r
WHERE r.id = s.id
  AND (s.slug IS NULL OR s.slug = '');

-- 6) Contraintes: unicité + NOT NULL
ALTER TABLE public.services
    ADD CONSTRAINT services_slug_uniq UNIQUE (slug);

ALTER TABLE public.services
    ALTER COLUMN slug SET NOT NULL;

-- =========================================================
-- Auto-calcul de ends_at pour appointment_requests
-- =========================================================

-- 1) Colonnes manquantes (si elles n’existent pas déjà)
ALTER TABLE public.appointment_requests
    ADD COLUMN IF NOT EXISTS starts_at timestamptz,     -- si tu l’as déjà, ce sera ignoré
    ADD COLUMN IF NOT EXISTS ends_at timestamptz,
    ADD COLUMN IF NOT EXISTS duration_override_minutes integer;  -- durée personnalisée

-- 2) Fonction qui calcule automatiquement ends_at
CREATE OR REPLACE FUNCTION public.appt_req_set_ends_at()
RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
dur int;
BEGIN
  -- Recalcule si ends_at est NULL ou si starts_at/service_id/duration_override changent
  IF NEW.ends_at IS NULL
     OR (TG_OP = 'UPDATE' AND (
          NEW.starts_at IS DISTINCT FROM OLD.starts_at OR
          NEW.service_id IS DISTINCT FROM OLD.service_id OR
          NEW.duration_override_minutes IS DISTINCT FROM OLD.duration_override_minutes
        )) THEN

    -- priorité : override > durée du service > fallback 60 min
SELECT COALESCE(NEW.duration_override_minutes, s.duration_minutes, 60)
INTO dur
FROM public.services s
WHERE s.id = NEW.service_id;

IF dur IS NULL OR dur <= 0 THEN
      dur := 60;
END IF;

    IF NEW.starts_at IS NOT NULL THEN
      NEW.ends_at := NEW.starts_at + make_interval(mins => dur);
END IF;
END IF;

RETURN NEW;
END $$;

-- 3) Trigger
DROP TRIGGER IF EXISTS trg_appt_req_set_ends_at ON public.appointment_requests;

CREATE TRIGGER trg_appt_req_set_ends_at
    BEFORE INSERT OR UPDATE ON public.appointment_requests
                         FOR EACH ROW
                         EXECUTE FUNCTION public.appt_req_set_ends_at();

-- 4) Contraintes & index utiles
ALTER TABLE public.appointment_requests
    ADD CONSTRAINT appt_req_duration_override_chk
        CHECK (duration_override_minutes IS NULL OR duration_override_minutes > 0);

CREATE INDEX IF NOT EXISTS idx_appt_req_service_start_end
    ON public.appointment_requests (service_id, starts_at, ends_at);


ALTER TABLE public.appointment_candidates
    ADD COLUMN IF NOT EXISTS decision_token uuid
    NOT NULL DEFAULT gen_random_uuid(),
    ADD COLUMN IF NOT EXISTS decision_expires_at timestamptz
    NOT NULL DEFAULT (now() + interval '48 hours'),
    ADD COLUMN IF NOT EXISTS decision_at timestamptz,
    ADD COLUMN IF NOT EXISTS created_at timestamptz
    NOT NULL DEFAULT now();

-- Tokens pour les anciennes lignes
UPDATE public.appointment_candidates
SET decision_token = gen_random_uuid()
WHERE decision_token IS NULL;

-- Unicité du token
CREATE UNIQUE INDEX IF NOT EXISTS ux_appt_cand_decision_token
    ON public.appointment_candidates(decision_token);

-- Sécurité : unicité (request_id, coach_id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'appointment_candidates_request_coach_uniq'
  ) THEN
ALTER TABLE public.appointment_candidates
    ADD CONSTRAINT appointment_candidates_request_coach_uniq
        UNIQUE (request_id, coach_id);
END IF;
END $$;

-- decision + decided_at attendus par la route /api/coach/requests/decision

-- 1) Colonne decision (valeurs utilisées dans ton code : pending, accepted, declined, auto_declined)
ALTER TABLE public.appointment_candidates
    ADD COLUMN IF NOT EXISTS decision text;

-- Normalise la valeur par défaut à 'pending' si pas déjà défini
DO $$
BEGIN
EXECUTE $q$ UPDATE public.appointment_candidates SET decision = 'pending' WHERE decision IS NULL $q$;
EXCEPTION WHEN undefined_table THEN
  -- ignore si la table n'existe pas (dev early)
END $$;

-- (Optionnel mais propre) contrainte de domaine
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'appointment_candidates_decision_chk'
  ) THEN
ALTER TABLE public.appointment_candidates
    ADD CONSTRAINT appointment_candidates_decision_chk
        CHECK (decision IN ('pending','accepted','declined','auto_declined'));
END IF;
END $$;

-- 2) Colonne decided_at (ton code l'utilise ; si tu avais decision_at, on le recopie)
ALTER TABLE public.appointment_candidates
    ADD COLUMN IF NOT EXISTS decided_at timestamptz;

-- Backfill depuis decision_at → decided_at si l’ancienne colonne existe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='appointment_candidates' AND column_name='decision_at'
  ) THEN
    EXECUTE $q$
UPDATE public.appointment_candidates
SET decided_at = COALESCE(decided_at, decision_at)
WHERE decided_at IS NULL
    $q$;
END IF;
END $$;

-- Lier un rendez-vous à sa demande
ALTER TABLE public.appointments
    ADD COLUMN IF NOT EXISTS request_id bigint
    REFERENCES public.appointment_requests(id) ON DELETE SET NULL;

-- Un seul rendez-vous par demande
CREATE UNIQUE INDEX IF NOT EXISTS ux_appointments_request
    ON public.appointments(request_id)
    WHERE request_id IS NOT NULL;

-- lier le RDV à la demande si la colonne n’existe pas
ALTER TABLE public.appointments
    ADD COLUMN IF NOT EXISTS request_id bigint
    REFERENCES public.appointment_requests(id) ON DELETE SET NULL;

-- unique sur request_id (autorise plusieurs NULLs)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'appointments_request_id_uniq'
  ) THEN
ALTER TABLE public.appointments
    ADD CONSTRAINT appointments_request_id_uniq UNIQUE (request_id);
END IF;
END $$;