-- Verify kanban:init on pg

BEGIN;

SELECT * FROM "user" WHERE false;
SELECT * FROM "list" WHERE false;
SELECT * FROM "card" WHERE false;
SELECT * FROM "label" WHERE false;
SELECT * FROM "card_has_label" WHERE false;

ROLLBACK;
