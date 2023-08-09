import { Request } from "express"

export type WebTokenRequest = Request & { jwt: { claims: unknown } }