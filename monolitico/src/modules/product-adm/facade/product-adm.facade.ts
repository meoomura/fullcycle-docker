import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { AddProductFacadeInputDto, CheckStockFacadeInputDto, CheckStockFacadeOutputDto } from "./product-adm.facade.dto";
import ProductAdmFacadeInterface from "./product-adm.facade.interface";

export interface UseCasesProps{
    addUseCase: UseCaseInterface;
    stockUseCase: UseCaseInterface;
}

export default class ProductAdmFacade implements ProductAdmFacadeInterface{
    private _addUseCase: UseCaseInterface;
    private _checkStockuseCase: UseCaseInterface;
    constructor(usecasesProps: UseCasesProps) {
        this._addUseCase = usecasesProps.addUseCase;
        this._checkStockuseCase =  usecasesProps.stockUseCase;
    }

    async addProduct(input: AddProductFacadeInputDto): Promise<void> {
        //caso o dto do caso de uso for diferente da facade, converter o dto da facade para o dto do caso de uso.
        return await this._addUseCase.execute(input);
    }
    async checkStock(input: CheckStockFacadeInputDto): Promise<CheckStockFacadeOutputDto> {
        return await this._checkStockuseCase.execute(input);
    }
}