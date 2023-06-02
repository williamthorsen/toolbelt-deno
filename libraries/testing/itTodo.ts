import { it } from '../../dev_deps.ts';

export function itTodo(description: string) {
  it(description, () => {
    console.warn(`TODO: '${description}'`);
  });
}
