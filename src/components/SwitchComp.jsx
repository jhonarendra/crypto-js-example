import { Switch } from "@headlessui/react";

export default function SwitchComp({ enabled, setEnabled, text }) {
  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`${
      enabled ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-700'
      } relative inline-flex h-6 w-11 items-center rounded-full`}
    >
      <span className="sr-only">{ text }</span>
      <span
      className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
      } inline-block h-4 w-4 transform rounded-full bg-white`}
      />
    </Switch>
  )
}