import { DynamicTemplate } from '@/components/DynamicTemplate'
import { templateLoader } from '@/utils/templateLoader'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

interface PageProps {
  params: Promise<{ template: string }>
}

// get the template name from the params
export default async function TemplatePage({ params }: PageProps) {
  // Await the params object
  const resolvedParams = await params

  if (!resolvedParams?.template) {
    notFound()
  }

  let templateData;
  let archetypeData;

  try {
    // Use the resolved params
    templateData = await templateLoader.loadTemplate(resolvedParams.template)
    archetypeData = await templateLoader.loadArchetype(templateData.archetype)
  } catch (error) {
    console.error('Error loading template:', error)
    notFound()
  }

  return (
    <Suspense fallback={<div>Loading template...</div>}>
      <DynamicTemplate 
        templateName={resolvedParams.template}
        initialTemplate={templateData}
        initialArchetype={archetypeData}
      />
    </Suspense>
  )
}

// Optional: Add metadata generation
export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params
  
  try {
    const templateData = await templateLoader.loadTemplate(resolvedParams.template)
    return {
      title: templateData.config.title || 'Template Page',
      description: templateData.config.description || 'Dynamic template page'
    }
  } catch {
    return {
      title: 'Template Page',
      description: 'Dynamic template page'
    }
  }
}

// Optional: Generate static params if needed
export async function generateStaticParams() {
  // List of templates to pre-render
  return [
    { template: 'employee-settings' }
  ]
}