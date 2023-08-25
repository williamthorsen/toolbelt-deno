import { assertEquals, describe, it } from '../../dev_deps.ts';
import { buildOptions } from '../buildOptions.ts';

const currentDirectory = new URL('.', import.meta.url).pathname;
const libraryName = currentDirectory.split('/').slice(-4, -3)[0];

describe('buildOptions', () => {
  if (libraryName !== '_template') {
    it('packageName has been changed from the default', () => {
      assertEquals(buildOptions.packageName.endsWith('_template'), false);
    });
  }

  it('repoDir matches the actual directory', () => {
    const repoDir = currentDirectory.split('/').slice(-5, -3).join('/');
    assertEquals(buildOptions.repoDir, repoDir);
  });
});
