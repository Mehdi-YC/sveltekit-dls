import { db } from "../lib/db/index";
import { blog,user } from "../lib/db/schema/index";
import { eq,sql } from "drizzle-orm";
import { auth } from '../lib/server/lucia'
// export const load = async () => {
//     return { streamed: { blogs:  await fetchBlogs() } };
// };

// const fetchBlogs = async () => {
//     console.log("loading blogs...");
//     const blogs =   await db
//         .select()
//         .from(blog)
//         .limit(1);
//         //.where(eq(PageInsights.id, 1));

//     //console.log("blogs : ",blogs);
//     return blogs;
// };

import { redirect } from "@sveltejs/kit";


export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, "/login");
	return {
		userId: session.user.userId,
		username: session.user.username
	};
};

export const actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId); // invalidate session
		locals.auth.setSession(null); // remove cookie
		throw redirect(302, "/login"); // redirect to login page
	}
};