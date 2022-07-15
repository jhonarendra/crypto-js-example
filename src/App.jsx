import { useEffect, useState } from 'react';
import './App.css';
import ButtonComp from './components/ButtonComp';
import CriptoJs from 'crypto-js'// import the react-json-view component
import ReactJson from 'react-json-view'
import SwitchComp from './components/SwitchComp';

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
      setJsonDataDecrypt(JSON.parse(decrypted))
    } catch (error) {
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
  }, [isDecryptJson])
  return (
    <>
      <div className='dark:bg-gray-900 dark:text-white min-h-screen grid grid-cols-1 sm:grid-cols-2 sm:gap-4'>
        <div className='p-4'>
          <h3 className='font-medium uppercase py-4'>Encrypt</h3>
          <form onSubmit={onSubmitEncrypt}>
            <div>
              <div className='mb-4'>
                <SwitchComp
                  enabled={isEncryptJson}
                  setEnabled={setIsEncryptJson}
                />
                <span className='ml-2'>
                  Show input as JSON
                </span>
              </div>
              {
                (!isEncryptJson) ? (
                  <textarea
                    className='t-form mb-4 h-48'
                    name="dataEncrypt"
                    value={form.dataEncrypt || ''}
                    onChange={handleFormChange}
                    placeholder="Data to Encrypt"
                    required
                  ></textarea>
                ) : (
                  <ReactJson src={jsonDataEncrypt} theme="monokai" />
                )
              }
              
              <input
                className='t-form mb-4'
                type="text"
                name="passwordEncrypt"
                value={form.passwordEncrypt || ''}
                onChange={handleFormChange}
                placeholder="Password"
                required
              />
              <ButtonComp
                btnType="submit"
                btnText="Encrypt"
                btnStyle=" w-full text-center"
              />
            </div>
          </form>
          <div
            className='mt-4 p-4 border dark:border-gray-700 break-words'
          >
            { encryptResult }
          </div>
        </div>
        <div className='p-4'>
          <h3 className='font-medium uppercase py-4'>Decrypt</h3>
          <div className='mb-4'>
            <SwitchComp
              enabled={isDecryptJson}
              setEnabled={setIsDecryptJson}
            />
            <span className='ml-2'>
              Show output as JSON
            </span>
          </div>
          <form onSubmit={onSubmitDecrypt}>
            <div>
              <textarea
                className='t-form mb-4 h-48'
                name="dataDecrypt"
                value={form.dataDecrypt || ''}
                onChange={handleFormChange}
                placeholder="Data to Decrypt"
                required
              ></textarea>
              <input
                className='t-form mb-4'
                type="text"
                name="passwordDecrypt"
                value={form.passwordDecrypt || ''}
                onChange={handleFormChange}
                placeholder="Password"
                required
              />
              <ButtonComp
                btnType="submit"
                btnText="Decrypt"
                btnStyle=" w-full text-center "
              />
            </div>
          </form>
          {
            (!isDecryptJson) ? (
              <div
                className='mt-4 p-4 border dark:border-gray-700 break-words'
              >
                { decryptResult }
              </div>
            ) : (
              <div className='max-h-96 overflow-y-auto mt-4'>
                <ReactJson src={jsonDataDecrypt} theme="monokai" />
              </div>
            )
          }
        </div>
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
