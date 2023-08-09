import { NextFunction, Request, Response } from "express";
import OktaJwtVerifier from '@okta/jwt-verifier';

const oktaJwtVerifier = new OktaJwtVerifier({
    issuer: 'https://dev-71327126.okta.com/oauth2/default'
});

const audience = 'api://default';

export const authenticationRequired = async (
    req: Request, res: Response, next: NextFunction,
) => {
    const authHeader = req.headers.authorization || '';
    const match = authHeader.match(/Bearer (.+)/);
    if (!match) {
        return res.status(401).send();
    }

    try {
        const accessToken = match[1];
        console.log(accessToken)
        if (!accessToken) {
            return res.status(401).send();
        }
        req.body.jwt = await oktaJwtVerifier.verifyAccessToken(
            accessToken, audience,
        );
        next();
    } catch (err) {
        return res.status(401).send(
            (err as unknown & { message: string }).message,
        );
    }
};