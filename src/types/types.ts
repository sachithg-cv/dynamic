// src/types/types.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ComponentImport {
    name: string;
    type: string;
  }
  
  export interface DependencyImport {
    name: string;
    exports: string[];
  }
  
  export interface TemplateImports {
    dependencies: DependencyImport[];
    components: ComponentImport[];
  }
  
  export interface Button {
    type: string;
    label: string;
    action: 'submit' | 'cancel' | 'reset';
  }
  
  export interface FieldConfig {
    type: string;
    name: string;
    label: string;
    [key: string]: any;
  }
  
  export interface Template {
    archetype: string;
    imports: TemplateImports;
    config: {
      title: string;
      description?: string;
      formFields: FieldConfig[];
      buttons: Button[];
      api?: {
        fetch?: string;
        submit?: string;
      };
    };
  }
  
  export interface Section {
    id: string;
    type: string;
    components: string[];
  }
  
  export interface Archetype {
    name: string;
    layout: {
      type: string;
      sections: Section[];
    };
  }
  
  export interface ComponentProps {
    name: string;
    label: string;
    value?: any;
    onChange?: (value: any) => void;
    [key: string]: any;
  }
  
  export interface DynamicTemplateProps {
    templateName: string;
    initialTemplate: Template;
    initialArchetype: Archetype;
    initialData?: Record<string, any>;
  }