
import { test, expect } from '@playwright/test';
import Login from '../../../POM/API/Authorization';
import Booking from '../../../POM/API/CreateBooking';
import {additionalneeds, Auth_token} from "../../../Helpers/Types"
import GetBookingId from '../../../POM/API/GetBooking';
import Delete from '../../../POM/API/Delete';
import UpdateBooking from '../../../POM/API/UpdateBooking';


type customerBookingIdReserve = {
    Id: string;
}
const customerInformation:customerBookingIdReserve={Id:''};
const localToken: Auth_token = { token: '' }
    const totalPrice=111;
    const additional: additionalneeds = "Breakfast";
    const checkin="2018-01-01";
    const checkout="2019-01-01";

test('Check Authorization',async({ request })=>{

    const login = new Login();
    const res  = await login.post(request, process.env.TEST_USER as string, process.env.TEST_PASSWORD as string);
     await test.step('Check Status',async ()=>{
        expect(res.status()).toBe(200);
        console.log('Status is 200')
     })
     await test.step('Retreive token',async()=>{
        const res_Json=await res.json()
        localToken.token=await res_Json.token
        expect(localToken.token.length).toBeGreaterThan(1)// Expect to check that the token is not retrieved empty
    console.log('Token is retrieve and valid')

     })
})
test('Create Bookin',async ({request})=>{
// ○ POST /booking
// ○ Validate 200 OK
// ○ Extract bookingid
    const booking = new Booking();
    const res = await booking.post(request,"Jim","Brown", totalPrice,checkin,checkout,additional)
        expect( res.status()).toBe(200);
        const resJson_Booking=await res.json()
        expect(resJson_Booking.bookingid).not.toBeNaN();
        customerInformation.Id=resJson_Booking.bookingid;
        expect(resJson_Booking.booking.totalprice).toBe(totalPrice);
        expect(resJson_Booking.booking.bookingdates.checkin).toBe(checkin)
        expect(resJson_Booking.booking.bookingdates.checkout).toBe(checkout)
        console.log('All checked passed for booking customer')

})

test('Read Booking',async ({request})=>{
// ○ GET using extracted ID
// Validate response data matches
    const getBookingId = new GetBookingId()
    const res =await  getBookingId.get(request,customerInformation.Id);
    expect( res.status()).toBe(200);
    const resjson_GetCustomer = await res.json()
        expect(resjson_GetCustomer.totalprice).toBe(totalPrice);
        expect(resjson_GetCustomer.bookingdates.checkin).toBe(checkin)
        expect(resjson_GetCustomer.bookingdates.checkout).toBe(checkout)
        console.log('All checked passed for retrieving customer')
});
// 4. Update Booking
// ○ PUT request (requires Auth Token in header)
// ○ Update checkout date
// ○ Validate update
test('Update Booking',async ({request})=>{
        const updateBooking = new UpdateBooking();
        const new_totalPrice=totalPrice+10
        const updatedName="Joaquin";
        const updatedLastName='Pareja';
        const newCheckingDate='2027-02-03';
        const newCheckOutDate='2027-04-03';
    const res = await updateBooking.post(request,updatedName,updatedLastName, new_totalPrice,newCheckingDate,newCheckOutDate,additional,customerInformation.Id)
        expect( res.status()).toBe(200);
        const resJson_Booking=await res.json();
        expect(resJson_Booking.firstname).toBe(updatedName);
        expect(resJson_Booking.lastname).toBe(updatedLastName);
        expect(resJson_Booking.totalprice).toBe(new_totalPrice);
        expect(resJson_Booking.bookingdates.checkin).toBe(newCheckingDate)
        expect(resJson_Booking.bookingdates.checkout).toBe(newCheckOutDate)
        console.log('All checked passed for updating customer')
})

test('Delete Booking',async ({request})=>{
    // 5. Delete Booking
// ○ DELETE request
// ○ Validate 201 Created
// Confirm with GET → 404 Not Found
    const deleteBooking = new Delete()
    const getBookingId = new GetBookingId()

   const res =  await deleteBooking.post(request,customerInformation.Id);
   expect(res.status()).toBe(201)
    const resGetAfterDelete =await  getBookingId.get(request,customerInformation.Id);
    expect( resGetAfterDelete.status()).toBe(404);
        console.log('All checked passed for Deleting customer reservation')


})
