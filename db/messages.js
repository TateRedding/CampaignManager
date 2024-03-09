const client = require('./client');
const { createRow, getRowById } = require('./utils');

const createMessage = async ({ ...fields }) => {
    try {
        return await createRow('messages', fields);
    } catch (error) {
        console.error(error);
    };
};

const updateMessage = async (id, content) => {
    content = content.replaceAll("'", "''");
    try {
        const { rows: [message] } = await client.query(`
            UPDATE messages
            SET content='${content}'
            WHERE id=${id}
            RETURNING *;
        `);
        return message;
    } catch (error) {
        console.error(error);
    };
};

const deleteMessage = async (id) => {
    try {
        const { rows: [message] } = await client.query(`
            DELETE FROM messages
            WHERE id=${id}
            RETURNING *;
        `);
        return message;
    } catch (error) {
        console.error(error);
    };
};

const getMessageById = async (id) => {
    try {
        return await getRowById('messages', id)
    } catch (error) {
        console.error(error);
    };
};

const getInvitationsAndRequestsByUserId = async (userId) => {
    try {
        const { rows: messages } = await client.query(`
            SELECT messages.*, campaigns."creatorId" AS "campaignCreatorId"
            FROM messages
            JOIN campaigns
                ON messages."campaignId"=campaigns.id
            WHERE (type = 'invitation' OR type = 'join_request')
            AND "recipientId"=${userId}
        `);
        return messages;
    } catch (error) {
        console.error(error);
    };
};

const getPrivateMessagesByUserId = async (userId) => {
    try {
        const { rows: users } = await client.query(`
            SELECT a.username, a."avatarURL", a.id as "userId"
            FROM users a
            JOIN (
                SELECT DISTINCT users.id
                    FROM users
                    JOIN messages
                        ON
                            (CASE
                                WHEN messages."senderId"=${userId}
                                    THEN messages."recipientId"=users.id
                                ELSE messages."senderId"=users.id
                            END)
                    WHERE messages.type='private'
                    AND (messages."senderId"=${userId}
                        OR messages."recipientId"=${userId})
            ) AS b
                ON a.id=b.id;
        `);
        for (let i = 0; i < users.length; i++) {
            const { rows: messages} = await client.query(`
                SELECT *
                FROM messages
                WHERE (
                    (
                        "senderId"=${userId}
                            AND "recipientId"=${users[i].userId}
                    ) OR (
                        "senderId"=${users[i].userId}
                            AND "recipientId"=${userId}
                    )
                )
                AND type='private'
            `);
            users[i].messages = messages;
        };
        return users;
    } catch (error) {
        console.error(error);
    };
}

const getPublicMessagesByCampaignId = async (campaignId) => {
    try {
        const { rows: messages } = await client.query(`
            SELECT *
            FROM messages
            WHERE "campaignId"=${campaignId}
            AND type='public'
        `)
        return messages;
    } catch (error) {
        console.error(error);
    };
};


module.exports = {
    createMessage,
    updateMessage,
    deleteMessage,
    getMessageById,
    getInvitationsAndRequestsByUserId,
    getPrivateMessagesByUserId,
    getPublicMessagesByCampaignId
};