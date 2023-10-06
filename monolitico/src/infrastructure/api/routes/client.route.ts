import express, { Request, Response } from "express";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import Address from "../../../modules/@shared/domain/value-object/address";

export const clientRoute = express.Router();

clientRoute.post('/', async (req: Request, res: Response) => {
    const clientFacade = ClientAdmFacadeFactory.create();
    try {
        const input = {
            name: req.body.name,
            email: req.body.email,
            document: req.body.document,
            address: new Address(
                req.body.address.street,
                req.body.address.number,
                req.body.address.complement,
                req.body.address.city,
                req.body.address.state,
                req.body.address.zipCode,
            )
        };
        const response = await clientFacade.add(input);
        const body = {
            id: response.id,
            name: response.name,
            email: response.email,
            document: response.document,
            address: {
                street: response.address.street,
                number: response.address.number,
                complement: response.address.complement,
                city: response.address.city,
                state: response.address.state,
                zipCode: response.address.zipCode,
            }
        }
        res.send(body);
    } catch (err) {
        res.status(500).send(err);
    }

})