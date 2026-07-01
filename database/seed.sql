INSERT INTO college (name, email, password)
VALUES
(
    'AI Engineering College',
    'admin@ai.edu.in',
    '1234'
),
(
    'ML Engineering College',
    'admin@ml.edu.in',
    '1234'
);





INSERT INTO allocation_sessions
(college_id, title, academic_year, room_capacity, session_status)
VALUES
(
    1,
    '2026 First Year Hostel Allocation',
    '2026-2027',
    4,
    'Draft'
);




INSERT INTO student
(
college_id,
allocation_session_id,
name,
roll_number,
email,
branch,
year_of_study,
gender
)

VALUES

(1,1,'Rahul Sharma','22CSE001','rahul@aiec.edu.in','CSE',2,'Male'),

(1,1,'Surya Nampally','22CSE002','surya@aiec.edu.in','CSE',2,'Male'),

(1,1,'Bhanu Prasad','22CSE003','bhanu@aiec.edu.in','CSE',2,'Male'),

(1,1,'Jitesh Reddy','22CSE004','jitesh@aiec.edu.in','CSE',2,'Male'),

(1,1,'Ananya Rao','22ECE001','ananya@aiec.edu.in','ECE',2,'Female'),

(1,1,'Sneha Patel','22ECE002','sneha@aiec.edu.in','ECE',2,'Female'),

(1,1,'Harsha Kumar','22EEE001','harsha@aiec.edu.in','EEE',2,'Male'),

(1,1,'Kiran Kumar','22ME001','kiran@aiec.edu.in','Mechanical',2,'Male'),

(1,1,'Priya Singh','22IT001','priya@aiec.edu.in','IT',2,'Female'),

(1,1,'Sai Teja','22CIV001','sai@aiec.edu.in','Civil',2,'Male');





INSERT INTO interview
(student_id,conversation)

VALUES

(1,'Interview completed successfully.'),

(2,'Interview completed successfully.'),

(3,'Interview completed successfully.'),

(4,'Interview completed successfully.'),

(5,'Interview completed successfully.'),

(6,'Interview completed successfully.'),

(7,'Interview completed successfully.'),

(8,'Interview completed successfully.'),

(9,'Interview completed successfully.'),

(10,'Interview completed successfully.');





INSERT INTO traits
(
student_id,
sleep_time,
wake_time,
study_style,
noise_tolerance,
cleanliness,
social_level,
flexible_preferences,
non_negotiable_preferences,
personality_summary,
trait_json
)

VALUES

(
1,
'10:00 PM',
'6:00 AM',
'Group Study',
3.5,
4.8,
4.5,
'Can adjust study timings',
'{"Smoking":"No","Alcohol":"No"}',
'Friendly and disciplined',
'{}'
),

(
2,
'11:00 PM',
'7:00 AM',
'Solo Study',
2.8,
4.0,
3.2,
'Flexible with lights',
'{"Smoking":"No"}',
'Quiet and focused',
'{}'
),

(
3,
'10:30 PM',
'6:30 AM',
'Group Study',
3.9,
4.5,
4.8,
'Flexible on weekends',
'{"Smoking":"No"}',
'Highly social',
'{}'
),

(
4,
'12:00 AM',
'8:00 AM',
'Solo Study',
4.0,
3.8,
3.5,
'Flexible about roommates',
'{"Alcohol":"No"}',
'Calm personality',
'{}'
),

(
5,
'10:00 PM',
'6:00 AM',
'Solo Study',
2.5,
5.0,
2.8,
'Can compromise on lights',
'{"Smoking":"No"}',
'Very organized',
'{}'
),

(
6,
'11:00 PM',
'7:00 AM',
'Group Study',
3.6,
4.1,
4.2,
'Flexible sleep schedule',
'{"Smoking":"No"}',
'Outgoing personality',
'{}'
),

(
7,
'10:30 PM',
'6:30 AM',
'Solo Study',
3.0,
4.6,
3.7,
'Can adjust noise',
'{"Smoking":"No"}',
'Responsible student',
'{}'
),

(
8,
'12:00 AM',
'8:00 AM',
'Group Study',
4.4,
3.7,
4.6,
'Flexible weekends',
'{"Alcohol":"No"}',
'Friendly roommate',
'{}'
),

(
9,
'9:30 PM',
'5:30 AM',
'Solo Study',
2.2,
4.9,
2.5,
'Flexible room arrangement',
'{"Smoking":"No"}',
'Disciplined and punctual',
'{}'
),

(
10,
'11:30 PM',
'7:30 AM',
'Group Study',
4.1,
3.9,
4.0,
'Flexible cleaning schedule',
'{"Smoking":"No"}',
'Easy going personality',
'{}'
);






INSERT INTO compatibility_scores
(
allocation_session_id,
student1_id,
student2_id,
compatibility_score
)

VALUES

(1,1,2,91.50),

(1,1,3,95.30),

(1,1,4,84.60),

(1,2,3,90.20),

(1,2,4,88.10),

(1,3,4,92.80),

(1,5,6,94.70),

(1,5,9,96.20),

(1,6,9,90.80),

(1,7,8,89.40),

(1,8,10,91.10),

(1,7,10,87.90);












INSERT INTO recommendations
(
allocation_session_id,
room_number,
compatibility_score,
reason
)

VALUES

(
1,
'Room-101',
92.5,
'Students have highly compatible sleep schedules, cleanliness habits, and study preferences.'
),

(
1,
'Room-102',
91.3,
'Students demonstrate strong social compatibility and flexible daily routines.'
);















INSERT INTO recommendation_members
(
recommendation_id,
student_id
)

VALUES

(1,1),
(1,2),
(1,3),
(1,4),

(2,5),
(2,6),
(2,9),
(2,10);