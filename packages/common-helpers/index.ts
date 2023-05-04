export function caseInsensitiveIncludes(stringA: string, stringB: string) {
  return (
    stringA && stringB && stringA.toLowerCase().includes(stringB.toLowerCase())
  );
  // return stringA && stringB && removeVietnameseAccent(stringA)
  //   .toLowerCase()
  //   .includes(removeVietnameseAccent(stringB).toLowerCase());
}