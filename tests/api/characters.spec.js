const { emptyTables } = require('../utils');
const request = require("supertest");
const app = require("../../app");

describe("/api/characters", () => {

    beforeEach(async () => emptyTables());
    
    describe("GET /api/characters", () => {
        // Returns a list of public and private characters if logged in user is an admin
        // Returns a list of all public characters if no user is logged in or logged in user is not an admin
        // Does NOT return private characters if logged in user is not an admin

    });

    describe("GET /api/characters/:characterId", () => {
        // Returns the data for a character with a given id
        // Returns the data for a private character if logged in user is the owner of the character
        // Returns the data for a private character if logged in user is NOT the owner of the character, but is an admin
        // Returns a relevant error if the character is private and no user is logged in or logged in user is not the owner of the character
    });

    describe("POST /api/characters", () => {

    });

    describe("PATCH /api/characters/:characterId", () => {

    });

    describe("DELET /api/characters/:characeterId", () => {

    });
});