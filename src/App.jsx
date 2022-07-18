import { Fragment, useEffect, useState } from 'react';
import './App.css';
import ButtonComp from './components/ButtonComp';
import CriptoJs from 'crypto-js'// import the react-json-view component
import ReactJson from 'react-json-view'
import SwitchComp from './components/SwitchComp';
import { Tab } from '@headlessui/react';

function App() {

  const [form, setForm] = useState({})
  const [encryptResult, setEncryptResult] = useState('')
  const [decryptResult, setDecryptResult] = useState('')
  const [isEncryptJson, setIsEncryptJson] = useState(false)
  const [isDecryptJson, setIsDecryptJson] = useState(false)
  const [jsonDataEncrypt, setJsonDataEncrypt] = useState({})
  const [jsonDataDecrypt, setJsonDataDecrypt] = useState({})

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm((values) => ({ ...values, [name]: value }))
  }

  const onSubmitEncrypt = (e) => {
    e.preventDefault()
    
    const encrypted = CriptoJs.AES.encrypt(form.dataEncrypt, form.passwordEncrypt).toString()
    setEncryptResult(encrypted)
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
    } catch (error) {
      console.log(error)
      setDecryptResult('')
      setJsonDataDecrypt({})
      return false
    }
  }

  useEffect(() => {
    if (isEncryptJson) {
      try {
        const json = JSON.parse(form.dataEncrypt)
        setJsonDataEncrypt(json)
      } catch (err) {
        setJsonDataEncrypt({})
        console.log('error', err)
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
                    <h3 className='font-medium uppercase py-4'>
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
                          (e === 'Encrypt' && !isEncryptJson) ? (
                            <textarea
                              className='t-form mb-4 h-48'
                              name="dataEncrypt"
                              value={form.dataEncrypt || ''}
                              onChange={handleFormChange}
                              placeholder="Data to Encrypt"
                              required
                            ></textarea>
                          ) : ''
                        }
                        {
                          (e === 'Encrypt' && isEncryptJson) ? (
                            <ReactJson src={jsonDataEncrypt} theme="monokai" />
                          ) : ''
                        }
                        {
                          (e === 'Decrypt') ? (
                            <textarea
                              className='t-form mb-4 h-48'
                              name="dataDecrypt"
                              value={form.dataDecrypt || ''}
                              onChange={handleFormChange}
                              placeholder="Data to Decrypt"
                              required
                            ></textarea>
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
                      (e === 'Encrypt') ? (
                        <div
                          className='mt-4 p-4 border dark:border-gray-700 break-words'
                        >
                          { encryptResult }
                        </div>
                      ) : ''
                    }

                    {
                      (e === 'Decrypt' && !isDecryptJson) ? (
                        <div
                          className='mt-4 p-4 border dark:border-gray-700 break-words'
                        >
                          { decryptResult }
                        </div>
                      ) : ''
                    }
                    {
                      (e === 'Decrypt' && isDecryptJson) ? (
                        <div className='max-h-96 overflow-y-auto mt-4'>
                          <ReactJson src={jsonDataDecrypt} theme="monokai" />
                        </div>
                      ) : ''
                    }
                  </div>
                </Tab.Panel>
              ))
            }
          </Tab.Panels>
        </Tab.Group>
      </div>
      <div className='hidden'>
      <button className="
        relative
        rounded-md
        shadow-sm
        font-medium
        text-sm
        uppercase
        transition-all
      px-4 py-2 
          text-white
        
          focus:outline-none
          focus:ring-2
          focus:ring-offset-2
          focus:ring-brand-500
        
          bg-brand-600
          dark:bg-brand-800
          hover:bg-brand-500
          hover:dark:bg-brand-700
        w-full text-center " type="submit"><span className="
              
            ">Encrypt</span></button>
      </div>
    </>
  );
}

export default App;
