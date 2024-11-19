'use client'

import { useQuery } from '@tanstack/react-query'
import { ComponentProps } from '@/types/types'

export default function DepartmentSelect({
  name,
  label,
  value = '',
  onChange
}: ComponentProps) {
  const { data: departments = [], isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const res = await fetch('/api/departments')
      if (!res.ok) throw new Error('Failed to fetch departments')
      return res.json()
    }
  })

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        disabled={isLoading}
      >
        <option value="">Select Department</option>
        {departments.map((dept: string) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>
    </div>
  )
}