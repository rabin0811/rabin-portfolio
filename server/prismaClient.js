const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const dbUrl = process.env.DATABASE_URL;

const adapter = new PrismaPg({
    connectionString: dbUrl,
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;
