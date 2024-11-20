'use client'

import { ComponentProps } from '@/types/types'

export default function TextBox({ 
  name, 
  label, 
  value = '', 
  onChange 
}: Readonly<ComponentProps>) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  )
}
