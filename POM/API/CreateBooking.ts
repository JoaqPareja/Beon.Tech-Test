import type { APIRequestContext } from '@playwright/test';
import {additionalneeds} from "../../Helpers/Types"
export default class Booking{
    private bookingEndpoint: string;
    constructor(){
            this.bookingEndpoint=`${process.env.BASE_URL}/booking`;
    }
    public async post(request: APIRequestContext, firstName:string,lastname:string,totalPrice:number,checkin:string,checkout:string,additionalneeds:additionalneeds ){
        const resBooking= request.post(`${this.bookingEndpoint}`,{
            data: {
                    "firstname" :firstName,// "Jim"
                    "lastname" : lastname,////"Brown"
                    "totalprice" : totalPrice,// 111
                    "depositpaid" : true,
                    "bookingdates" : {
                        "checkin" : checkin,//"2018-01-01"
                        "checkout" :checkout //"2019-01-01"
                    },
                    "additionalneeds" :additionalneeds //"Breakfast"
                   }
                })
        return await resBooking;
    }

}
