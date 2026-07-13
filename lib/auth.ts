/**
 * Mock session / authorisation.
 *
 * A user may only ever see sources belonging to their permitted matters.
 * To try the app as a different user (e.g. to test cross-matter access),
 * change which user getCurrentUser() returns.
 */
export interface User {
  id: string;
  name: string;
  permittedMatterIds: string[];
}

const USERS: Record<string, User> = {
  "u-anna": { id: "u-anna", name: "Anna (Apple team)", permittedMatterIds: ["m-apple"] },
  "u-ben": { id: "u-ben", name: "Ben (Globex team)", permittedMatterIds: ["m-globex"] },
};

export function getCurrentUser(): User {
  return USERS["u-anna"];
}
