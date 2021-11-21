import { UnauthorizedException } from '@nestjs/common';
import { Axios, AxiosResponse } from 'axios';
import { UserInformation } from './types/dsmauth';

export class DsmAuthClient {
    constructor(
        private readonly client_id: string,
        private readonly client_secret: string,
    ) {}

    public static readonly DSM_AUTH_URL = 'https://developer-api.dsmkr.com';

    private readonly axios: Axios = new Axios();

    public async getDsmAuthUserToken(code: string): Promise<string> {
        try {
            const response = await this.axios.post(
                `${DsmAuthClient.DSM_AUTH_URL}/dsmauth/token`,
                {
                    client_id: this.client_id,
                    client_secret: this.client_secret,
                    code,
                },
            );
            return response.data['access_token'];
        } catch (err) {
            throw new UnauthorizedException(err.response);
        }
    }

    public async getDsmAuthUserInfomation(
        token: string,
    ): Promise<UserInformation> {
        try {
            const response: AxiosResponse<UserInformation> =
                await this.axios.get(
                    `${DsmAuthClient.DSM_AUTH_URL}/v1/info/basic`,
                    {
                        headers: {
                            Authorization: token,
                        },
                    },
                );
            return response.data;
        } catch (err) {
            throw new UnauthorizedException(err.name);
        }
    }
}
