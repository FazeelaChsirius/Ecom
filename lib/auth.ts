import axios from "axios"
import { NextAuthOptions, Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

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
                    
                } catch (err: unknown) {
                    if(err instanceof Error) {
                        return null
                    }
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
            if(account?.provider === "google") { 
                try {
                    const payload = {
                        email: user?.email,
                        provider: "google"
                    }
                    const { data } = await axios.post(`${process.env.SERVER}/api/user/login`, payload)
                    user.id = data.id
                    user.email = data.email
                    user.name = data.name
                    user.role = data.role
                    user.address = data.address
                    return true

                } catch (err: unknown) {
                    if(err instanceof Error) {
                        return false
                    }
                }
            }
            return true
        },
        async jwt({token, user}) {
            if(user) {
                token.id = user.id
                token.role = user.role
                token.address = user.address
            }
            return token
        },
        async session({session, token}) {
            if(token) {
                session.user.id = token.id as string
                session.user.role = token.role as string
                session.user.address = token.address as Session['user']['address']
            }
            return session
        }
    },
    secret: process.env.NEXTAUTH_SECRET
}
