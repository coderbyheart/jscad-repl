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

export const listModels = async (): Promise<string[]> =>
	(
		await Promise.all(
			candidates.map(async (name) =>
				(await loadModel(name)) !== undefined ? name : undefined,
			),
		)
	).filter((name): name is string => name !== undefined)
