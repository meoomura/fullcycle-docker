import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import CheckoutFacadeInterface, { CheckoutFacadeInputDto, CheckoutFacadeOutputDto } from "./checkout.facade.interface";

export default class CheckoutFacade implements CheckoutFacadeInterface{
    
    constructor(private processUsecase: UseCaseInterface){}

    async process(input: CheckoutFacadeInputDto): Promise<CheckoutFacadeOutputDto> {
        return this.processUsecase.execute(input);
    }
}