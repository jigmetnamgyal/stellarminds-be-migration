const INSERT_JOURNALS_QUERY = `
    INSERT INTO journals (user_id, title, created_at, emotion_type, entries, overall_entry) VALUES($1, $2, $3, $4, $5, $6)
`;

module.exports = INSERT_JOURNALS_QUERY;
