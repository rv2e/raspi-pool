export const promises = {
  read: jest.fn().mockResolvedValue({ temperature: 42, humidity: 30 }),
};
export const read = jest
  .fn()
  .mockImplementation((model, pin, cb) => cb(null, 42, 30));
