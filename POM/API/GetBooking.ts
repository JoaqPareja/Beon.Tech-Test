import type { APIRequestContext } from '@playwright/test';

export default class getBookingId{
    private getBookingById;
    constructor(){

        this.getBookingById=(id:string)=>{return`${process.env.BASE_URL}/booking/${id}`}

    }
    async get(request:APIRequestContext,bookingId:string){
        const getBookingId= request.get(`${this.getBookingById(bookingId)}`,{
       
        })

        return await getBookingId;

    }


}