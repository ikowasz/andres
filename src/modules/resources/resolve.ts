import { resolve as pathResolve } from 'path'

export const DEFAULT_RESOURCES_LOCATION = pathResolve(process.cwd(), 'resources')

export const resolve = (pathPar: string, basePath: string = DEFAULT_RESOURCES_LOCATION) =>
{
  if (pathPar[0] === '/')
  {
    return pathPar
  }

  const path = pathResolve(basePath, pathPar)

  return path
}
