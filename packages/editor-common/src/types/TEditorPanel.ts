export type TEditorPanel<T> = {
  id: string;
  label: string;
  component: React.ComponentType<T>;
  props: T;
};
