import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDto, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";

export interface UseCaseProps{
    generateUseCase: UseCaseInterface;
    findUseCase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface{
    private _findUseCase: UseCaseInterface;
    private _generateUseCase: UseCaseInterface;

    constructor(props: UseCaseProps) {
        this._findUseCase = props.findUseCase;
        this._generateUseCase = props.generateUseCase;
    }

    async find(id: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto>{
        return await this._findUseCase.execute(id);
    }
    async generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto>{
        return await this._generateUseCase.execute(input);
    }
    
}