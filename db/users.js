const client = require('./client');
const bcrypt = require('bcrypt');
const { createRow, updateRow, getRowById } = require('./utils');
const { getCampaignsByUserId, getOpenCampaignsByUserId } = require('./campaigns');
const { getCharactersByUserId } = require('./characters');
const { getInvitationsAndRequestsByUserId, getPrivateMessagesByUserId } = require('./messages');

const createUser = async ({ ...fields }) => {
    if (!fields.avatarURL) {
        fields.avatarURL = "../images/default_avatar.svg";
    };
    try {
        fields.password = await bcrypt.hash(fields.password, 10);
        const user = await createRow('users', fields);
        delete user.password;
        return user;
    } catch (error) {
        console.error(error);
    };
};

const updateUser = async (id, { ...fields }) => {
    try {
        const user = await updateRow('users', id, fields);
        delete user.password;
        return user;
    } catch (error) {
        console.error(error);
    };
};

const deactivateUser = async (userId) => {
    try {
        const { rows: [user] } = await client.query(`
            UPDATE users
            SET "isActive"=false, "deactivationDate"=CURRENT_TIMESTAMP
            WHERE id=${userId}
            RETURNING *;
        `);
        return user;
    } catch (error) {
        console.error(error);
    };
};

const getUser = async ({ username, password }) => {
    try {
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE username='${username}';
        `);
        if (user && await bcrypt.compare(password, user.password)) {
            delete user.password;
            return user;
        };
        return null;
    } catch (error) {
        console.error(error);
    };
};

const getUserById = async (id) => {
    try {
        const user = await getRowById('users', id);
        if (user) {
            delete user.password;
            return user;
        };
        return null;
    } catch (error) {
        console.error(error);
    };
};

const getAllUserDataById = async (id) => {
    try {
        const user = await getRowById('users', id);
        if (user) {
            delete user.password;
            user.campaigns = await getCampaignsByUserId(user.id);
            user.characters = await getCharactersByUserId(user.id);
            user.invitationsAndRequests = await getInvitationsAndRequestsByUserId(user.id);
            user.privateMessages = await getPrivateMessagesByUserId(user.id);
            return user;
        };
        return null;
    } catch (error) {
        console.error(error);
    };
};

const getPublicUserDataByUsername = async (username) => {
    try {
        const user = await getUserByUsername(username);
        if (user) {
            delete user.password;
            user.campaigns = await getOpenCampaignsByUserId(user.id);
            user.characters = await getCharactersByUserId(user.id);
            return user;
        };
        return null;
    } catch (error) {
        console.error(error);
    };

};

const getUserByUsername = async (username) => {
    try {
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE username='${username}';
        `);
        if (user) {
            delete user.password;
            return user;
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
    };
};

const getUsersLookingForGroup = async () => {
    try {
        const { rows: users } = await client.query(`
            SELECT *
            FROM users
            WHERE "lookingForGroup"=true;
        `);
        if (users) {
            users.map(user => delete user.password);
            return users;
        };
        return null;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createUser,
    updateUser,
    deactivateUser,
    getUser,
    getUserById,
    getAllUserDataById,
    getPublicUserDataByUsername,
    getUserByUsername,
    getUsersLookingForGroup
};