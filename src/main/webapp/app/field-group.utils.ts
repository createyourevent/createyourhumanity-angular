// field-group.utils.ts
export interface FieldGroup {
  key?: string | number;
  type?: string;
  wrappers?: string[];
  className?: string;
  id?: string;
  templateOptions?: any;
  fieldGroup?: FieldGroup[];
}

export function createFieldGroup(node: any, req: boolean, parentFieldGroup?: FieldGroup): FieldGroup {
  const fieldGroup: FieldGroup = {
    key: node.getAttribute('id'),
    type: 'input',
    wrappers: ['grants'],
    className: 'form-field',
    id: node.getAttribute('id'),
    templateOptions: {
      placeholder: node.getAttribute('text'),
      description: node.getAttribute('descriptpion'),
      label: node.getAttribute('text'),
      required: req,
    },
    fieldGroup: [],
  };

  if (parentFieldGroup) {
    parentFieldGroup.fieldGroup.push(fieldGroup);
  }

  return fieldGroup;
}
