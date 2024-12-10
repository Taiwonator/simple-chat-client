import { useState } from 'react';
import cx from 'classnames';
import { Login } from '../../../types';

// Get the list of avatar file names from the public/avatars directory
const avatarFiles = Array.from({ length: 10 }, (_, i) => `/avatars/bottts-${i+1}.png`);

interface Props {
    login: Login
}

interface Errors {
  [key: string]: string;
}

type SelectAvatar = (src: string) => void

const Form = ({ login }: Props) => {
  const [value, setValue] = useState('');
  const [avatarSrc, setAvatarSrc] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const validate = () => {
    const errors: Errors = {}
    if(avatarSrc  === '') errors.avatar = 'Please select an avatar'
    if(value === '') errors.name = 'Please enter a nickname'
    if(Object.keys(errors).length > 0) {
      setErrors(errors)
      return false
    }
    return true
  }

  const performLogin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if(validate()) login(value, avatarSrc);
  }

  const selectAvatar: SelectAvatar = (src) => {
    if(avatarSrc === src) {
      setAvatarSrc('')
    } else {
      setAvatarSrc(src)
    }
  }

  const classNames = {
    button: () => {
      if(value === '' || avatarSrc === '') return "bg-gray-300 text-gray-700 dark:bg-gray-500 dark:text-gray-300"
      return "focus:ring-blue-300 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    }
  }

  return (
    <div
      id="authentication-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 flex h-screen max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-black/75 md:inset-0"
    >
      <div className="relative max-h-full w-full max-w-md p-4">
        <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
          <div className="flex items-center justify-between rounded-t border-b bg-black p-4 dark:border-gray-600 md:p-5">
            <h3 className="text-xl font-semibold text-white dark:text-white">
              Join a Chatroom
            </h3>
          </div>
          <div className="py-4 md:py-5">
            <form className="space-y-4" action="#">
              <div>
                <label
                  htmlFor="avatar"
                  className="mb-2 block px-4 text-sm font-medium text-gray-900 dark:text-white md:px-5"
                >
                  Avatar <span className="text-[red]">*</span>
                </label>
                <div className="flex flex-row overflow-x-auto pl-2">
                  {avatarFiles.map((src) => <AvatarButton key={src} src={src} selectAvatar={selectAvatar} isActive={src === avatarSrc} />)}
                </div>
                {errors.avatar && <p className="px-4 text-xs text-red-500 dark:text-red-400 md:px-5">{errors.avatar}</p>}
              </div>
              <div className="px-4 md:px-5">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your nickname <span className="text-[red]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-400"
                  placeholder="Santa's Little Helper"
                  required
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                {errors.name && <p className="text-xs text-red-500 dark:text-red-400">{errors.name}</p>}
              </div>
              <div className="px-4 md:px-5">
                <button 
                  className={cx("w-full rounded-lg  px-5 py-2.5 text-center text-sm font-medium text-white  focus:outline-none focus:ring-4 transition-all", classNames.button())}
                  onClick={(e) => performLogin(e)}
                >
                  Create user
                </button>
              </div>
              <div className="px-4 text-xs font-medium text-gray-500 dark:text-gray-300 md:px-5">
                This is an experiment so your data may be deleted at any time 👀
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AvatarButtonProps {
  src: string;
  selectAvatar: (src: string) => void;
  isActive: boolean;
}

function AvatarButton({ src, selectAvatar, isActive }: AvatarButtonProps) {
  
  const classNames = {
    avatarActive: () => {
        if(isActive) return "bg-green-400"
        return ""
    }
  }

  return (
    <button
      type="button"
      className={cx("shrink-0 grow rounded-full p-2 transition-all hover:bg-green-400 focus:outline-none focus:ring-4 focus:ring-gray-50 dark:bg-gray-900", classNames.avatarActive())}
      onClick={() => selectAvatar(src)}
    >
      <img
        src={src}
        alt="Avatar"
        className="size-10 rounded-full"
      />
      <span className="sr-only">Change avatar</span>
    </button>
  );
}

export default Form;
