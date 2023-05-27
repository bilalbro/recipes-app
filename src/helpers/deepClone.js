export default function deepClone(obj)
{
   // If obj is a primitive, just return it.
   if (typeof obj !== 'object' || obj === null) {
      return obj;
   }

   // If obj is an array, deal with it specially.
   if (obj instanceof Array) {
      var clone = [];
      for (var item of obj) {
         clone.push(deepClone(item));
      }
      return clone;
   }

   var clone = {};
   for (var key in obj) {
      clone[key] = deepClone(obj[key]);
   }
   return clone;
}