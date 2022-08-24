-- Revert kanban:init from pg

BEGIN;

DROP TABLE "card_has_label", "label", "card", "list";

COMMIT;
