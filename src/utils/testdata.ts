export function generateEmployee() {
  const timestamp = Date.now();

  return {
    firstName: `PRU${timestamp}`,
    lastName: `RAJ${timestamp}`,
  };
}
