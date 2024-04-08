import React from 'react';
import { useEditorStore } from '../../EditorStore';

export function SectionOutput() {
  const store = useEditorStore();
  return <pre>{store.output}</pre>;
}
