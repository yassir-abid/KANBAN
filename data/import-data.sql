BEGIN;

TRUNCATE "card_has_label", "label", "card", "list", "user" RESTART IDENTITY;

INSERT INTO "user" ("email", "password", "firstname", "lastname")
    VALUES 
        ('chuck@norris.fr', 'chuck56', 'chuck', 'norris');

INSERT INTO "list" ("title", "position", "user_id")
    VALUES 
        ('To do', 0, 1),
        ('Done', 1, 1);

INSERT INTO "card" ("title", "color", "position", "list_id")
    VALUES
        ('Agenda', '#b4ccf3', 0, 2),
        ('Search Bar', '#f8d1ba', 1, 2),
        ('Documentation', '#4c9e69', 0, 1);

INSERT INTO "label" ("title", "color")
    VALUES
        ('Front', '#f28282'),
        ('Back', '#a8eaa4');

INSERT INTO "card_has_label" ("card_id", "label_id")
    VALUES
        (1, 1),
        (1, 2),
        (2, 1),
        (3, 2);

COMMIT; 