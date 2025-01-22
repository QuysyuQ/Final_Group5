export interface OrderReponse {
    id : string,
    fullName: string,
    email : string,
    phoneNumber : string,
    address : string,
    note : string,
    orderDate : Date,
    status : number,
    totalMoney : number,
    userId : string,
    payToMoneyId : string
}