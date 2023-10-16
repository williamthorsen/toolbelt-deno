export function enclose(opening: string, closing = opening) {
  return (content: string) => `${opening}${content}${closing}`;
}
