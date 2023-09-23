import Address from "./address";

describe("address unit tests", () => {
    
    it("should throw error when street is empty", () => {
        expect( () => {
            let address = new Address("", 100, "01234-123","São Paulo", "SP");
        }).toThrowError(new Error("address: Street is required"));
    });

    it("should throw error when number is equal zero", () => {
        expect( () => {
            let address = new Address("Rua Sem Nome", 0, "01234-123","São Paulo", "SP");
        }).toThrowError(new Error("address: Number must be greater than 0"));
    });

    it("should throw error when zip is empty", () => {
        expect( () => {
            let address = new Address("Rua Sem Nome", 100, "","São Paulo", "SP");
        }).toThrowError(new Error("address: Zip is required"));
    });

    it("should throw error when city is empty", () => {
        expect( () => {
            let address = new Address("Rua Sem Nome", 100, "01234-123","", "SP");
        }).toThrowError(new Error("address: City is required"));
    });

    it("should throw error when state is empty", () => {
        expect( () => {
            let address = new Address("Rua Sem Nome", 100, "01234-123","São Paulo", "");
        }).toThrowError(new Error("address: State is required"));
    });

    it("should create address", () => {
        const address = new Address("Rua Sem Nome", 100, "01234-123","São Paulo", "SP");
        expect(address.street).toBe("Rua Sem Nome");
        expect(address.number).toBe(100);
        expect(address.zip).toBe("01234-123");
        expect(address.city).toBe("São Paulo");
        expect(address.state).toBe("SP");
    });

    it("should get toString", () => {
        const address = new Address("Rua Sem Nome", 100, "01234-123","São Paulo", "SP");
        expect(address.toString()).toBe("Rua Sem Nome, 100 01234-123 São Paulo/SP");
    });

});