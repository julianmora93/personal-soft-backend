import { AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoUserSession, IAuthenticationDetailsData } from "amazon-cognito-identity-js";
import { SigninResponseInterface } from "../common/interfaces/signin.response.interface";

export class UserService {

    static singin(userName: string, password: string): Promise<SigninResponseInterface> {
        return new Promise((resolve, reject) => {
            
            const { ENV_CLIENT_ID, ENV_USER_POOL_ID } = process.env;

            if(!ENV_CLIENT_ID || !ENV_USER_POOL_ID){
                reject({
                    error: {
                        code: '0x001',
                        nextStep: 'ENVIRONMENT_VAR_FAILED',
                        data: 'Environment vars failed configuration'
                    },
                    session: null
                });
            }
    
            const userPool = new CognitoUserPool({
                ClientId: ENV_CLIENT_ID ?? '',
                UserPoolId: ENV_USER_POOL_ID ?? ''
            });
    
            const authenticationData: IAuthenticationDetailsData = {
                Username: userName,
                Password: password
            };
    
            const authenticationDetails = new AuthenticationDetails(authenticationData);
    
            const cognitoUser = new CognitoUser({
                Username: userName,
                Pool: userPool
            });
    
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: function(session: CognitoUserSession) {
                    resolve({
                        session: {
                            refreshToken: session.getRefreshToken().getToken(),
                            accessToken: session.getAccessToken().getJwtToken(),
                            accessTokenExpiresAt: session.getAccessToken().getExpiration(),
                            idToken: session.getIdToken().getJwtToken(),
                            idTokenExpiresAt: session.getAccessToken().getExpiration()
                        },
                        error: null
                    });
                },
                onFailure: function(error: any) {
                    reject({
                        error: {
                            code: '0x002',
                            nextStep: 'FAILURE',
                            data: error
                        },
                        session: null
                    });
                },
                mfaRequired: function() {
                    reject({
                        error: {
                            code: '0x003',
                            nextStep: 'MFA_AUTH',
                            data: null
                        },
                        session: null
                    });
                },
                totpRequired: function() {
                    reject({
                        error: {
                            code: '0x004',
                            nextStep: 'SOFTWARE_TOKEN_MFA',
                            data: null
                        },
                        session: null
                    });
                },
                newPasswordRequired: function(userAttributes: any) {
                    delete userAttributes.email_verified;
                    delete userAttributes.email;
                    cognitoUser.completeNewPasswordChallenge(password, userAttributes, {
                        onSuccess(session: CognitoUserSession) {
                            resolve({
                                session: {
                                    refreshToken: session.getRefreshToken().getToken(),
                                    accessToken: session.getAccessToken().getJwtToken(),
                                    accessTokenExpiresAt: session.getAccessToken().getExpiration(),
                                    idToken: session.getIdToken().getJwtToken(),
                                    idTokenExpiresAt: session.getAccessToken().getExpiration()
                                },
                                error: null
                            });
                        },
                        onFailure(error: any) {
                            reject({
                                error: {
                                    code: '0x005',
                                    nextStep: 'NEW_PASSWORD_REQUIRED',
                                    data: error
                                },
                                session: null
                            });
                        }
                    });
                }
            });
        });
    }

}