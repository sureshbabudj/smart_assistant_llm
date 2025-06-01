export function sessionKey(userId: string, conversationId: string): string {
  return `${userId}::${conversationId}`;
}

export function matchPassword(hash: string, password: string): boolean {
  return Buffer.from(hash, "base64").toString("utf-8") === password;
}

export function getHashedPassword(password: string): string {
  return Buffer.from(password).toString("base64");
}
