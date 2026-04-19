import projectsDataRaw from './projectsData.json'

interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
  tags: string[]
}

const projectsData: Project[] = projectsDataRaw as Project[]

export default projectsData