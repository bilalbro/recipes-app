export function classNames(classNameMap) {
   var classStr = '';
   for (var className in classNameMap) {
      if (classNameMap[className]) {
         classStr += ' ' + className;
      }
   }
   return classStr;
}