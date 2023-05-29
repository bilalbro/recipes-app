import { QuantityDecomposed } from "./types";

const unitMap = {
   'tsp': 1, // Goes to 'tsp'
   'tbsp': 3, // Goes to 'tsp'
   'cup': 48, // Goes to 'tsp'
   'cups': 48, // Goes to 'tsp'
   'g': 1
};


function getStatus(mantissa: number, previousMantissa: number)
{
   if (mantissa > previousMantissa) {
      return 'inc';
   }
   else if (mantissa < previousMantissa) {
      return 'dec';
   }
   else {
      return 'same';
   }
}


function mantissaAfterUnitNormalization(quantityDecomposed: QuantityDecomposed)
{
   return unitMap[quantityDecomposed.unit!] * quantityDecomposed.mantissa;
}


function processMantissa(values: string[])
{
   // Throw away the first value since we don't need that.
   values.shift();

   var mantissa = 0;
   for (var value of values) {
      if (value !== undefined) {
         mantissa += new Function(`return ${value}`)();
      }
   }
   return mantissa;
}


function decomposeQuantity(quantity: string): QuantityDecomposed
{
   var mantissaMatch = quantity.match(/^(\d+(?:\/\d+)?)(?: (\d+(?:\/\d+)?))?/);
   var unitMatch = quantity.match(/[a-zA-Z]+$/);

   var mantissa = processMantissa([...mantissaMatch!]);

   return {
      mantissa,
      unit: unitMatch && unitMatch[0]
   }
}


export default function diffQuantities(
   quantity: string,
   previousQuantity: string
)
{
   var quantityDecomposed = decomposeQuantity(quantity);
   var previousQuantityDecomposed = decomposeQuantity(previousQuantity);

   if (!quantityDecomposed.unit) {
      return getStatus(quantityDecomposed.mantissa, 
         previousQuantityDecomposed.mantissa);
   }
   else {
      // Normalize unit
      return getStatus(
         mantissaAfterUnitNormalization(quantityDecomposed),
         mantissaAfterUnitNormalization(previousQuantityDecomposed),
      )
   }
}