import GenerateInvoiceUseCase from "./generate-invoice.usecase";

describe("Generate Invoice usecase unit test", () => {
    const MockRepository = () => {
        return {
            generate: jest.fn(),
            find: jest.fn(),
        };
    };

    it("should Generate a Invoice", async () => {
        const productRepository = MockRepository();
        const usecase = new GenerateInvoiceUseCase(productRepository);

        const input = {
            name: "Invoice 1",
            document: "Document 1",
            street: "Street",
            number: "1",
            complement: "Complement 1",
            city: "City",
            state: "State",
            zipCode: "zipCode",
            items: [{
                id: "1",
                name: "Item 1",
                price: 10,
            },
            {
                id: "2",
                name: "Item 2",
                price: 20,
            },
            ]
        }

        const result = await usecase.execute(input);

        expect(productRepository.generate).toHaveBeenCalled();
        expect(result.id).toBeDefined;
        expect(result.name).toBe(input.name);
        expect(result.document).toBe(input.document);
        expect(result.street).toBe(input.street);
        expect(result.number).toBe(input.number);
        expect(result.complement).toBe(input.complement);
        expect(result.city).toBe(input.city);
        expect(result.state).toBe(input.state);
        expect(result.zipCode).toBe(input.zipCode);
        expect(result.items).toEqual(input.items);
        expect(result.total).toBe(30);
    });


});