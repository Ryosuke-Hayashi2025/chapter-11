// import { PrismaClient } from '@/app/generated/prisma/client' 
// import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'; 

// const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" }) 

// export const prisma = new PrismaClient({ adapter })

import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
})

export const prisma = new PrismaClient({ adapter })