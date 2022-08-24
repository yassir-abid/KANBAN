# MLD - Modèle logique des données

- list (id, title, position, created_at, updated_at)
- card (id, title, color, position, #list_id, created_at, updated_at)
- label (id, title, color, created_at, updated_at)
- card_has_label (#card_id, #label_id, created_at)