export const readC = jest
  .fn()
  .mockImplementation((serial, decimals, cb) => cb(null, 42));

export const setW1Directory = jest.fn();
