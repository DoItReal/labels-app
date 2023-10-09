import DB from './db';

describe("DB", () => {
    const db = new DB();

    test("defines setRule()", () => {
        expect(typeof db.fetchSigns).toBe("function");
        expect(typeof db.createNewLabel).toBe("function");
        expect(typeof db.deleteLabel).toBe("function");
        expect(typeof db.getSignById).toBe("function");
        expect(typeof db.saveLabel).toBe("function");
    });
});