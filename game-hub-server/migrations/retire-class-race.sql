-- The retired shared quiz player must not restore old rooms or retain their codes.
-- Repeated startup is safe; other games and app-specific competitions are untouched.
DELETE FROM multiplayer_room_snapshots WHERE game_id = 'quizrace';
DELETE FROM site_room_codes WHERE activity = 'game:quizrace';
