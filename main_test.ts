import { assertEquals } from 'https://deno.land/std@0.190.0/testing/asserts.ts';
import { add } from './main.ts';

Deno.test('add()', function addTest() {
  assertEquals(add(2, 3), 5);
});
