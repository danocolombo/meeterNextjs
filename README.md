### Meeter NextJs Repo

This is a simple experiment to implement a nextjs application on Vercel and use some tools I have not used frequently.

-   NextJs 14
-   ShadCn UI library
-   Supabase 2.42
-   Prisma 5.22.0
-   Clerk
-   Tailwinds
-   Zod
-   Stripe
-   Vercel deployment

This was only possible by the great tutorial of John Smilga the coding addict...

Udemy - Mastering Next.js

---

### Development needs

1. .env.local file needs to define the Clerk definitions
2. .env for Subabase
3. install prisma and run locally...
   <code>npx prisma studio</code>

    if you make changes to local prisma/schema.prisma to push to database (migrate)...
    <code>npx prisma db push
    </code>
