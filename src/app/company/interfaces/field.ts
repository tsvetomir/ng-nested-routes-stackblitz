export interface FieldBase {
  name: NonNullable<string>;
  progressType: 'character' | 'integer' | 'date' | 'decimal' | 'logical';
  title?: string;
  value?: string | number | boolean | Array<string | number>;
}

export interface GridColumnField extends FieldBase {
  hideTitleGridColumnHeader?: boolean;
  isTime?: boolean;
  isFileSize?: boolean;
  maxCharacters?: number;
  numberFormat?: NumberFormat;
}

export interface DetailField extends FieldBase {
  fieldType?:
    | 'checkbox'
    | 'comboBox'
    | 'dropDown'
    | 'lookup'
    | 'optionalLookup'
    | 'multiSelect'
    | 'radioButton'
    | 'switchBox'
    | 'textarea'
    | 'formButton'
    | 'isEmail'
    | 'isEmailCC'
    | 'isPhoneNumber'
    | 'isURL'
    | 'isFileSize'
    | 'isTime'
    | 'isColor';
  isDisabled?: boolean;
  isTableInput?: boolean;
  numberFormat?: NumberFormat;
  maxCharacters?: number;
}

export interface FormFieldBase {
  detailField?: DetailField;
  hidden?: boolean;
  stateTrigger?: boolean;
  isInEditModeDisabled?: boolean;
  isCopyDisabled?: boolean;
  licensecode?: string;
  index?: number;
  parent?: number;
  groupingDisabled?: boolean;
}

export interface FormField extends FormFieldBase {
  groupedFormField?: GroupedFormField;
}

export interface GroupedFormField {
  formField1: FormFieldBase;
  formField2: FormFieldBase;
  formField3?: FormFieldBase;
  formField4?: FormFieldBase;
}

export interface NumberFormat {
  formatDecimals?: number;
  isPercentage?: boolean;
  isCurrency?: boolean;
  minValue?: number;
  maxValue?: number;
  customFormat?: string;
}
