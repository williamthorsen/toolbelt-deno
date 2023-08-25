import { assertEquals, describe, it } from '../../dev_deps.ts';

import { Queue } from '../Queue.ts';

describe('Queue class', () => {
  describe('get head', () => {
    it('if the queue is not empty, returns the first item', () => {
      const queue = new Queue();
      queue.enqueue(1);
      queue.enqueue(2);

      assertEquals(queue.head, 1);
    });

    it('if the queue is empty, returns undefined', () => {
      const queue = new Queue();
      assertEquals(queue.head, undefined);
    });
  });

  describe('get isEmpty', () => {
    it('returns true if the queue is empty', () => {
      const queue = new Queue();
      assertEquals(queue.isEmpty, true);
    });

    it('returns false if the queue is not empty', () => {
      const queue = new Queue().enqueue(1);
      assertEquals(queue.isEmpty, false);
    });
  });

  describe('clear', () => {
    it('removes all items from the queue', () => {
      const queue = new Queue()
        .enqueue(1)
        .enqueue(2);

      queue.clear();

      assertEquals(queue.isEmpty, true);
    });
  });

  describe('dequeue()', () => {
    it('removes the head of the queue and returns it', () => {
      const queue = new Queue()
        .enqueue(1)
        .enqueue(2);

      const dequeuedValue = queue.dequeue();

      assertEquals(dequeuedValue, 1);
      assertEquals(queue.head, 2);
    });

    it('if the queue is empty, returns undefined', () => {
      const queue = new Queue();
      assertEquals(queue.dequeue(), undefined);
    });
  });

  describe('dequeueBatch()', () => {
    it('removes nItems from the head of the queue and returns them', () => {
      const queue = new Queue()
        .enqueue(1)
        .enqueue(2)
        .enqueue(3);

      const dequeuedValue = queue.dequeueBatch(2);

      assertEquals(dequeuedValue, [1, 2]);
      assertEquals(queue.head, 3);
    });

    it('if the queue is empty, returns an empty array', () => {
      const queue = new Queue();

      assertEquals(queue.dequeueBatch(1), []);
    });

    it('if the queue contains fewer than nItems, returns all items in the queue', () => {
      const queue = new Queue().enqueue(1);

      assertEquals(queue.dequeueBatch(5), [1]);
      assertEquals(queue.size, 0);
    });
  });

  describe('enqueue()', () => {
    it('adds an item to the tail of the queue', () => {
      const queue = new Queue();

      queue
        .enqueue(1)
        .enqueue(2);

      assertEquals(queue.head, 1);
      assertEquals(queue.size, 2);
    });
  });

  describe('enqueueBatch(items)', () => {
    it('adds the items to the tail of the queue in order', () => {
      const queue = new Queue().enqueue(1);
      const items = [2, 3];

      queue.enqueueBatch(items);

      assertEquals(Array.from(queue), [1, 2, 3]);
    });
  });
});
