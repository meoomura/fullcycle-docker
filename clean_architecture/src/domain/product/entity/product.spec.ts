import Product from "./product";

describe("product unit tests", () => {
    
    it("should throw error when id is empty", () => {
        expect( () => {
            let product = new Product("","Product 1", 100);
        }).toThrowError(new Error("product: Id is required"));
    });

    it("should throw error when name is empty", () => {
        expect( () => {
            let product = new Product("P1","", 100);
        }).toThrowError(new Error("product: Name is required"));
    });

    it("should throw error when price is less than 0", () => {
        expect( () => {
            let product = new Product("P1","Product 1", -1);
        }).toThrowError(new Error("product: Price must be greater than 0"));
    });

    it("should throw error when id and name are empty and price is less than 0", () => {
        expect( () => {
            let product = new Product("","", -1);
        }).toThrowError(new Error("product: Id is required,product: Name is required,product: Price must be greater than 0"));
    });


    it("should change name", () => {
        const product = new Product("P1","Produto 1", 100);
        product.changeName("Produto X");
        expect(product.name).toBe("Produto X");
    });

    it("should throw error when change to name empty", () => {
        expect( () => {
            const product = new Product("P1","Produto 1", 100);
            product.changeName("");
            }).toThrowError(new Error("product: Name is required"));
    });

    it("should change price", () => {
        const product = new Product("P1","Produto 1", 100);
        product.changePrice(200);
        expect(product.price).toBe(200);
    });

    it("should throw error when change price to value less than 0", () => {
        expect( () => {
            const product = new Product("P1","Produto 1", 100);
            product.changePrice(-10);
        }).toThrowError(new Error("product: Price must be greater than 0"));
    });

});