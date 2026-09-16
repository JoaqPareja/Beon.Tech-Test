

  import type { APIRequestContext } from '@playwright/test';
  export default class Booking{
      private customerIdBooking;
      constructor(){
          this.customerIdBooking=(id:string)=>{return`${process.env.BASE_URL}/booking/${id}`}
      }
      public async post(request: APIRequestContext,id:string){
          const resBooking= request.delete(`${this.customerIdBooking(id)}`,{
             headers: {
                Authorization:  `Basic YWRtaW46cGFzc3dvcmQxMjM=`,
                'Content-Type': 'application/json',
        }
                  })
          return await resBooking;
      }
  
  }
  