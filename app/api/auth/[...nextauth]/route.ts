import axios from "axios"
import NextAuth, { NextAuthOptions, Session, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

interface CustomSessionInterface extends Session {
    user: {
        id: string
        email: string
        name: string
        gender: string
        age: string
        createdAt: string
    }
}

interface CustomUserInterface extends User{
    gender: string
    age: string
    createdAt: string
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {label: "Email", name: "email"},
                password: {label: "Password", name: "password"}
            },
            async authorize(credentials) {
                try {
                    const payload = {
                        email: credentials?.email,
                        password: credentials?.password
                    }
                    const { data } = await axios.post(`${process.env.SERVER}/api/user/login`, payload)
                    return data
                    
                } catch (err) {
                    return null
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string 
        })
    ],
    pages: {
        signIn: '/login',
        error: '/auth-failed'
    },
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async signIn({user, account}) {
            const customUser = user as CustomUserInterface
            if(account?.provider === "google") { 
                try {
                    const payload = {
                        email: customUser?.email,
                        provider: "google"
                    }
                    const { data } = await axios.post(`${process.env.SERVER}/api/user/login`, payload)
                    customUser.id = data.id
                    customUser.email = data.email
                    customUser.name = data.name
                    customUser.gender = data.gender
                    customUser.age = data.age
                    customUser.createdAt = data.createdAt
                    return true

                } catch (err) {
                    return false
                }
            }
            return true
        },
        async jwt({token, user}) {
            const customUser = user as CustomUserInterface
            if(customUser) {
                token.id = customUser.id
                token.gender = customUser.gender 
                token.age = customUser.age
                token.createdAt = customUser.createdAt
            }
            return token
        },
        async session({session, token}) {
            const customSession = session as CustomSessionInterface
            if(token) {
                customSession.user.id = token.id as string
                customSession.user.gender = token.gender as string
                customSession.user.age = token.age as string
                customSession.user.createdAt = token.createdAt as string
            }
            return customSession
        }
    },
    secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }