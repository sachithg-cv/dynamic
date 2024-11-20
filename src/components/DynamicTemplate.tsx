'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import type { 
  DynamicTemplateProps,  
  FieldConfig,
  Section,
} from '@/types/types'

// Define component paths map with absolute imports
const COMPONENT_PATHS = {
  textbox: () => import('@/components/common/TextBox'),
  departmentSelect: () => import('@/components/employee/DepartmentSelect')
} as const

type ComponentKey = keyof typeof COMPONENT_PATHS

export function DynamicTemplate({ 
  templateName,
  initialTemplate,
  initialArchetype,
  initialData = {}
}: Readonly<DynamicTemplateProps>) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData)

  // Get unique component types from template
  const requiredComponents = useMemo(() => {
    const componentTypes = new Set<ComponentKey>()
    
    initialTemplate.config.formFields.forEach(field => {
      if (field.type in COMPONENT_PATHS) {
        componentTypes.add(field.type as ComponentKey)
      }
    })
    
    return Array.from(componentTypes)
  }, [initialTemplate.config.formFields])

  // Dynamically import only required components
  const componentRegistry = useMemo(() => {
    const registry: Record<string, React.ComponentType<any>> = {}
    
    requiredComponents.forEach(componentType => {
      registry[componentType] = dynamic(COMPONENT_PATHS[componentType], {
        loading: () => <div className="animate-pulse h-10 bg-gray-100 rounded" />,
        ssr: false
      })
    })
    
    return registry
  }, [requiredComponents])

  const { data: templateData = {} } = useQuery({
    queryKey: ['templateData', templateName],
    queryFn: async () => {
      if (initialTemplate.config.api?.fetch) {
        const res = await fetch(initialTemplate.config.api.fetch)
        if (!res.ok) throw new Error('Failed to fetch template data')
        return res.json()
      }
      return {}
    },
    enabled: !!initialTemplate.config.api?.fetch,
    initialData: initialData
  })

  const handleFieldChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form data:', formData)
  }

  const renderHeaderSection = () => (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {initialTemplate.config.title}
      </h1>
      {initialTemplate.config.description && (
        <p className="text-gray-600">
          {initialTemplate.config.description}
        </p>
      )}
    </div>
  )

  const renderField = (fieldConfig: FieldConfig, index: number) => {
    const Component = componentRegistry[fieldConfig.type]
    
    if (!Component) {
      console.warn(`Component type "${fieldConfig.type}" is not registered`)
      return null
    }
    
    return (
      <Component
        key={`${fieldConfig.name}-${index}`}
        {...fieldConfig}
        value={formData[fieldConfig.name] ?? templateData[fieldConfig.name] ?? ''}
        onChange={(value: any) => handleFieldChange(fieldConfig.name, value)}
      />
    )
  }

  const renderContentSection = () => (
    <div className="space-y-4">
      {initialTemplate.config.formFields.map((fieldConfig, index) => 
        renderField(fieldConfig, index)
      )}
    </div>
  )

  const renderActionsSection = () => (
    <div className="mt-6">
      {initialTemplate.config.buttons.map((button, index) => (
        <button
          key={index}
          type={button.action === 'submit' ? 'submit' : 'button'}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          {button.label}
        </button>
      ))}
    </div>
  )

  const sectionRenderers = {
    header: renderHeaderSection,
    content: renderContentSection,
    actions: renderActionsSection
  }

  const renderSection = (section: Section) => {
    const renderer = sectionRenderers[section.id as keyof typeof sectionRenderers]
    return renderer ? (
      <div key={section.id} className={`section-${section.id}`}>
        {renderer()}
      </div>
    ) : null
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="max-w-2xl mx-auto p-6 bg-white shadow-sm rounded-lg"
    >
      {initialArchetype.layout.sections.map(renderSection)}
    </form>
  )
}