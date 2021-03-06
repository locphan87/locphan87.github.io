import React from 'react'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import { useSelector, useDispatch } from 'react-redux'

const ResumeSetting: React.FC = () => {
  const { showIcon } = useSelector((x) => x)
  const dispatch = useDispatch()
  const [state, setState] = React.useState({ showIcon })
  const handleToggle = (itemType: string) => (event: any) => {
    const checked = event.target.checked
    const newState = {
      ...state,
      [itemType]: checked,
    }
    setState(newState)
    const actionType = itemType === 'showIcon' ? 'SHOW_ICON' : 'SHOW_LEVEL'
    dispatch({ type: actionType, payload: checked })
  }

  return (
    <>
      <FormGroup row>
        <FormControlLabel
          control={
            <Switch
              checked={state.showIcon}
              onChange={handleToggle('showIcon')}
              name="showIcon"
            />
          }
          label="Show Icons"
        />
      </FormGroup>
    </>
  )
}

export default ResumeSetting
