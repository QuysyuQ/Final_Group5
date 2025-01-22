export interface ProductReponse{
    id : string;
    title : string;
    price : number;
    discount : number;
    thumbnail : string;
    description : string;
    createdAt : Date;
    updatedAt : Date;
    quantity : number;
    categoryId : string;
    preserve : string;
    size : string[]
}