import { Fragment, useEffect, useState } from 'react';
import './App.css';
import ButtonComp from './components/ButtonComp';
import CriptoJs from 'crypto-js'
import ReactJson from 'react-json-view'
import SwitchComp from './components/SwitchComp';
import { Tab } from '@headlessui/react';
import { ClipboardCheckIcon, ClipboardIcon } from '@heroicons/react/outline';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

function App() {

  const [form, setForm] = useState({})
  const [encryptResult, setEncryptResult] = useState('')
  const [decryptResult, setDecryptResult] = useState('')
  const [isEncryptJson, setIsEncryptJson] = useState(false)
  const [isDecryptJson, setIsDecryptJson] = useState(false)
  const [jsonDataEncrypt, setJsonDataEncrypt] = useState({})
  const [jsonDataDecrypt, setJsonDataDecrypt] = useState({})
  const [dataCopied, setDataCopied] = useState([false, false])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm((values) => ({ ...values, [name]: value }))
  }

  const onSubmitEncrypt = (e) => {
    e.preventDefault()
    
    const encrypted = CriptoJs.AES.encrypt(form.dataEncrypt, form.passwordEncrypt).toString()
    setEncryptResult(encrypted)
    setDataCopied([false, false])
  }

  const onSubmitDecrypt = (e) => {
    e.preventDefault()
    
    try {
      let decrypted = CriptoJs.AES.decrypt(form.dataDecrypt, form.passwordDecrypt)
      decrypted = decrypted.toString(CriptoJs.enc.Utf8)
      setDecryptResult(decrypted)
      if (isDecryptJson) {
        setJsonDataDecrypt(JSON.parse(decrypted))
      }
      if (decrypted === '') {
        toast.error('Cannot decrypt data', {
          theme: 'colored',
          autoClose: 1000,
          hideProgressBar: true
        })
      }
      setDataCopied([false, false])
    } catch (error) {
      setDecryptResult('')
      setJsonDataDecrypt({})
      toast.error('Cannot decrypt data', {
        theme: 'colored',
        autoClose: 1000,
        hideProgressBar: true
      })
      return false
    }
  }

  const copyToClipboard = (e) => {
    let el = null
    let newDataCopied = [...dataCopied]
    if (e === 'Encrypt') {
      el = document.getElementById('encryptedResult')
      newDataCopied[0] = true
    } else {
      el = document.getElementById('decryptedResult')
      newDataCopied[1] = true
    }
    el.select()
    el.setSelectionRange(0, 99999)
    navigator.clipboard.writeText(el.value)

    setDataCopied(newDataCopied)
    toast.success('Copied to clipboard', {
      theme: 'colored',
      autoClose: 1000,
      hideProgressBar: true
    })
  }

  const clearData = (e) => {
    const newDataCopied = [...dataCopied]
    if (e === 'Encrypt') {
      setForm((values) => ({ ...values, dataEncrypt: '', passwordEncrypt: '' }))
      setEncryptResult('')
      setJsonDataEncrypt({})
      newDataCopied[0] = false
    } else {
      setForm((values) => ({ ...values, dataDecrypt: '', passwordDecrypt: '' }))
      setDecryptResult('')
      setJsonDataDecrypt({})
      newDataCopied[1] = false
    }
    setDataCopied(newDataCopied)
  }

  useEffect(() => {
    if (isEncryptJson) {
      try {
        const json = JSON.parse(form.dataEncrypt)
        setJsonDataEncrypt(json)
      } catch (err) {
        setJsonDataEncrypt({})
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEncryptJson])

  
  useEffect(() => {
    if (isDecryptJson) {
      try {
        const json = JSON.parse(decryptResult)
        setJsonDataDecrypt(json)
      } catch (err) {
        setJsonDataDecrypt({})
        console.log('error', err)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDecryptJson])
  return (
    <>
      <div className='dark:bg-gray-900 dark:text-white min-h-screen'>
        <Tab.Group>
          <Tab.List>
            {
              ['Encrypt', 'Decrypt'].map((e) => (
                <Tab key={e} as={Fragment}>
                  {({ selected }) => (
                    <button
                      type="button"
                      className={`
                        p-4
                        ${selected ? 'border-b-2 border-brand-500' : 'border-b-2 border-transparent'}
                      `}
                    >
                      { e }
                    </button>
                  )}
                </Tab>
              ))
            }
            
          </Tab.List>
          <Tab.Panels>
            {
              ['Encrypt', 'Decrypt'].map((e) => (
                <Tab.Panel
                  key={e}
                >
                  <div className='p-4'>
                    <h3 className='font-medium uppercase pb-4'>
                      { e }
                    </h3>
                    <form onSubmit={(e === 'Encrypt') ? onSubmitEncrypt : onSubmitDecrypt}>
                      <div>
                        <div className='mb-4'>
                          <SwitchComp
                            enabled={(e === 'Encrypt') ? isEncryptJson : isDecryptJson}
                            setEnabled={(e === 'Encrypt') ? setIsEncryptJson : setIsDecryptJson}
                          />
                          <span className='ml-2'>
                            Show { (e === 'Encrypt') ? 'input' : 'output' } as JSON
                          </span>
                        </div>
                        {
                          ((e === 'Encrypt' && !isEncryptJson) || e === 'Decrypt') ? (
                            <textarea
                              className='t-form mb-4 h-48'
                              name={(e === 'Encrypt') ? 'dataEncrypt' : 'dataDecrypt'}
                              value={(e === 'Encrypt') ? form.dataEncrypt : form.dataDecrypt}
                              onChange={handleFormChange}
                              placeholder={`Data to ${e}`}
                              required
                            ></textarea>
                          ) : ''
                        }

                        {
                          (e === 'Encrypt' && isEncryptJson) ? (
                            <div className='max-h-96 overflow-y-auto mt-4 mb-4'>
                              <ReactJson src={jsonDataEncrypt} theme="ocean" />
                            </div>
                          ) : ''
                        }
                        
                        <input
                          className='t-form mb-4'
                          type="text"
                          name={(e === 'Encrypt') ? 'passwordEncrypt' : 'passwordDecrypt'}
                          value={(e === 'Encrypt') ? form.passwordEncrypt : form.passwordDecrypt}
                          onChange={handleFormChange}
                          placeholder="Password"
                          required
                        />
                        <ButtonComp
                          btnType="submit"
                          btnText={(e === 'Encrypt') ? 'Encrypt' : 'Decrypt'}
                          btnStyle=" w-full text-center"
                        />
                      </div>
                    </form>
                    {
                      (e === 'Encrypt' || (e === 'Decrypt' && !isDecryptJson)) ? (
                        <div
                          className={`
                            relative
                            ${
                              (
                                (e === 'Encrypt' && encryptResult === '') ||
                                (e === 'Decrypt' && decryptResult === '')
                              ) ? 'hidden' : 'block'
                            }
                          `}
                        >
                          <textarea
                            id={(e === 'Encrypt') ? 'encryptedResult' : 'decryptedResult'}
                            className='t-form mt-4 h-48'
                            value={(e === 'Encrypt') ? encryptResult : decryptResult}
                            disabled
                          />
                          <button
                            type="button"
                            className='absolute top-2 right-2 p-2 rounded-md border dark:border-gray-700 dark:bg-gray-800'
                            onClick={() => copyToClipboard(e)}
                          >
                            {
                              ((e === 'Encrypt' && dataCopied[0]) || (e === 'Decrypt' && dataCopied[1])) ? (
                                <ClipboardCheckIcon className='w-5 h-5 text-white' />
                              ) : (
                                <ClipboardIcon className='w-5 h-5 text-gray-500' />
                              )
                            }
                          </button>
                        </div>
                      ) : ''
                    }

                    {
                      (e === 'Decrypt' && isDecryptJson) ? (
                        <div className='max-h-96 overflow-y-auto mt-4'>
                          <ReactJson src={jsonDataDecrypt} theme="ocean" />
                        </div>
                      ) : ''
                    }

                    {
                      (
                        (e === 'Encrypt' && encryptResult === '') ||
                        (e === 'Decrypt' && decryptResult === '')
                      ) ? '' : (
                        <ButtonComp
                          btnType="button"
                          btnColor="red"
                          btnText="Clear"
                          btnStyle=" w-full text-center mt-4 "
                          handleClick={() => clearData(e)}
                        />
                      )
                    }
                    
                  </div>
                </Tab.Panel>
              ))
            }
          </Tab.Panels>
        </Tab.Group>
        
      </div>
      <ToastContainer />
      <div className='hidden'>
        <button className="  relative  rounded-md  shadow-sm  font-medium  text-sm  uppercase  transition-allpx-4 py-2     text-white      focus:outline-none    focus:ring-2    focus:ring-offset-2    focus:ring-brand-500      bg-brand-600    dark:bg-brand-800    hover:bg-brand-500    hover:dark:bg-brand-700  w-full text-center " type="submit"><span className="              ">Encrypt</span></button>
        <button className=" relative rounded-md shadow-sm font-medium text-sm uppercase transition-allpx-4 py-2    text-white    focus:outline-none   focus:ring-2   focus:ring-offset-2   focus:ring-red-500    bg-red-600   dark:bg-red-800   hover:bg-red-500   hover:dark:bg-red-700  w-full text-center" type="button"><span className="            ">Clear</span></button>
      </div>
    </>
  );
}

export default App;
