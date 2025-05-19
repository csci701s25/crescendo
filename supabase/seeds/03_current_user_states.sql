INSERT INTO current_user_states (
    id,
    current_track_id,
    track_name,
    artist_name,
    album_name,
    album_image_url,
    location,
    is_playing,
    updated_at
) VALUES
('365630b7-9f05-4d73-b162-072523b6cbd8', 'track1', 'Song One', 'Artist A', 'Album X', 'https://i.scdn.co/image/1', gis.ST_GeogFromText('SRID=4326;POINT(-73.9857 40.7484)'), true, '2025-05-01 20:49:14.857+00'),
('1a2b3c4d-5e6f-4a8b-9c0d-1e2f3a4b5c6d', 'track2', 'Song Two', 'Artist B', 'Album Y', 'https://i.scdn.co/image/2', gis.ST_GeogFromText('SRID=4326;POINT(-73.1625 44.0113)'), false, '2025-05-01 20:49:14.857+00'),-- in radius
('2b3c4d5e-6f7a-4b9c-8d0e-2f3a4b5c6d7e', 'track3', 'Song Three', 'Artist C', 'Album Z', 'https://i.scdn.co/image/3', gis.ST_GeogFromText('SRID=4326;POINT(-0.1276 51.5074)'), true, '2025-05-01 20:49:14.857+00'),
('3c4d5e6f-7a8b-4c9d-0e1f-3a4b5c6d7e8f', 'track4', 'Song Four', 'Artist D', 'Album W', 'https://i.scdn.co/image/4', gis.ST_GeogFromText('SRID=4326;POINT(2.3522 48.8566)'), false, '2025-05-01 20:49:14.857+00'),
('4d5e6f7a-8b9c-4d0e-1f2a-4b5c6d7e8f9a', 'track5', 'Song Five', 'Artist E', 'Album V', 'https://i.scdn.co/image/5', gis.ST_GeogFromText('SRID=4326;POINT(-73.1459 44.0337)'), true, '2025-05-01 20:49:14.857+00'), -- in radius
('5e6f7a8b-9c0d-4e1f-2a3b-5c6d7e8f9a0b', 'track6', 'Song Six', 'Artist F', 'Album U', 'https://i.scdn.co/image/6', gis.ST_GeogFromText('SRID=4326;POINT(151.2093 -33.8688)'), false, '2025-05-01 20:49:14.857+00'),
('6f7a8b9c-0d1e-4f2a-3b4c-6d7e8f9a0b1c', 'track7', 'Song Seven', 'Artist G', 'Album T', 'https://i.scdn.co/image/7', gis.ST_GeogFromText('SRID=4326;POINT(-73.1728 43.9831)'), true, '2025-05-01 20:49:14.857+00'), -- in radius
('7a8b9c0d-1e2f-4a3b-5c6d-7e8f9a0b1c2d', 'track8', 'Song Eight', 'Artist H', 'Album S', 'https://i.scdn.co/image/8', gis.ST_GeogFromText('SRID=4326;POINT(18.4241 -33.9249)'), false, '2025-05-01 20:49:14.857+00'),
('8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e', 'track9', 'Song Nine', 'Artist I', 'Album R', 'https://i.scdn.co/image/9', gis.ST_GeogFromText('SRID=4326;POINT(28.0473 -26.2041)'), true, '2025-05-01 20:49:14.857+00'),
('9c0d1e2f-3a4b-4c5d-7e8f-9a0b1c2d3e4f', 'track10', 'Song Ten', 'Artist J', 'Album Q', 'https://i.scdn.co/image/10', gis.ST_GeogFromText('SRID=4326;POINT(31.2357 30.0444)'), false, '2025-05-01 20:49:14.857+00');