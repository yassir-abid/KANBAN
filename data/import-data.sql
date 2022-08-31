BEGIN;

TRUNCATE "card_has_label", "label", "card", "list" RESTART IDENTITY;

INSERT INTO "list" ("title", "position")
    VALUES 
        ('To do', 0),
        ('Done', 1);

INSERT INTO "card" ("title", "color", "position", "list_id")
    VALUES
        ('Agenda', '#ff00ff', 0, 2),
        ('Search Bar', '#f8d1ba', 1, 2),
        ('Documentation', '#038832', 0, 1);

INSERT INTO "label" ("title", "color")
    VALUES
        ('Front', 'red'),
        ('Back', 'yellow');

INSERT INTO "card_has_label" ("card_id", "label_id")
    VALUES
        (1, 1),
        (1, 2),
        (2, 1),
        (3, 2);

COMMIT; 