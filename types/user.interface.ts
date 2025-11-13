import type { CompanyFromDadata } from "./company.interface"

export interface User {
	_id: string
	name: string
	email: string
	password: string
	tgId: number | null
	roles: string[]
	company: CompanyFromDadata | null
	isModerated: boolean
}
