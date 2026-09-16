import type { APIRequestContext } from '@playwright/test';
import {additionalneeds} from "../../Helpers/Types"
export default class UpdateBooking{
    private customerIdBooking;
    constructor(){
        this.customerIdBooking=(bookingId:string)=>{return `${process.env.BASE_URL}/booking/${bookingId}`}
    }
    public async post(request: APIRequestContext, firstName:string,lastname:string,totalPrice:number,checkin:string,checkout:string,additionalneeds:additionalneeds,bookingId:string ){
        console.log(`${this.customerIdBooking(bookingId)}`)
        const resBooking= request.put(`${this.customerIdBooking(bookingId)}`,{
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
                   }, headers: {
                Authorization:  `Basic YWRtaW46cGFzc3dvcmQxMjM=`,
                'Content-Type': 'application/json',
        }
                })
        return await resBooking;
    }

}
