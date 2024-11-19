// src/utils/templateLoader.ts
import type { Template, Archetype } from '@/types/types'

export const templateLoader = {
  async loadTemplate(name: string): Promise<Template> {
    if (!name) {
      throw new Error('Template name is required')
    }

    try {
      const template = await import(`@/templates/${name}.json`)
      return template.default
    } catch (error) {
      console.error(`Failed to load template: ${name}`, error)
      throw new Error(`Failed to load template: ${name}`)
    }
  },

  async loadArchetype(name: string): Promise<Archetype> {
    if (!name) {
      throw new Error('Archetype name is required')
    }

    try {
      const archetype = await import(`@/archetypes/${name}.json`)
      return archetype.default
    } catch (error) {
      console.error(`Failed to load archetype: ${name}`, error)
      throw new Error(`Failed to load archetype: ${name}`)
    }
  }
}