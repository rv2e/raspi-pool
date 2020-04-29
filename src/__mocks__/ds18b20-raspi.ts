export const readC = jest
  .fn()
  .mockImplementation((serial, decimals, cb) => cb(null, 42));
