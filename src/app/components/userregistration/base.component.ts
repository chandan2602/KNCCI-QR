import { AbstractControl, UntypedFormGroup} from '@angular/forms';
export abstract class BaseComponent{


    check(item) {
        if (item.type == 'delete'||item['TYPE']=='delete') {
          return true
        }
        else {
          return false
        }
      }
      assignDataForm(self,name,i){
        let data=self[name][i];
        let ctrls=(self.myForm as UntypedFormGroup).controls;
        Object.keys(ctrls).map((formControlName:string)=>{
          let control:AbstractControl=ctrls[formControlName];
          control.setValue(data[formControlName]);
        })
      }
}