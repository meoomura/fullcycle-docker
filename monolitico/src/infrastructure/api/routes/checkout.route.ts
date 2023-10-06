import express, { Request, Response } from "express";
import CheckoutFacadeFactory from "../../../modules/checkout/factory/checkout.facade.factory";

export const checkoutRoute = express.Router();

checkoutRoute.post('/', async (req: Request, res: Response) => {
    try {
        const checkoutFacade = CheckoutFacadeFactory.create();
        const input = {
            clientId: req.body.clientId,
            products: req.body.products.map((p: { productId: any; }) =>{
                return {productId:p.productId}
            }),
        };
        
        let output = await checkoutFacade.process(input);
        
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }

})