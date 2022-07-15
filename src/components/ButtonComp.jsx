/* eslint-disable react/button-has-type */
import React from 'react'
import PropTypes from 'prop-types'

import {
  DownloadIcon,
  LockClosedIcon, PencilIcon, TrashIcon, UploadIcon,
} from '@heroicons/react/outline'
import SpinnerIcon from './SpinnerIcon'

const getBtnIcon = (icon) => {
  let iconComp = null
  const iconClass = 'h-5 w-5'
  switch (icon) {
    case 'PencilIcon':
      iconComp = <PencilIcon className={iconClass} aria-hidden="true" />
      break
    case 'TrashIcon':
      iconComp = <TrashIcon className={iconClass} aria-hidden="true" />
      break
    case 'LockClosedIcon':
      iconComp = <LockClosedIcon className={iconClass} aria-hidden="true" />
      break
    case 'UploadIcon':
      iconComp = <UploadIcon className={iconClass} aria-hidden="true" />
      break
    case 'DownloadIcon':
      iconComp = <DownloadIcon className={iconClass} aria-hidden="true" />
      break
    default:
      iconComp = null
      break
  }
  return iconComp
}
const getBtnClassName = (btnColor, btnDisable, btnLoading, btnText, btnStyle) => {
  let className = `
    relative
    rounded-md
    shadow-sm
    font-medium
    text-sm
    uppercase
    transition-all
  `
  // kondisi padding
  if (btnText) {
    className += ' px-4 py-2 '
  } else {
    className += ' p-2 '
  }
  // kondisi jika color transparent
  if (btnColor !== 'transparent') {
    className += `
      text-white
    `
  } else {
    className += `
      text-gray-900
    `
  }
  // kondisi jika disable atau loading
  let bgLevel = '600'
  let bgHoverLevel = '500'
  if (btnDisable || btnLoading) {
    // jika disable atau loading, set lebih cerah
    bgLevel = '400'
    bgHoverLevel = '400'

    className += 'cursor-not-allowed'
  } else if (btnColor !== 'transparent') {
    // jika color transparent
    // jika tidak, ada style focus
    className += `
      focus:outline-none
      focus:ring-2
      focus:ring-offset-2
      focus:ring-${btnColor}-500
    `
  }
  // kondisi get bg color dan hover
  if (btnColor !== 'transparent') {
    className += `
      bg-${btnColor}-${bgLevel}
      dark:bg-${btnColor}-800
      hover:bg-${btnColor}-${bgHoverLevel}
      hover:dark:bg-${btnColor}-700
    `
  } else {
    // nothing
  }
  // kondisi style
  // const arrStyle = btnStyle.split(' ')
  // if (arrStyle.includes('text-center')) {
  //   className = className.replace('flex', '')
  // }
  className += btnStyle

  return className
}
function ButtonComp({
  btnText, btnType, btnColor, btnIcon, btnDisable, btnLoading, btnStyle, handleClick,
}) {
  return (
    <button
      className={getBtnClassName(btnColor, btnDisable, btnLoading, btnText, btnStyle)}
      type={btnType}
      disabled={btnDisable || btnLoading}
      onClick={() => handleClick()}
    >
      {
        (btnIcon && !btnLoading)
          ? (
            <span className={(btnText) ? 'absolute left-4' : ''}>{getBtnIcon(btnIcon)}</span>
          )
          : ''
      }
      {
        (btnLoading)
          ? (
            <span className={(btnText) ? 'absolute left-4' : ''}><SpinnerIcon /></span>
          )
          : ''
      }
      <span
        className={`
          ${(btnIcon !== '') ? 'pl-8' : ''}
        `}
      >
        {btnText}
      </span>
    </button>
  )
}
ButtonComp.propTypes = {
  btnType: PropTypes.string,
  btnColor: PropTypes.string,
  btnText: PropTypes.string,
  btnIcon: PropTypes.string,
  btnDisable: PropTypes.bool,
  btnLoading: PropTypes.bool,
  btnStyle: PropTypes.string,
  handleClick: PropTypes.func,
}
ButtonComp.defaultProps = {
  btnType: 'button',
  btnColor: 'brand',
  btnText: '',
  btnIcon: '',
  btnDisable: false,
  btnLoading: false,
  btnStyle: '',
  handleClick: () => null,
}

export default ButtonComp
