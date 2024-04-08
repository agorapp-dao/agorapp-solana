import { useDialog } from '@agorapp-dao/react-common';
import { Box, IconButton, Stack, TextField } from '@mui/material';
import {
  EDITOR_MAX_FONT_SIZE,
  EDITOR_MIN_FONT_SIZE,
} from '@agorapp-dao/react-common/src/constants/misc';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useEditorActions, useEditorStore } from '../../Editor/EditorStore';

export const useSettingsDialog = () => {
  const { show } = useDialog();
  const showSettingsDialog = () => {
    return show({
      title: 'Settings',
      children: <SettingsDialogContent />,
      showConfirm: false,
      showClose: false,
      size: 'small',
      open: true,
    });
  };
  return { showSettingsDialog };
};

const SettingsDialogContent = () => {
  const store = useEditorStore();
  const actions = useEditorActions();
  return (
    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
      <Box>
        <IconButton
          aria-label="smaller-font"
          onClick={() => {
            const size = store.fontSize - 1;
            if (size >= EDITOR_MIN_FONT_SIZE) {
              actions.setFontSize(size);
            }
          }}
        >
          <IndeterminateCheckBoxIcon />
        </IconButton>
      </Box>
      <TextField
        label="Font size"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        value={store.fontSize}
        onChange={e => actions.setFontSize(parseInt(e.target.value))}
        sx={{ width: '100px' }}
      />
      <Box>
        <IconButton
          aria-label="larger-font"
          onClick={() => {
            const size = store.fontSize + 1;
            if (size <= EDITOR_MAX_FONT_SIZE) {
              actions.setFontSize(size);
            }
          }}
        >
          <AddBoxIcon />
        </IconButton>
      </Box>
    </Stack>
  );
};
