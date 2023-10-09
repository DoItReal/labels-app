import { findIndexByProperty, isNotNullOrUndefined } from './helpers';

const TestArr: Array<{testProperty:string }> = [];
for (let i = 0; i < 10; i++) {
    let dummy = {testProperty:''};
    dummy.testProperty = (i + 10).toString();
    TestArr.push(dummy);
}
test('Testing findIndexByProperty()', () => {
    expect(findIndexByProperty(TestArr, 'testProperty', '10')).toBe(0);
    expect(findIndexByProperty(TestArr, 'testProperty', '11')).toBe(1);
    expect(findIndexByProperty(TestArr, 'testProperty', '15')).toBe(5);
    expect(findIndexByProperty(TestArr, 'testProperty', 'null')).toBe(-1);
});

test('Testing isNotNullOrUndefined', () => {
    expect(isNotNullOrUndefined(null)).toBe(false);
    expect(isNotNullOrUndefined(TestArr)).toBe(true);
    expect(isNotNullOrUndefined(undefined)).toBe(false);
})