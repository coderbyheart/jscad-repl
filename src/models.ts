type ModelModule = Record<string, unknown>
export type Model = () => unknown

// Every file in ./models/ is reachable under its file name (e.g.
// ./models/nordanWindowClip.ts → /nordanWindowClip), provided it exports a
// function with the same name that takes no required arguments.
const modules = import.meta.glob<ModelModule>('./models/*.ts')

const nameFromPath = (path: string): string =>
	path.replace(/^\.\/models\//, '').replace(/\.ts$/, '')

const candidates = Object.keys(modules).map(nameFromPath).sort()

export const loadModel = async (name: string): Promise<Model | undefined> => {
	const load = modules[`./models/${name}.ts`]
	if (load === undefined) return undefined
	const fn = (await load())[name]
	// Helpers like roundedRect({ width, ... }) have required arguments
	if (typeof fn !== 'function' || fn.length > 0) return undefined
	return fn as Model
}

// A module that fails to import is left out instead of breaking the list
export const listModels = async (): Promise<string[]> =>
	(await Promise.allSettled(candidates.map(loadModel))).flatMap((result, i) => {
		if (result.status === 'rejected') {
			console.error(`Failed to load model ${candidates[i]}`, result.reason)
			return []
		}
		return result.value !== undefined ? [candidates[i]] : []
	})
