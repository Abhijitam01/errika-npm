import { NextRequest, NextResponse } from 'next/server'
import JSZip from 'jszip'
import fs from 'fs'
import path from 'path'

// Template file structure - this would be loaded from your actual templates
const getTemplateFiles = async (templateId: string, projectName: string) => {
  // Path to templates in the parent errika-npm project
  const templatesPath = path.join(process.cwd(), '..', 'src', 'templates', templateId)
  
  const zip = new JSZip()
  const projectFolder = zip.folder(projectName)

  if (!projectFolder) {
    throw new Error('Failed to create project folder')
  }

  // Recursively add files to ZIP
  const addFilesToZip = (dirPath: string, zipFolder: JSZip) => {
    try {
      const files = fs.readdirSync(dirPath)
      
      for (const file of files) {
        const filePath = path.join(dirPath, file)
        const stat = fs.statSync(filePath)
        
        if (stat.isDirectory()) {
          const subFolder = zipFolder.folder(file)
          if (subFolder) {
            addFilesToZip(filePath, subFolder)
          }
        } else {
          let content = fs.readFileSync(filePath)
          let fileName = file
          
          // Handle gitignore file
          if (file === 'gitignore') {
            fileName = '.gitignore'
          }
          
          // Replace placeholders in text files
          if (file.match(/\.(ts|tsx|js|jsx|json|md|txt|html|css)$/)) {
            let textContent = content.toString()
            textContent = textContent.replace(/PROJECT_NAME/g, projectName)
            textContent = textContent.replace(/project-name/g, projectName)
            content = Buffer.from(textContent)
          }
          
          zipFolder.file(fileName, content)
        }
      }
    } catch (error) {
      console.error('Error reading template files:', error)
      // If templates are not available, create a basic structure
      createBasicTemplate(zipFolder, templateId, projectName)
    }
  }

  // Fallback basic template creator
  const createBasicTemplate = (zipFolder: JSZip, templateId: string, projectName: string) => {
    const packageJson = {
      name: projectName,
      version: '1.0.0',
      description: `A ${templateId} project generated with Errika`,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
      },
      dependencies: {},
    }

    zipFolder.file('package.json', JSON.stringify(packageJson, null, 2))
    zipFolder.file('README.md', `# ${projectName}\n\nGenerated with Errika\n`)
    zipFolder.file('.gitignore', 'node_modules\n.next\n.env.local\n')
  }

  // Try to add template files, fall back to basic structure
  addFilesToZip(templatesPath, projectFolder)

  return zip
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectName, template, packageManager } = body

    // Validate input
    if (!projectName || !template) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate project name
    if (!/^[a-z0-9-]+$/.test(projectName)) {
      return NextResponse.json(
        { error: 'Invalid project name. Use lowercase letters, numbers, and hyphens only.' },
        { status: 400 }
      )
    }

    // Generate ZIP file
    const zip = await getTemplateFiles(template, projectName)
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    // Return ZIP file
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${projectName}.zip"`,
      },
    })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate project' },
      { status: 500 }
    )
  }
}



