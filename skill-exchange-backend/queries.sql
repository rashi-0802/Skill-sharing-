-- Demo queries for the viva. Run in any SQLite client against skillexchange.db.

-- 1. Who can teach me what I want? (JOIN on the two junction tables) -- student 1
SELECT t.Name AS Teacher, sk.SkillName, so.ProficiencyLevel
FROM SKILL_WANTED mw
JOIN SKILL_OFFERED so ON so.SkillID = mw.SkillID
JOIN STUDENT t ON t.StudentID = so.StudentID
JOIN SKILL sk ON sk.SkillID = mw.SkillID
WHERE mw.StudentID = 1 AND t.StudentID <> 1;

-- 2. Average rating each teacher received (GROUP BY + HAVING)
SELECT t.Name, COUNT(*) AS Reviews, ROUND(AVG(f.Rating), 2) AS AvgRating
FROM EXCHANGE e
JOIN STUDENT t ON t.StudentID = e.TeacherID
JOIN FEEDBACK f ON f.ExchangeID = e.ExchangeID AND f.GivenBy = e.LearnerID
GROUP BY t.StudentID
HAVING COUNT(*) >= 1
ORDER BY AvgRating DESC;

-- 3. Skills with more learners than teachers (demand > supply) -- subqueries
SELECT sk.SkillName,
       (SELECT COUNT(*) FROM SKILL_OFFERED WHERE SkillID = sk.SkillID) AS Teachers,
       (SELECT COUNT(*) FROM SKILL_WANTED  WHERE SkillID = sk.SkillID) AS Learners
FROM SKILL sk
WHERE (SELECT COUNT(*) FROM SKILL_WANTED WHERE SkillID = sk.SkillID)
    > (SELECT COUNT(*) FROM SKILL_OFFERED WHERE SkillID = sk.SkillID);

-- 4. Full history of every exchange (multi-table JOIN, STUDENT joined twice)
SELECT e.ExchangeID, t.Name AS Teacher, l.Name AS Learner, sk.SkillName, e.Status,
       COUNT(s.SessionID) AS Sessions
FROM EXCHANGE e
JOIN STUDENT t ON t.StudentID = e.TeacherID
JOIN STUDENT l ON l.StudentID = e.LearnerID
JOIN SKILL sk ON sk.SkillID = e.SkillID
LEFT JOIN SESSION s ON s.ExchangeID = e.ExchangeID
GROUP BY e.ExchangeID;

-- 5. Students who offer a skill but have never taught it (NOT EXISTS)
SELECT st.Name, sk.SkillName
FROM SKILL_OFFERED so
JOIN STUDENT st ON st.StudentID = so.StudentID
JOIN SKILL sk ON sk.SkillID = so.SkillID
WHERE NOT EXISTS (
  SELECT 1 FROM EXCHANGE e WHERE e.TeacherID = so.StudentID AND e.SkillID = so.SkillID
);

-- 6. A view that frontends/reports can reuse
CREATE VIEW IF NOT EXISTS V_ACTIVE_EXCHANGES AS
SELECT e.ExchangeID, t.Name AS Teacher, l.Name AS Learner, sk.SkillName, e.Status
FROM EXCHANGE e
JOIN STUDENT t ON t.StudentID = e.TeacherID
JOIN STUDENT l ON l.StudentID = e.LearnerID
JOIN SKILL sk ON sk.SkillID = e.SkillID
WHERE e.Status IN ('Pending', 'Accepted');

-- 7. Unread messages per student
SELECT r.Name AS Recipient, COUNT(*) AS Unread
FROM MESSAGE m
JOIN STUDENT r ON r.StudentID = m.ReceiverID
WHERE m.IsRead = 0
GROUP BY r.StudentID;

-- 8. Weekly availability hours (approximation by slot count)
SELECT st.Name, a.DayOfWeek, COUNT(*) AS Slots
FROM AVAILABILITY a
JOIN STUDENT st ON st.StudentID = a.StudentID
WHERE a.Enabled = 1
GROUP BY st.StudentID, a.DayOfWeek;
