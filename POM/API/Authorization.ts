import type { APIRequestContext } from '@playwright/test';

export default class Login{
    private resAuthorization: string;
    constructor(){
            this.resAuthorization=`${process.env.BASE_URL}/auth`;
    }
    public async post(request: APIRequestContext,username:string,password:string){
    const resPonse_From_Authorization= request.post(`${this.resAuthorization}`,{
            data: {
                "username":username,
                "password" :password
                }
    });
    return await resPonse_From_Authorization;
    }

}
