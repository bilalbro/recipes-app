import { expect } from 'chai';
import diffQuantities from './differ';


describe.skip('Without units', () => {
   describe('Integral quantities', () => {
      test("same quantities should be 'same'", () => {
         expect(diffQuantities('1', '1')).equal('same');
      });
   
      test("increased quantity should be 'inc'", () => {
         expect(diffQuantities('2', '1')).equal('inc');
      });
   
      test("decreased quantity should be 'dec'", () => {
         expect(diffQuantities('1', '3')).equal('dec');
      });
   });
   
   
   describe('Fractional quantities', () => {
      test("same quantities should be 'same'", () => {
         expect(diffQuantities('1/2', '1/2')).equal('same');
      });
   
      test("increased quantity should be 'inc'", () => {
         expect(diffQuantities('1/2', '1/4')).equal('inc');
      });
   
      test("decreased quantity should be 'dec'", () => {
         expect(diffQuantities('1/3', '1/2')).equal('dec');
      });
   });
   
   
   describe('Integral + fractional quantities', () => {
      test("same quantities should be 'same'", () => {
         expect(diffQuantities('1 1/2', '1 1/2')).equal('same');
      });
   
      test("increased quantity should be 'inc'", () => {
         expect(diffQuantities('2 1/2', '2 1/4')).equal('inc');
      });
   
      test("decreased quantity should be 'dec'", () => {
         expect(diffQuantities('1 1/4', '3 1/2')).equal('dec');
      });
   });
});



describe('With units', () => {
   describe('Integral quantities', () => {
      test("same quantities and units should be 'same'", () => {
         expect(diffQuantities('1 tsp', '1 tsp')).equal('same');
      });

      test("same quantities and units (written differently) should be 'same'", () => {
         expect(diffQuantities('1 tsp', '1tsp')).equal('same');
      });

      test("increased quantity and same unit should be 'inc'", () => {
         expect(diffQuantities('2 tsp', '1 tsp')).equal('inc');
      });
   
      test("decreased quantity and same unit should be 'dec'", () => {
         expect(diffQuantities('1 tsp', '3 tsp')).equal('dec');
      });
   
      test("same overall quantity but different unit should be 'same'", () => {
         expect(diffQuantities('1 tbsp', '3 tsp')).equal('same');
      });
   });

   describe('Fractional quantities', () => {
      test("same quantities and units should be 'same'", () => {
         expect(diffQuantities('1/2 tsp', '1/2 tsp')).equal('same');
      });

      test("same quantities and units (written differently) should be 'same'", () => {
         expect(diffQuantities('1/2 tsp', '1/2tsp')).equal('same');
      });

      test("increased quantity and same unit should be 'inc'", () => {
         expect(diffQuantities('2/3 tsp', '1/3 tsp')).equal('inc');
      });
   
      test("decreased quantity and same unit should be 'dec'", () => {
         expect(diffQuantities('1/4 tsp', '1/2 tsp')).equal('dec');
      });
   
      test("increased overall quantity but different unit should be 'inc'", () => {
         expect(diffQuantities('1/2 tbsp', '1 tsp')).equal('inc');
      });
   
      test("decreased overall quantity but different unit should be 'dec'", () => {
         expect(diffQuantities('3 tbsp', '1/4 cup')).equal('dec');
      });
   });
});