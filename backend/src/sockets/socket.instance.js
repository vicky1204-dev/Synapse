/* “How do I access io inside inngest?”

Answer: We export io globally. */

let ioInstance;

export const setIO = (io) => {
  ioInstance = io;
};

export const getIO = () => {
  return ioInstance;
};