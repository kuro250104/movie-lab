-- 1) Suppléments disponibles
CREATE TABLE IF NOT EXISTS public.supplements (
                                                  id           SERIAL PRIMARY KEY,
                                                  name         TEXT        NOT NULL,
                                                  description  TEXT        NULL,
                                                  price        NUMERIC(10,2) NOT NULL DEFAULT 0,
    is_active    BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
    );

-- 2) Catalogue: quels suppléments sont proposés pour chaque service
CREATE TABLE IF NOT EXISTS public.service_supplements (
                                                          service_id    INT NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    supplement_id INT NOT NULL REFERENCES public.supplements(id) ON DELETE CASCADE,
    PRIMARY KEY (service_id, supplement_id)
    );

-- 3) Choix de l’utilisateur pour une demande de RDV
CREATE TABLE IF NOT EXISTS public.appointment_request_supplements (
                                                                      request_id    INT NOT NULL REFERENCES public.appointment_requests(id) ON DELETE CASCADE,
    supplement_id INT NOT NULL REFERENCES public.supplements(id) ON DELETE RESTRICT,
    price_at_booking NUMERIC(10,2) NOT NULL,
    PRIMARY KEY (request_id, supplement_id)
    );



ALTER TABLE public.appointment_requests
    ADD COLUMN client_id bigint REFERENCES public.clients(id);