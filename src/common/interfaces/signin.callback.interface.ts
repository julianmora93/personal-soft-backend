// import { CognitoUser } from "amazon-cognito-identity-js";

// export interface SigninCallbackInterface {
//     onSuccessful(data: SigninCallbackOnSuccessInterface): void;
//     onFailure(data: SigninCallbackOnFailureInterface): void;
// }

// export interface SigninCallbackOnSuccessInterface {
//     refreshToken: string;
//     accessToken: string;
//     accessTokenExpiresAt: number;
//     idToken: string;
//     idTokenExpiresAt: number;
// }

// export interface SigninCallbackOnFailureInterface {
//     nextStep: string;
//     data: CognitoUser;
//     error?: any | null;
// }

// import { CognitoUser } from "amazon-cognito-identity-js";

// export interface SigninCallbackInterface {
//     session?: SigninCallbackSessionInterface,
//     error?: SigninCallbackErrorInterface
// }

// export interface SigninCallbackSessionInterface {
//     refreshToken: string;
//     accessToken: string;
//     accessTokenExpiresAt: number;
//     idToken: string;
//     idTokenExpiresAt: number;
// }

// export interface SigninCallbackErrorInterface {
//     nextStep: string;
//     data: CognitoUser;
//     error?: any | null;
// }