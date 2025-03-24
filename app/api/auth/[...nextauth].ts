// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import dbConnect from "../../../config/database";
// import User from "../../../models/user";
// import bcrypt from "bcryptjs";

// export default NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials) {
//           throw new Error("No credentials provided.");
//         }

//         const { email, password } = credentials;

//         await dbConnect();

//         const user = await User.findOne({ email });

//         if (!user) {
//           throw new Error("No user found with this email.");
//         }

//         const isPasswordValid = bcrypt.compareSync(password, user.password);
//         if (!isPasswordValid) {
//           throw new Error("Invalid password.");
//         }

//         // Return user object if authentication is successful
//         return {
//           id: user._id.toString(),
//           email: user.email,
//           name: user.fullname,
//         };
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },
//  callbacks: {
//   async session({ session, token }) {
//     if (session.user) {
//       session.user.id = token.sub;
//       session.user.email = token.email;
//       session.user.name = token.name;
//     }
//     return session;
//   },
// },
//   secret: process.env.NEXTAUTH_SECRET,
// });
