export function generateEmployee() {
  const timestamp = Date.now();

  return {
    firstName: `Abi${timestamp}`,
    lastName: `RAJ${timestamp}`,
  };
}
