const INSERT_PROFILE_QUERY = `
    INSERT INTO profiles(email, user_id, first_name, last_name) VALUES($1, $2, $3, $4)
`;

module.exports = INSERT_PROFILE_QUERY;
