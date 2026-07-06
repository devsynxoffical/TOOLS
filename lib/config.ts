export function isMockMode(): boolean {
  return (
    process.env.USE_MOCK_DATA === "true" ||
    process.env.USE_MOCK_DATA === "1" ||
    !process.env.DATABASE_URL?.startsWith("postgresql://")
  );
}
