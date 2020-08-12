import { FormControl } from '@angular/forms';

export function requiredFileType( type: string , type2: string) {
  return function ( control: FormControl ) {
    const file = control.value;
    if ( file ) {
      
      const extension = file.name.substr(file.name.length - 3);
      console.log("filetype: ", extension.toLowerCase(), type.toLowerCase(), type2.toLowerCase())
      if ( type.toLowerCase() != extension.toLowerCase() && type2.toLowerCase() != extension.toLowerCase() ) {
        return {
          requiredFileType: true
        };
      }

      return null;
    }

    return null;
  };
}
