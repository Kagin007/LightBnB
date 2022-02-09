INSERT INTO users (name, email, password)
VALUES ('Adam', 'adam@g.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Lindsay', 'linds@g.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Jacob', 'jacob@g.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES (1, 'title', 'description', 'thumbnailPhotoURL', 'coverPhotoURL', 299.99, 2, 2, 3, 'Canada', 'Booger St', 'Snots City', 'Ontario', 'L6B 321'),

(3, 'title', 'description', 'thumbnailPhotoURL', 'coverPhotoURL', 199.99, 3, 1, 3, 'Canada', 'Stooger St', 'Hi City', 'Quebec', 'L6B 123'),

(2, 'title', 'description', 'thumbnailPhotoURL', 'coverPhotoURL', 50.99, 2, 0, 3, 'Canada', 'Mooger St', 'Yo City', 'Ontario', 'L6B 455');

INSERT INTO reservations (guest_id, property_id, start_date, end_date)
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (rating, message)
VALUES (2, 'message'),
(5, 'message');
