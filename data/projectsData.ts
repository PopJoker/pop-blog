import projectsDataRaw from './projectsData.json'

interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
  tags: string[]
}

// 指向 .projects 陣列
const projectsData: Project[] = (projectsDataRaw as { projects: Project[] }).projects

export default projectsData