export interface SigninResponseInterface {
    session?: SigninResponseSessionInterface | null;
    error?: SigninResponseErrorInterface | null;
}

export interface SigninResponseSessionInterface {
    refreshToken: string;
    accessToken: string;
    accessTokenExpiresAt: number;
    idToken: string;
    idTokenExpiresAt: number;
}

export interface SigninResponseErrorInterface {
    code: string;
    nextStep: string;
    data?: any | null;
}