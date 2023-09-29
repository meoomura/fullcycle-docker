import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Product from "../../domain/product.entity";
import ProductGateway from "../../gateway/product.gateway";
import { FindAllProductsDto } from "./find-all-products.dto";

export default class FindAllProductsUseCase implements UseCaseInterface {

    constructor(private _productRepository: ProductGateway) { }

    async execute(): Promise<FindAllProductsDto> {
        
        const products = await this._productRepository.findAll();

        return {
            products:products.map((product) => ({
                id: product.id.id,
                name: product.name,
                description: product.description,
                salesPrice: product.salesPrice,
            }))
        }

    }
}