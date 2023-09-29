import { AddProductFacadeInputDto, CheckStockFacadeInputDto, CheckStockFacadeOutputDto } from "./product-adm.facade.dto";

export default interface ProductAdmFacadeInterface{
    addProduct(input: AddProductFacadeInputDto):Promise<void>;
    checkStock(input: CheckStockFacadeInputDto):Promise<CheckStockFacadeOutputDto>;
}