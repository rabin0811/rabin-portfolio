const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;
const isSupabase = dbUrl?.includes('supabase.co');

const adapter = new PrismaPg({
    connectionString: dbUrl,
    ...(isSupabase ? { ssl: { rejectUnauthorized: false } } : {}),
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;
