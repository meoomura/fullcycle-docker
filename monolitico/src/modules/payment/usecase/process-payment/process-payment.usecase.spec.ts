import Id from "../../../@shared/domain/value-object/id.value-object";
import Transaction from "../../domain/transaction";
import ProcessPaymentUseCase from "./process-payment.usecase";

const transaction = new Transaction({
    id: new Id("1"),
    amount: 100,
    orderId: "1",
    status:"approved"
});

const MockRepository = () => {
    return {
        save: jest.fn().mockReturnValue(Promise.resolve(transaction)),
    };
};

const transaction2 = new Transaction({
    id: new Id("2"),
    amount: 50,
    orderId: "2",
    status:"declined"
});

const MockRepositoryDeclined = () => {
    return {
        save: jest.fn().mockReturnValue(Promise.resolve(transaction2)),
    };
};

describe("Process payment usecase unit test", () => {

    it("should aprove a transaction", async () => {
        const transactionRepository = MockRepository();
        const usecase = new ProcessPaymentUseCase(transactionRepository);

        const input = {
            orderId: "1",
            amount: 100,
        }

        const result = await usecase.execute(input);

        expect(result.transactionId).toBe(transaction.id.id);
        expect(transactionRepository.save).toHaveBeenCalled();
        expect(result.status).toBe("approved");
        expect(result.amount).toBe(100);
        expect(result.orderId).toBe("1");
        expect(result.createdAt).toStrictEqual(transaction.createdAt);
        expect(result.updatedAt).toStrictEqual(transaction.updatedAt);
    });
    it("should decline a transaction", async () => {
        const productRepository = MockRepositoryDeclined();
        const usecase = new ProcessPaymentUseCase(productRepository);

        const input = {
            orderId: "2",
            amount: 50,
        }

        const result = await usecase.execute(input);

        expect(result.transactionId).toBe(transaction2.id.id);
        expect(productRepository.save).toHaveBeenCalled();
        expect(result.status).toBe("declined");
        expect(result.amount).toBe(50);
        expect(result.orderId).toBe("2");
        expect(result.createdAt).toStrictEqual(transaction2.createdAt);
        expect(result.updatedAt).toStrictEqual(transaction2.updatedAt);
    });
});
