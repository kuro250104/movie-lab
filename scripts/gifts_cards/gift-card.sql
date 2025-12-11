DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gift_card_status') THEN
            CREATE TYPE gift_card_status AS ENUM ('active', 'empty', 'expired', 'cancelled');
        END IF;
    END
$$;

CREATE TABLE IF NOT EXISTS gift_cards (
                                          id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                          code                    text NOT NULL UNIQUE,          -- ex: MOVI-ABCD-1234

                                          amount_cents            integer NOT NULL,              -- montant initial en cents (5000 = 50€)
                                          remaining_cents         integer NOT NULL,              -- solde restant

                                          currency                text NOT NULL DEFAULT 'eur',
                                          status                  gift_card_status NOT NULL DEFAULT 'active',

                                          buyer_email             text,                          -- mail de l'acheteur
                                          recipient_email         text,                          -- mail du bénéficiaire (si différent)

                                          stripe_payment_intent_id    text,
                                          stripe_session_id           text,

    -- si tu veux une validité
                                          expires_at              timestamptz,                   -- ex: now() + interval '12 months'

                                          created_at              timestamptz NOT NULL DEFAULT now(),
                                          updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gift_cards_code ON gift_cards (code);
CREATE INDEX IF NOT EXISTS idx_gift_cards_status ON gift_cards (status);

CREATE TABLE IF NOT EXISTS gift_card_redemptions (
                                                     id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                                     gift_card_id    uuid NOT NULL REFERENCES gift_cards(id) ON DELETE CASCADE,
                                                     appointment_id  uuid,                      -- si tu as un id uuid sur appointments
                                                     redeemed_cents  integer NOT NULL,          -- montant utilisé sur cette carte pour cet usage
                                                     created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_redemptions_gift_card_id ON gift_card_redemptions (gift_card_id);