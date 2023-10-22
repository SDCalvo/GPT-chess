export const fetchBlackMove = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, 1000); // Simulate network delay
  });
};
