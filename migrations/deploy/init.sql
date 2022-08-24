-- Deploy kanban:init to pg

BEGIN;

CREATE TABLE "list" (
    "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "title" TEXT NOT NULL,
    "position" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "card" (
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "title" TEXT NOT NULL,
  "color" TEXT,
  "position" SMALLINT NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ,
  "list_id" INTEGER NOT NULL REFERENCES "list"("id") ON DELETE CASCADE
);

CREATE TABLE "label" (
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "title" TEXT NOT NULL,
  "color" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "card_has_label" (
  "card_id" INTEGER NOT NULL REFERENCES "card"("id") ON DELETE CASCADE,
  "label_id" INTEGER NOT NULL REFERENCES "label"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("card_id", "label_id")
);

COMMIT;
